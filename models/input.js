var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var InputSchema = new Schema(
  {
    a05subactID:{type:Schema.Types.ObjectID,required:false},
    a10inputtype:{type:String,required:false},
    a15nickname:{type:String,required:false},
    a20describe:{type:String,required:false},
    a25loyalistID:{type:Schema.Types.ObjectID,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for Input's URL
InputSchema
.virtual('url')
.get(function () {
  return '/base4dcarbon/Input/' + this._id;
});
InputSchema.set("toJSON",{getters:true,virtual:true});
InputSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Input', InputSchema);
