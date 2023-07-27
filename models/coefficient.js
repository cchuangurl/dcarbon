var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CoefficientSchema = new Schema(
  {
    a10data:{type:Number,required:false},
    a15unit:{type:String,required:false},
    a20describe:{type:String,required:false},
    a25sourceID:{type:Schema.Types.ObjectID,required:false},
    a30detail:{type:String,required:false},
    a35loyalistID:{type:Schema.Types.ObjectID,required:false},
    a40when:{type:Date,required:false},
    a45renew:{type:String,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for coefficient's URL
CoefficientSchema
.virtual('url')
.get(function () {
  return '/base4dcarbon/coefficient/' + this._id;
});
CoefficientSchema.set("toJSON",{getters:true,virtual:true});
CoefficientSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Coefficient', CoefficientSchema);
