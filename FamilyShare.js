var createThumb = function (fileObj, readStream, writeStream) {

  // Transform the image into a 10x10px thumbnail
  gm(readStream, fileObj.name()).resize('100', '100').stream().pipe(writeStream);
};

Images = new FS.Collection("images", {
  stores: [
    new FS.Store.FileSystem("thumbs", {transformWrite: createThumb}),
    new FS.Store.FileSystem("images")
  ]/*,
   filter: {
   allow: {
   contentTypes: ['image/*'] //allow only images in this FS.Collection
   }
   }*/
});

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.album.helpers({
    counter: function () {
      return Session.get('counter');
    },
    images: function () {
      //Meteor.call('findImage');
      return Images.find();
    },
    thumbs: function () {
      //Meteor.call('findImage');
      return Images.find();
    }
  });

  Template.album.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    },
    'change .fileInput': function (event, template) {
      event.preventDefault();
      FS.Utility.eachFile(event, function (file) {
        var fileObj = new FS.File(file);
        //Meteor.call('insertImage', fileObj);
        Images.insert(fileObj, function (err) {
          console.log(err);
        });
      });
    },
    'click .removepic': function (event, template) {
      event.preventDefault();
      Images.remove({_id:this._id});
      //Meteor.call('removeImage', {_id: this._id});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
