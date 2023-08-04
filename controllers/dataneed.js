//載入相對應的model
const Dataneed = require('../models/index').dataneed;
const Subact=require('../models/index').subact;
const Term=require('../models/index').term;
const Case=require('../models/index').case;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/dataneed !!");
    var statusreport=ctx.query.statusreport;
    console.log("got query:"+statusreport);
    var personID=ctx.params.id;
    await Dataneed.find({}).then(async dataneeds=>{
        //console.log("found dataneeds:"+dataneeds);
        console.log("type of dataneeds:"+typeof(dataneeds));
        console.log("type of 1st dataneed:"+typeof(dataneeds[0]));
        //console.log("1st dataneed:"+dataneeds[0].a10datatype)
        console.log("No. of dataneed:"+dataneeds.length)
        let dataneedlist=encodeURIComponent(JSON.stringify(dataneeds));
        console.log("type of dataneeds:"+typeof(dataneedlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("dataneed/listpage",{
        //ctx.response.send({
            dataneedlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Dataneed.find({}) failed !!");
        console.log(err)
    })
},


//到新增資料頁
async inputpage(ctx, next) {
    console.log("進入dataneed controller的inputpage");
    var personID=ctx.params.id;
    console.log("personID:"+personID);
    var statusreport=ctx.query.statusreport;
    console.log("got statusreport:"+statusreport);
    var status=ctx.query.status;
    console.log("got status:"+status);
    var caseID=ctx.query.caseID;
    console.log("got caseID:"+caseID);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Term.find({a15model:{$in:"dataneed"}}).then(async terms=>{
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

    await Case.findOne({_id:caseID})
      .then(async casex=>{
        let activityID=casex.a10activityID;
        await Subact.find({$and:[{a05activityID:activityID},{a10type:"baseline"}]})
            .then(async subacts=>{
              console.log("1st of subacts:"+subacts[0]);
                subactlist=encodeURIComponent(JSON.stringify(subacts));
                console.log("type of subactlist:"+typeof(subactlist));
                })
            .catch(err=>{
                console.log("Subact.find({}) failed !!");
                console.log(err)
            })
        })
      .catch(err=>{
      console.log("Case.findOne({}) failed !!");
      console.log(err)
      })
  await ctx.render("dataneed/inputpage",{
      statusreport,
      status,
      personID,
      caseID,
      subactlist,
      termlist
    })
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("got query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered dataneed.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Dataneed.findById(ctx.params.id)
        .then(async dataneedx=>{
            console.log("Dataneedx:"+dataneedx);
            let dataneed=encodeURIComponent(JSON.stringify(dataneedx));
            console.log("dataneed:"+dataneed);
            console.log("type of dataneed:"+typeof(dataneed));
            await ctx.render("dataneed/editpage",{
                dataneed:dataneed,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Dataneed.findById(ctx.params.id) failed !!");
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
  console.log("進入dataneed controller的add");
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
  var new_dataneed = new Dataneed(ctx.request.body);
    console.log("got new_dataneed:"+new_dataneed.a10datatype);
    await new_dataneed.save()
    .then(()=>{
        console.log("Saving new_dataneed....");
    statusreport="儲存單筆佐證資料項目後進入本頁";
    let redirecturl;
    let basepath="/basedcarbon/dataneed";
    let querytext="?statusreport=由單筆輸入佐證資料項目頁回到本頁&status="+status+"&caseID="+caseID;
    switch(this.status){
      case "0":redirecturl=basepath+"/listpage/"+personID+querytext;break;
      case "5":redirecturl=basepath+"/baselineitem/"+personID+querytext;break;
      case "6":redirecturl=basepath+"/newactitem/"+personID+querytext;break;
      case "7":redirecturl=basepath+"/postitem/"+personID+querytext;break;
      default:redirecturl=basepath+"/listpage/"+personID+querytext;break
    }
    ctx.redirect(redirecturl)
    })
    .catch((err)=>{
        console.log("Dataneed.save() failed !!")
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
    var columnno=7;
    var dataneedArray;
    var tempstore=new Array(columnno);
    for (let i=0;i<columnno;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<columnno;i++){
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
        dataneedArray=new Array(lineno);

        let saveone=(async new_dataneed=>{
                await new_dataneed.save()
                .then(()=>{
                    console.log("Saved document:"+new_dataneed.a10datatype)
                    })
                .catch((err)=>{
                    console.log("Dataneed.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            dataneedArray[k]=new Array(columnno);
            for (let m=0;m<columnno;m++){
                dataneedArray[k][m]=tempstore[m][k]
                //console.log(dataneedArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of dataneedArray:"+dataneedArray[0][0]);
        console.log("read total lines:"+dataneedArray.length);
        let sequence=Promise.resolve();
        dataneedArray.forEach(function(dataneedj){
            sequence=sequence.then(function(){
                var new_dataneed = new Dataneed({
                  a05subactID:dataneedj[0],
                  a10datatype:dataneedj[1],
                  a15timing:dataneedj[2],
                  a20dataname:dataneedj[3],
                  a25describe:dataneedj[4],
                  a30check:dataneedj[5],
                  a99footnote:dataneedj[6]

                });//EOF new dataneed
                    saveone(new_dataneed)
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
        statusreport="完成dataneed批次輸入";
        await ctx.render("branch/datamanage",{
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
    console.log("got query:"+statusreport);
    await Dataneed.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a dataneed....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/dataneed/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Dataneed.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("got query:"+statusreport);
    await Dataneed.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newdataneed)=>{
        console.log("Saving new_dataneed....:"+newdataneed);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/dataneed/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Dataneed.findOneAndUpdate() failed !!")
        console.log(err)
    })
},
async baselineoperate(ctx,next){
  console.log("found route /base4dcarbon/dataneed/baselineitem !!");
  var statusreport=ctx.query.statusreport;
  console.log("got query:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
  var personID=ctx.params.id;
  var activityID;
  var allbaseline=new Array();
  var subactlist,dataneedlist,termlist;
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
  await Term.find({a15model:{$in:"subact"}}).then(async terms=>{
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
    await Subact.find({$and:[{a05activityID:activityID},{a10type:"baseline"}]})
        .then(async subacts=>{
          console.log("1st of subacts:"+subacts[0]);
          for(subactx of subacts){
              await Dataneed.find({$and:[{a05subactID:subactx._id},{a10datatype:"baseline"}]})
                  .then(async dataneeds=>{
                      console.log("type of dataneeds:"+typeof(dataneeds));
                      console.log("1st dataneeds:"+dataneeds[0]);
                      console.log("No. of dataneeds:"+dataneeds.length);
                      allbaseline=allbaseline.concat(dataneeds);
                      })
                  .catch(err=>{
                      console.log("Dataneed.find({}) failed !!");
                      console.log(err)
                  })
              console.log("No. of allbaseline:"+allbaseline.length)
              }
            dataneedlist=encodeURIComponent(JSON.stringify(allbaseline));
            console.log("type of dataneeds:"+typeof(dataneedlist));
            console.log("no. of subacts:"+subacts.length);
            subactlist=encodeURIComponent(JSON.stringify(subacts));
            console.log("type of subactlist:"+typeof(subactlist));
            })
        .catch(err=>{
            console.log("Subact.find({}) failed !!");
            console.log(err)
        })
    await ctx.render("dataneed/baselineitem",{
            subactlist,
            dataneedlist,
            termlist,
            caseID,
            personID,
            statusreport
        })
    },
async newactoperate(ctx,next){
  console.log("found route /base4dcarbon/dataneed/newactitem !!");
  var statusreport=ctx.query.statusreport;
  console.log("got query:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
  var personID=ctx.params.id;
  var activityID;
  var allbaseline=new Array();
  var subactlist,dataneedlist;
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
  await Term.find({a15model:{$in:"subact"}}).then(async terms=>{
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
    await Subact.find({$and:[{a05activityID:activityID},{a10type:"baseline"}]})
        .then(async subacts=>{
          console.log("1st of subacts:"+subacts[0]);
          for(subactx of subacts){
              await Dataneed.find({$and:[{a05subactID:subactx._id},{a10datatype:"evidence"}]})
                  .then(async dataneeds=>{
                      console.log("type of dataneeds:"+typeof(dataneeds));
                      console.log("1st dataneeds:"+dataneeds[0]);
                      console.log("No. of dataneeds:"+dataneeds.length);
                      allbaseline=allbaseline.concat(dataneeds);
                      })
                  .catch(err=>{
                      console.log("Dataneed.find({}) failed !!");
                      console.log(err)
                  })
              console.log("No. of allbaseline:"+allbaseline.length)
              }
            dataneedlist=encodeURIComponent(JSON.stringify(allbaseline));
            console.log("type of dataneeds:"+typeof(dataneedlist));
            console.log("no. of subacts:"+subacts.length);
            subactlist=encodeURIComponent(JSON.stringify(subacts));
            console.log("type of subactlist:"+typeof(subactlist));
            })
        .catch(err=>{
            console.log("Subact.find({}) failed !!");
            console.log(err)
        })
    await ctx.render("dataneed/newactitem",{
            subactlist,
            dataneedlist,
            termlist,
            caseID,
            personID,
            statusreport
        })
    },
async postoperate(ctx,next){
  console.log("found route /base4dcarbon/dataneed/postitem !!");
  var statusreport=ctx.query.statusreport;
  console.log("got query:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
  var personID=ctx.params.id;
  var activityID;
  var allbaseline=new Array();
  var subactlist,dataneedlist;
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
  await Term.find({a15model:{$in:"subact"}}).then(async terms=>{
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
    await Subact.find({$and:[{a05activityID:activityID},{a10type:"baseline"}]})
        .then(async subacts=>{
          console.log("1st of subacts:"+subacts[0]);
          for(subactx of subacts){
              await Dataneed.find({$and:[{a05subactID:subactx._id},{a10datatype:"persist"}]})
                  .then(async dataneeds=>{
                      console.log("type of dataneeds:"+typeof(dataneeds));
                      console.log("1st dataneeds:"+dataneeds[0]);
                      console.log("No. of dataneeds:"+dataneeds.length);
                      allbaseline=allbaseline.concat(dataneeds);
                      })
                  .catch(err=>{
                      console.log("Dataneed.find({}) failed !!");
                      console.log(err)
                  })
              console.log("No. of allbaseline:"+allbaseline.length)
              }
            dataneedlist=encodeURIComponent(JSON.stringify(allbaseline));
            console.log("type of dataneeds:"+typeof(dataneedlist));
            console.log("no. of subacts:"+subacts.length);
            subactlist=encodeURIComponent(JSON.stringify(subacts));
            console.log("type of subactlist:"+typeof(subactlist));
            })
        .catch(err=>{
            console.log("Subact.find({}) failed !!");
            console.log(err)
        })
    await ctx.render("dataneed/postitem",{
            subactlist,
            dataneedlist,
            termlist,
            caseID,
            personID,
            statusreport
        })
    }

}//EOF export
