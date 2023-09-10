var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EvidenceSchema = new Schema(
  {
    a05caseID:{type:Schema.Types.ObjectID,required:false},
    a10needdataID:{type:Schema.Types.ObjectID,required:false},
    a15uploadtime:{type:Date,required:false},
    a20datatype:{type:String,required:false},
    a25filetype:{type:String,required:false},
    a30filename:{type:String,required:false},
    a35datahash:{type:String,required:false},
    a40datablock:{type:Number,required:false},
    a45score:{type:Number,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for evidence's URL
EvidenceSchema
.virtual('url')
.get(function () {
  return '/base4dcarbon/evidence/' + this._id;
});
EvidenceSchema.set("toJSON",{getters:true,virtual:true});
EvidenceSchema.set("toObject",{getters:true,virtual:true});
//Export model
module.exports = mongoose.model('Evidence', EvidenceSchema);
