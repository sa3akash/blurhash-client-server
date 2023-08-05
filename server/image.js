const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
    url: {type: String},
    hash: {type: String},
    width: {type: String},
    height: {type: String}
})





const ImageSchema = mongoose.model('ImageSchema', imageSchema, "ImageDB")
module.exports = {
    ImageSchema
}