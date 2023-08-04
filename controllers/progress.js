//載入相對應的model
const Progress = require('../models/index').progress;
const Term = require('../models/index').term;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/progress !!");
    var statusreport=ctx.query.statusreport;
    console.log("got query:"+statusreport);
    var personID=ctx.params.id;
    await Progress.find({}).then(async progresss=>{
        //console.log("found progresss:"+progresss);
        console.log("type of progresss:"+typeof(progresss));
        console.log("type of 1st progress:"+typeof(progresss[0]));
        //console.log("1st progress:"+progresss[0].a10stage)
        console.log("No. of progress:"+progresss.length)
        let progresslist=encodeURIComponent(JSON.stringify(progresss));
        console.log("type of progresss:"+typeof(progresslist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("progress/listpage",{
        //ctx.response.send({
            progresslist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Progress.find({}) failed !!");
        console.log(err)
    })
},
//碳權申請人查詢案件進度
async applycase(ctx,next){
  console.log("found route /base4dcarbon/progress/applycase !!");
  var personID=ctx.params.id;
  var caseID=ctx.query.caseID;
  console.log("got query:"+statusreport);
  var statusreport=ctx.query.statusreport;
  console.log("got query:"+statusreport);
  var termlist,progresslist;
  await Term.find({a15model:"progress"}).then(async terms=>{
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
  await Progress.find({a05caseID:caseID}).then(async progresss=>{
      //console.log("found progresss:"+progresss);
      console.log("type of progresss:"+typeof(progresss));
      console.log("type of 1st progress:"+typeof(progresss[0]));
      //console.log("1st progress:"+progresss[0].a10stage)
      console.log("No. of progress:"+progresss.length)
      progresslist=encodeURIComponent(JSON.stringify(progresss));
      console.log("type of progresss:"+typeof(progresslist));
      if(statusreport===undefined){
          statusreport="未截到status"
      }
      await ctx.render("branch/applicant/progresspage",{
      //ctx.response.send({
          progresslist,
          termlist,
          personID,
          caseID,
          statusreport
      })
  })
  .catch(err=>{
      console.log("Progress.find({}) failed !!");
      console.log(err)
  })
},
//到新增資料頁
async inputpage(ctx, next) {
    var {statusreport}=ctx.request.body;
    console.log("got query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("progress/inputpage",{
		statusreport:ctx.request.body.statusreport
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("got query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered progress.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Progress.findById(ctx.params.id)
        .then(async progressx=>{
            console.log("Progressx:"+progressx);
            let progress=encodeURIComponent(JSON.stringify(progressx));
            console.log("progress:"+progress);
            console.log("type of progress:"+typeof(progress));
            await ctx.render("progress/editpage",{
                progress:progress,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Progress.findById(ctx.params.id) failed !!");
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
    var new_progress = new Progress(ctx.request.body);
    console.log("got new_progress:"+new_progress.a10stage);
    await new_progress.save()
    .then(()=>{
        console.log("Saving new_progress....");
    statusreport="儲存單筆客戶資料後進入本頁";
    ctx.redirect("/base4dcarbon/progress/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Progress.save() failed !!")
        console.log(err)
    })
},
//由API寫入一筆資料
async create0(ctx,next){
  var new_progress = new Progress(ctx.request.body);
  console.log("got new_progress:"+new_progress.a10stage);
  await new_progress.save()
  .then(()=>{
      console.log("Saving new_progress....");
  statusreport="儲存單筆客戶資料後進入本頁";
  ctx.redirect("/base4dcarbon/progress/?statusreport="+statusreport)
  })
  .catch((err)=>{
      console.log("Progress.save() failed !!")
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
    var progressArray;
    var tempstore=new Array(4);
    for (let i=0;i<4;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<4;i++){
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
        progressArray=new Array(lineno);

        let saveone=(async new_progress=>{
                await new_progress.save()
                .then(()=>{
                    console.log("Saved document:"+new_progress.a10stage)
                    })
                .catch((err)=>{
                    console.log("Progress.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            progressArray[k]=new Array(4);
            for (let m=0;m<4;m++){
                progressArray[k][m]=tempstore[m][k]
                //console.log(progressArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of progressArray:"+progressArray[0][0]);
        console.log("read total lines:"+progressArray.length);
        let sequence=Promise.resolve();
        progressArray.forEach(function(progressj){
            sequence=sequence.then(function(){
                var new_progress = new Progress({
                  a05caseID:progressj[0],
                  a10stage:progressj[1],
                  a15when:progressj[2],
                  a99footnote:progressj[3]
                });//EOF new progress
                    saveone(new_progress)
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
        statusreport="完成progress批次輸入";
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
    console.log("got query:"+statusreport);
    await Progress.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a progress....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/progress/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Progress.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("got query:"+statusreport);
    await Progress.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newprogress)=>{
        console.log("Saving new_progress....:"+newprogress);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/progress/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Progress.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
