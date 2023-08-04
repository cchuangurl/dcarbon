//載入相對應的model
const Emissor = require('../models/index').emissor;
const Term = require('../models/index').term;
const Case = require('../models/index').case;
const Subact = require('../models/index').subact;

const Input = require('../models/index').input;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/emissor !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Emissor.find({}).then(async emissors=>{
        //console.log("found emissors:"+emissors);
        console.log("type of emissors:"+typeof(emissors));
        console.log("type of 1st emissor:"+typeof(emissors[0]));
        //console.log("1st emissor:"+emissors[0].a05caseID)
        console.log("No. of emissor:"+emissors.length)
        let emissorlist=encodeURIComponent(JSON.stringify(emissors));
        console.log("type of emissors:"+typeof(emissorlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("emissor/listpage",{
        //ctx.response.send({
            emissorlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Emissor.find({}) failed !!");
        console.log(err)
    })
},


//到新增資料頁
async inputpage(ctx, next) {
  console.log("get /base4dcarbon/method/formula!!")
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
  var personID=ctx.params.id;
  var allinput=new Array();
  var activityID;
  var thecase, theactivity,termlist,subactlist,inputlist,emissorlist;
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
  await Case.findById(caseID)
    .then(async casex=>{
        console.log("Casex:"+casex);
        activityID=casex.a10activityID;
        console.log("activityID:"+activityID);
        })
    .catch(err=>{
        console.log("Case.findById() failed !!");
        console.log(err)
      })
  await Term.find({a15model:{$in:"input"}}).then(async terms=>{
    console.log("type of terms:"+typeof(terms));
    console.log("type of 1st term:"+typeof(terms[0]));
    console.log("1st term:"+terms[0])
    console.log("No. of term:"+terms.length)
    termlist=encodeURIComponent(JSON.stringify(terms));
    console.log("type of termlist:"+typeof(termlist));
      })
      .catch(err=>{
        console.log("Term.find({}) failed !!");
        console.log(err)
      })
  await Subact.find({a05activityID:activityID})
      .then(async subacts=>{
        console.log("1st of subacts:"+subacts[0]);
        for(subactx of subacts){
            await Input.find({a05subactID:subactx._id})
                .then(async inputs=>{
                    console.log("type of inputs:"+typeof(inputs));
                    console.log("1st inputs:"+inputs[0]);
                    console.log("No. of inputs:"+inputs.length);
                    allinput=allinput.concat(inputs);
                    })
                .catch(err=>{
                    console.log("Input.find({}) failed !!");
                    console.log(err)
                })
            console.log("No. of allinput:"+allinput.length)
            }
          inputlist=encodeURIComponent(JSON.stringify(allinput));
          console.log("type of inputs:"+typeof(inputlist));
          console.log("no. of subacts:"+subacts.length);
          subactlist=encodeURIComponent(JSON.stringify(subacts));
          console.log("type of subactlist:"+typeof(subactlist));
          })
      .catch(err=>{
          console.log("Subact.find({}) failed !!");
          console.log(err)
      })
	await ctx.render("emissor/inputpage",{
		statusreport,
    status,
    personID,
    caseID,
    termlist,
    subactlist,
    inputlist,
    activityID
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered emissor.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Emissor.findById(ctx.params.id)
        .then(async emissorx=>{
            console.log("Emissorx:"+emissorx);
            let emissor=encodeURIComponent(JSON.stringify(emissorx));
            console.log("emissor:"+emissor);
            console.log("type of emissor:"+typeof(emissor));
            await ctx.render("emissor/editpage",{
                emissor:emissor,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Emissor.findById(ctx.params.id) failed !!");
            console.log(err)
        })
},

//依參數id取得資料
retrieve(req,res){

},
//依參數no取得一筆資料
findByNo(req,res){

},

//寫入一筆資料
async create(ctx,next){
  console.log("進入emissor controller的add");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var {statusreport}=ctx.request.body;
  console.log("got statusreport:"+statusreport);
  var {status}=ctx.request.body;
  console.log("got status:"+status);
  var {caseID}=ctx.request.body;
  console.log("got caseID:"+caseID);
  if(statusreport===undefined){
      statusreport="status未傳成功!"
  }
    var new_emissor = new Emissor(ctx.request.body);
    console.log("got new_emissor:"+new_emissor.a15nickname);
    await new_emissor.save()
    .then(()=>{
        console.log("Saving new_emissor....");
    statusreport="儲存單筆具體排放源資料後進入本頁";
    let redirecturl;
    let basepath="/base4dcarbon";
    let querytext0="?statusreport="+statusreport+"&status="+status;
    let querytext5="?statusreport="+statusreport+"&status="+status+"&caseID="+caseID;
    switch(status){
      case "0":redirecturl=basepath+"/emissor/listpage/"+personID+querytext0;break;
      case "5":redirecturl=basepath+"/method/formula/"+personID+querytext5;break;
      default:redirecturl=basepath+"/emissor/listpage/"+personID+querytext0
    }
    ctx.redirect(redirecturl)
    })
    .catch((err)=>{
        console.log("Emissor.save() failed !!")
        console.log(err)
    })
},
//批次新增資料
async batchinput(ctx, next){
    var statusreport=ctx.query.statusreport;
    var datafile=ctx.query.datafile;
    console.log("got the name of datafile:"+datafile)
    // 引用需要的模組
    const fs = require('fs');
    const path=require("path");
    const readline = require('readline');
    // 逐行讀入檔案資料
    //定義輸出串流
    //var writeStream = fs.createWriteStream('out.csv');

    //定義讀入串流 (檔案置於/public目錄下)
    let filepath=path.join(__dirname,"../public/csv/");
    var lineReader = readline.createInterface({
        input: fs.createReadStream(filepath+datafile+'.csv')
    });
    var lineno=0;
    var documentlength=13;
    var emissorArray;
    var tempstore=new Array(documentlength);
    for (let i=0;i<documentlength;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<documentlength;i++){
            tempstore[i][lineno]=values[i].trim();
        }
        lineno++;
        console.log("read line:"+data)
    });//EOF lineReader.on
    resolve();
            })//EOF promise
    })//EOF readfile
    let savedata=(()=>{
        return new Promise((resolve, reject)=>{
        emissorArray=new Array(lineno);

        let saveone=(async new_emissor=>{
                await new_emissor.save()
                .then(()=>{
                    console.log("Saved document:"+new_emissor.a05caseID)
                    })
                .catch((err)=>{
                    console.log("Emissor.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            emissorArray[k]=new Array(documentlength);
            for (let m=0;m<documentlength;m++){
                emissorArray[k][m]=tempstore[m][k]
                //console.log(emissorArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of emissorArray:"+emissorArray[0][0]);
        console.log("read total lines:"+emissorArray.length);
        let sequence=Promise.resolve();
        emissorArray.forEach(function(emissorj){
            sequence=sequence.then(function(){
                var new_emissor = new Emissor({
                  a05subactID:emissorj[0],
                  a10inputID:emissorj[1],
                  a15nickname:emissorj[2],
                  a20describe:emissorj[3],
                  a25emittype:emissorj[4],
                  a30emissorunit:emissorj[5],
                  a35coeffunit:emissorj[6],
                  a40unit2ton:emissorj[7],
                  a45quantity:emissorj[8],
                  a50scale:emissorj[9],
                  a55coefficientID:emissorj[10],
                  a60renew:emissorj[11],
                  a99footnote:emissorj[12]
                });//EOF new emissor
                    saveone(new_emissor)
                .catch(err=>{
                    console.log(err)
                })
            })//EOF sequence
            })//EOF forEach
            resolve();
        })//EOF promise
        })//EOF savedata
    await readfile()
    .then(()=>{
        setTimeout(savedata,3000)
    })
    .then(async ()=>{
        //console.log("going to list prject....");
        //ctx.redirect("/base4dcarbon/project/?statusreport="+statusreport)
        console.log("go back to datamanage1.ejs");
        statusreport="完成emissor批次輸入";
        await ctx.render("innerweb/datamanage/datamanagetemp",{
            statusreport
        })
    })
    .catch((err)=>{
        console.log("ctx.redirect failed !!")
        console.log(err)
    })
},
//依參數id刪除資料
async destroy(ctx,next){
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    await Emissor.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a emissor....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/emissor/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Emissor.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Emissor.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newemissor)=>{
        console.log("Saving new_emissor....:"+newemissor);
    statusreport="更新單筆具體排放源後進入本頁";
    ctx.redirect("/base4dcarbon/emissor/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Emissor.findOneAndUpdate() failed !!")
        console.log(err)
    })
},
//選擇要認領參數
async move2collect(ctx, next) {
  console.log("found route /base4dcarbon/emissor/choose !!");
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var emissorID=ctx.query.emissorID;
  console.log("got emissorID:"+emissorID);
  var personID=ctx.params.id;
  if(statusreport===undefined){
      statusreport="status未傳成功!"
  }
  await Emissor.findById({_id:emissorID})
      .then(async emissorx=>{
          console.log("Emissorx:"+emissorx);
          emissorx.a60renew=personID;
          await Emissor.findOneAndUpdate({_id:emissorID}, emissorx)
          .then(async (newemissor)=>{
              console.log("Saving new_emissor....:"+newemissor.a15nickname);
              statusreport="更新單筆具體排放源後進入本頁";
              await ctx.redirect("/base4dcarbon/branch/collecter/findemissor/"+personID+"?statusreport="+statusreport)
          })
          .catch((err)=>{
              console.log("Emissor.findOneAndUpdate() failed !!")
              console.log(err)
          })
      })
      .catch(err=>{
          console.log("Emissor.findById(emissorID) failed !!");
          console.log(err)
      })
}
}//EOF export
