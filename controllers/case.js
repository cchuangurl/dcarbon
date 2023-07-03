//載入相對應的model
const Case = require('../models/index').case;
const Term = require('../models/index').term;
const Applicant = require('../models/index').applicant;
const Progress = require('../models/index').progress;
const Activity = require('../models/index').activity;
const User = require('../models/index').user;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/case !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Case.find({}).then(async cases=>{
        //console.log("found cases:"+cases);
        console.log("type of cases:"+typeof(cases));
        console.log("type of 1st case:"+typeof(cases[0]));
        //console.log("1st case:"+cases[0].a15casename)
        console.log("No. of case:"+cases.length)
        let caselist=encodeURIComponent(JSON.stringify(cases));
        console.log("type of cases:"+typeof(caselist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("case/listpage",{
        //ctx.response.send({
            caselist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Case.find({}) failed !!");
        console.log(err)
    })
},


//到新增資料頁
async inputpage(ctx, next) {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    var termlist;
    var applicantlist;
    var status=0;
    await Term.find({a15model:"product"}).then(async terms=>{
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
    await Applicant.find().then(async applicants=>{
      console.log("type of applicants:"+typeof(applicants));
      console.log("type of 1st applicant:"+typeof(applicants[0]));
      console.log("1st applicant:"+applicants[0])
      console.log("No. of applicant:"+applicants.length)
      applicantlist=encodeURIComponent(JSON.stringify(applicants));
      console.log("type of applicantlist:"+typeof(applicantlist));
      if(statusreport===undefined){
          statusreport="status未傳成功!"
      }
      if(status=="0"){
      await ctx.render("case/inputpage",{
          statusreport:ctx.request.body.statusreport,
          termlist,
          applicantlist
      })
      }else{
          await ctx.render("case/inputpage1",{
              statusreport:ctx.request.body.statusreport,
              termlist,
              applicantlist
          })
      }
    })
  .catch(err=>{
      console.log("Applicant.find({}) failed !!");
      console.log(err)
  })
},
//到申請人新增申請案頁
async inputpage1(ctx, next) {
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var activityID=ctx.query.activityID;
  console.log("got activityID:"+activityID);
  var actname=ctx.query.actname;
  console.log("got actname:"+actname);
  var personID=ctx.params.id;
  if(status=="0"){
      await ctx.render("case/inputpage",{
          statusreport,
          activitylist
      })
      }else{
          await ctx.render("case/inputpage1",{
              statusreport,
              personID,
              activityID,
              actname
          })
      }
},


//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered case.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Case.findById(ctx.params.id)
        .then(async casex=>{
            console.log("Casex:"+casex);
            let thecase=encodeURIComponent(JSON.stringify(casex));
            console.log("case:"+thecase);
            console.log("type of case:"+typeof(thecase));
            await ctx.render("case/editpage",{
                case:thecase,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Case.findById(ctx.params.id) failed !!");
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
    var new_case = new Case(ctx.request.body);
    console.log("got new_case:"+new_case.a15casename);
    await new_case.save()
    .then(()=>{
        console.log("Saving new_case....");

        statusreport="儲存單筆申請案資料後進入本頁";
        ctx.redirect("/base4dcarbon/case/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Case.save() failed !!")
        console.log(err)
    })
},
//寫入申請人填寫資料
async create1(ctx,next){
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var new_case = new Case(ctx.request.body);
    var personID=ctx.params.id;
    console.log("got personID:"+personID);
    var caseID;
  console.log("got new_case:"+new_case.a15casename);
  await new_case.save()
  .then(async casex=>{
      console.log("Saving new_case....");
          caseID=casex._id;
          console.log("got casexID:"+caseID)
          let new_progress=new Progress({
          a05caseID:caseID,
          a10stage:"filed",
          a15when:Date.now(),
          a99footnote:"auto create"
          })
          await new_progress.save()
            .then(async ()=>{
              console.log("Saving new_progress....");
              statusreport="儲存申請案資料及新進度後回到本頁";
              if(status=="0"){
                await ctx.redirect("/base4dcarbon/case/?statusreport="+statusreport)
              }else{
                let querytxt="?statusreport="+statusreport;
              await ctx.redirect("/base4dcarbon/branch/app4applicant/"+personID+querytxt)
              }
            })
            .catch((err)=>{
              console.log("Progress.save() failed !!")
              console.log(err)
           })
          })
  .catch((err)=>{
      console.log("Case.save() failed !!")
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
    var caseArray;
    var tempstore=new Array(11);
    for (let i=0;i<13;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<11;i++){
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
        caseArray=new Array(lineno);

        let saveone=(async new_case=>{
                await new_case.save()
                .then(()=>{
                    console.log("Saved document:"+new_case.a15casename)
                    })
                .catch((err)=>{
                    console.log("Case.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            caseArray[k]=new Array(11);
            for (let m=0;m<11;m++){
                caseArray[k][m]=tempstore[m][k]
                //console.log(caseArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of caseArray:"+caseArray[0][0]);
        console.log("read total lines:"+caseArray.length);
        let sequence=Promise.resolve();
        caseArray.forEach(function(casej){
            sequence=sequence.then(function(){
                var new_case = new Case({
                  a05applicantID:casej[0],
                  a10activityID:casej[1],
                  a15casename:casej[2],
                  a20caseaddress:casej[3],
                  a25caseGPS:casej[4],
                  a30caseunit:casej[5],
                  a35scale:casej[6],
                  a40loyalistID:casej[7],
                  a55pass:casej[8],
                  a60right:casej[9],
                  a99footnote:casej[10]

                });//EOF new case
                    saveone(new_case)
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
        statusreport="完成case批次輸入";
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
    await Case.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a case....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/case/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Case.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Case.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newcase)=>{
        console.log("Saving new_case....:"+newcase);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/case/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Case.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
