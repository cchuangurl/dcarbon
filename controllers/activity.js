//載入相對應的model
const Activity = require('../models/index').activity;
const Term = require('../models/index').term;
const Product = require('../models/index').product;
const Applicant=require('../models/index').applicant;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/activity !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Activity.find({}).then(async activitys=>{
        //console.log("found activitys:"+activitys);
        console.log("type of activitys:"+typeof(activitys));
        console.log("type of 1st activity:"+typeof(activitys[0]));
        //console.log("1st activity:"+activitys[0].mean)
        console.log("No. of activity:"+activitys.length)
        let activitylist=encodeURIComponent(JSON.stringify(activitys));
        console.log("type of activitys:"+typeof(activitylist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("activity/listpage",{
        //ctx.response.send({
            activitylist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Activity.find({}) failed !!");
        console.log(err)
    })
},


//到新增資料頁
async inputpage(ctx, next) {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("activity/inputpage",{
		statusreport
	})
},
//到申請人填寫活動資料頁
async inputpage1(ctx, next) {
  var {statusreport}=ctx.request.body;
  console.log("gotten query:"+statusreport);
  var personID=ctx.params.id;
  var termlist;
  var productlist;
  var status=1;
  await Term.find({a15model:"activity"}).then(async terms=>{
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
  await Product.find().then(async products=>{
      console.log("type of products:"+typeof(products));
      console.log("type of 1st product:"+typeof(products[0]));
      console.log("1st product:"+products[0])
      console.log("No. of product:"+products.length)
      productlist=encodeURIComponent(JSON.stringify(products));
      console.log("type of productlist:"+typeof(productlist));
      if(statusreport===undefined){
          statusreport="status未傳成功!"
      }
      if(status==0){
      await ctx.render("activity/inputpage",{
          statusreport:ctx.request.body.statusreport,
          termlist,
          productlist
      })
      }else{
          await ctx.render("activity/inputpage1",{
              statusreport,
              termlist,
              productlist,
              personID
          })
      }
    })
  .catch(err=>{
      console.log("product.find({}) failed !!");
      console.log(err)
  })
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered activity.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Activity.findById(ctx.params.id)
        .then(async activityx=>{
            console.log("Activityx:"+activityx);
            let activity=encodeURIComponent(JSON.stringify(activityx));
            console.log("activity:"+activity);
            console.log("type of activity:"+typeof(activity));
            await ctx.render("activity/editpage",{
                activity:activity,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Activity.findById(ctx.params.id) failed !!");
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
    var new_activity = new Activity(ctx.request.body);
    console.log("got new_activity:"+new_activity.a15nickname);
    await new_activity.save()
    .then(()=>{
        console.log("Saving new_activity....");
    statusreport="儲存單筆客戶資料後進入本頁";
    ctx.redirect("/base4dcarbon/activity/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Activity.save() failed !!")
        console.log(err)
    })
},
//存入申請人填寫的活動資料
async create1(ctx,next){
  var new_activity = new Activity(ctx.request.body);
  var {status}=ctx.request.body;
  var {statusreport}=ctx.request.brtody;
  console.log("statusreoprt:"+statusreoprt);
  var personID=ctx.params.id;
  var activityID, nickname;
  console.log("got new_activity:"+new_activity.a15nickname);
  await new_activity.save()
  .then(async activityx=>{
      console.log("Saving new_activity....");
      console.log("the saved activity:"+activityx);
      activityID=activityx._id;
      actname=activityx.a15nickname;
      console.log("got actname:"+actname);
      statusreport="儲存單筆活動資料後進入本頁";
    if(status=="0"){
          await ctx.redirect("/base4dcarbon/activity/?statusreport="+statusreport)
        }else{
          let querytxt="?statusreport="+statusreport+"&activityID="+activityID+"&actname="+actname+"&status=1";
          await ctx.redirect("/base4dcarbon/case/inputpage1/"+personID+querytxt)
        }
    })
  .catch((err)=>{
      console.log("Activity.save() failed !!")
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
    var activityArray;
    var tempstore=new Array(5);
    for (let i=0;i<5;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<5;i++){
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
        activityArray=new Array(lineno);

        let saveone=(async new_activity=>{
                await new_activity.save()
                .then(()=>{
                    console.log("Saved document:"+new_activity.a15nickname)
                    })
                .catch((err)=>{
                    console.log("Activity.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            activityArray[k]=new Array(5);
            for (let m=0;m<5;m++){
                activityArray[k][m]=tempstore[m][k]
                //console.log(activityArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of activityArray:"+activityArray[0][0]);
        console.log("read total lines:"+activityArray.length);
        let sequence=Promise.resolve();
        activityArray.forEach(function(activityj){
            sequence=sequence.then(function(){
                var new_activity = new Activity({
                  a05productID:activityj[0],
                  a10type:activityj[1],
                  a15nickname:activityj[2],
                  a20describe:activityj[3],
                  a99footnote:activityj[4]
                });//EOF new activity
                    saveone(new_activity)
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
        statusreport="完成activity批次輸入";
        await ctx.render("innerweb/datamanage",{
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
    await Activity.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a activity....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/activity/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Activity.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Activity.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newactivity)=>{
        console.log("Saving new_activity....:"+newactivity);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/activity/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Activity.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
