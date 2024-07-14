const mongoose = require('mongoose');

const imageUploadSchema = mongoose.Schema({
    images: [{
        type: String,
        required: true
    }]
});

imageUploadSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

imageUploadSchema.set('toJSON', {
    virtuals: true,
});

const ImageUpload = mongoose.model('ImageUpload', imageUploadSchema);

module.exports = { ImageUpload, imageUploadSchema };
