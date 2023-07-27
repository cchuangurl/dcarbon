var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EmissorSchema = new Schema(
  {
    a05subactID:{type:Schema.Types.ObjectID,required:false},
    a10inputID:{type:Schema.Types.ObjectID,required:false},
    a15nickname:{type:String,required:false},
    a20describe:{type:String,required:false},
    a25emittype:{type:String,required:false},
    a30emissorunit:{type:String,required:false},
    a35coeffunit:{type:String,required:false},
    a40unit2ton:{type:Number,required:false},
    a45quantity:{type:Number,required:false},
    a50scale:{type:Number,required:false},
    a55coefficientID:{type:Schema.Types.ObjectID,required:false},
    a60renew:{type:String,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for Emissor's URL
EmissorSchema
.virtual('url')
.get(function () {
  return '/base4dcarbon/Emissor/' + this._id;
});
EmissorSchema.set("toJSON",{getters:true,virtual:true});
EmissorSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Emissor', EmissorSchema);
