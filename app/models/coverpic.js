var mongoose = require('mongoose');
const Schema = mongoose.Schema;
// ==================================
// FAMILY MODEL
// ==================================

const CoverPictureSchema = new Schema({
  userEmail: {
    type: String,
    required: true
  },
  posterId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  imgPath: {
    type: String,
    required: true
  }
});
//Name of my Model is Family.  In the quotes is the name of the collection
// //and the collection will be modeled after my FamilySchema
const CoverPicture = mongoose.model('coverpics', PCoverPictureSchema);
// module.exports = mongoose.model('pictureUpload', PictureSchema);
// Here I am exporting the Model to acsess in other files
module.exports = CoverPicture;
