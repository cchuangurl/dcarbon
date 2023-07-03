//載入相對應的model
const Subact = require('../models/index').subact;
const Case = require('../models/index').case;
const Term = require('../models/index').term;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/subact !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Subact.find({}).then(async subacts=>{
        //console.log("found subacts:"+subacts);
        console.log("type of subacts:"+typeof(subacts));
        console.log("type of 1st subact:"+typeof(subacts[0]));
        //console.log("1st subact:"+subacts[0].a15nickname)
        console.log("No. of subact:"+subacts.length)
        let subactlist=encodeURIComponent(JSON.stringify(subacts));
        console.log("type of subacts:"+typeof(subactlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("subact/listpage",{
        //ctx.response.send({
            subactlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Subact.find({}) failed !!");
        console.log(err)
    })
},
//到Decomposerr的operate
async operate(ctx,next){
  console.log("found route /base4dcarbon/subact/operate !!");
  var statusreport=ctx.query.statusreport;
  console.log("gotten statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("gotten status:"+status);
  var caseID=ctx.query.caseID;
  console.log("gotten caseID:"+caseID);
  var personID=ctx.params.id;
  console.log("gotten personID:"+personID);
  await Case.findOne({_id:caseID}).then(async casex=>{
    let activityID=casex.a10activityID;
    await Subact.find({a05activityID:activityID}).then(async subacts=>{
        //console.log("found subacts:"+subacts);
        console.log("type of subacts:"+typeof(subacts));
        console.log("type of 1st subact:"+typeof(subacts[0]));
        //console.log("1st subact:"+subacts[0].a15nickname)
        console.log("No. of subact:"+subacts.length)
        let subactlist=encodeURIComponent(JSON.stringify(subacts));
        console.log("type of subacts:"+typeof(subactlist));
        if(status=="0"){
          await ctx.render("subact/listpage",{
            //ctx.response.send({
                subactlist:subactlist,
                statusreport:statusreport,
                personID
            })
        }else{
        await ctx.render("subact/operate",{
            subactlist,
            statusreport,
            personID,
            caseID
        })
        }
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
},

//到新增資料頁
async inputpage(ctx, next) {
    var {statusreport}=ctx.request.body;
    console.log("gotten statureport:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var status=ctx.query.status;
    console.log("gotten status:"+status);
    await ctx.render("subact/inputpage",{
      statusreport
    })
},
//到新增細部流程資料頁
async inputpage1(ctx, next) {
  var {statusreport}=ctx.request.body;
  console.log("gotten statureport:"+statusreport);
  if(statusreport===undefined){
      statusreport="status未傳成功!"
  }
  var status=ctx.query.status;
  console.log("gotten status:"+status);
  var caseID=ctx.query.caseID;
  console.log("gotten caseID:"+caseID);
  var personID=ctx.params.id;
  console.log("gotten personID:"+personID);
  await Term.find({a15model:"subact"}).then(async terms=>{
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
  await Case.findOne({_id:caseID}).then(async casex=>{
    let activityID=casex.a10activityID;
        await ctx.render("subact/inputpage1",{
            statusreport:statusreport,
            personID,
            caseID,
            activityID,
            termlist
        })
      })
    .catch(err=>{
        console.log("Case.findOne({}) failed !!");
        console.log(err)
    })
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered subact.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Subact.findById(ctx.params.id)
        .then(async subactx=>{
            console.log("Subactx:"+subactx);
            let subact=encodeURIComponent(JSON.stringify(subactx));
            console.log("subact:"+subact);
            console.log("type of subact:"+typeof(subact));
            await ctx.render("subact/editpage",{
                subact:subact,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Subact.findById(ctx.params.id) failed !!");
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
    var new_subact = new Subact(ctx.request.body);
    console.log("got new_subact:"+new_subact.a15nickname);
    var statusreport=ctx.query.statusreport;
    var status=ctx.query.status;
    console.log("gotten status:"+status);
    var caseID=ctx.query.caseID;
    console.log("gotten caseID:"+caseID);
    var personID=ctx.params.id;
    console.log("gotten personID:"+personID);
    await new_subact.save()
    .then(()=>{
        console.log("Saving new_subact....");
        statusreport="儲存單筆客戶資料後進入本頁";
        if(status="0"){
        ctx.redirect("/base4dcarbon/subact/?statusreport="+statusreport)
        }else{
          ctx.redirect("/base4dcarbon/branch/decomposer/operate/+?statusreport="+statusreport)
        }
    })
    .catch((err)=>{
        console.log("Subact.save() failed !!")
        console.log(err)
    })
},
//批次新增資料
async batchinput(ctx, next){
    var statusreport=ctx.query.statusreport;
    var status=ctx.query.status;
    console.log("gotten status:"+status);
    var caseID=ctx.query.caseID;
    console.log("gotten caseID:"+caseID);
    var personID=ctx.params.id;
    console.log("gotten personID:"+personID);
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
    var subactArray;
    var tempstore=new Array(7);
    for (let i=0;i<7;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<7;i++){
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
        subactArray=new Array(lineno);

        let saveone=(async new_subact=>{
                await new_subact.save()
                .then(()=>{
                    console.log("Saved document:"+new_subact.a15nickname)
                    })
                .catch((err)=>{
                    console.log("Subact.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            subactArray[k]=new Array(7);
            for (let m=0;m<7;m++){
                subactArray[k][m]=tempstore[m][k]
                //console.log(subactArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of subactArray:"+subactArray[0][0]);
        console.log("read total lines:"+subactArray.length);
        let sequence=Promise.resolve();
        subactArray.forEach(function(subactj){
            sequence=sequence.then(function(){
                var new_subact = new Subact({
                  a05activityID:subactj[0],
                  a10type:subactj[1],
                  a15nickname:subactj[2],
                  a20describe:subactj[3],
                  a25order:subactj[4],
                  a30loyalistID:subactj[5],
                  a99footnote:subactj[6]
                });//EOF new subact
                    saveone(new_subact)
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
        console.log("go back to subact operate.ejs");
        statusreport="完成subact批次輸入";
        await ctx.render("subact/operate",{
          subactlist,
          statusreport,
          personID,
          caseID
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
    await Subact.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a subact....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/subact/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Subact.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Subact.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newsubact)=>{
        console.log("Saving new_subact....:"+newsubact);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/subact/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Subact.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
