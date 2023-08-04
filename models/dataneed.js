var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DataneedSchema = new Schema(
  {
    a05subactID:{type:Schema.Types.ObjectID,required:false},
    a10datatype:{type:String,required:false},
    a15timing:{type:Date,required:false},
    a20dataname:{type:String,required:false},
    a25describe:{type:String,required:false},
    a30check:{type:Number,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for dataneed's URL
DataneedSchema
.virtual('url')
.get(function () {
  return '/base4dcarbon/dataneed/' + this._id;
});
DataneedSchema.set("toJSON",{getters:true,virtual:true});
DataneedSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Dataneed', DataneedSchema);
