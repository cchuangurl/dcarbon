//載入相對應的model
const Credit = require('../models/index').credit;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/credit !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Credit.find({}).then(async credits=>{
        //console.log("found credits:"+credits);
        console.log("type of credits:"+typeof(credits));
        console.log("type of 1st credit:"+typeof(credits[0]));
        //console.log("1st credit:"+credits[0].a05caseID)
        console.log("No. of credit:"+credits.length)
        let creditlist=encodeURIComponent(JSON.stringify(credits));
        console.log("type of credits:"+typeof(creditlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("credit/listpage",{
        //ctx.response.send({
            creditlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Credit.find({}) failed !!");
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
	await ctx.render("credit/inputpage",{
		statusreport:ctx.request.body.statusreport
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered credit.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Credit.findById(ctx.params.id)
        .then(async creditx=>{
            console.log("Creditx:"+creditx);
            let credit=encodeURIComponent(JSON.stringify(creditx));
            console.log("credit:"+credit);
            console.log("type of credit:"+typeof(credit));
            await ctx.render("credit/editpage",{
                credit:credit,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Credit.findById(ctx.params.id) failed !!");
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
    var new_credit = new Credit(ctx.request.body);
    console.log("got new_credit:"+new_credit.a05caseID);
    await new_credit.save()
    .then(()=>{
        console.log("Saving new_credit....");
    statusreport="儲存單筆客戶資料後進入本頁";
    ctx.redirect("/base4dcarbon/credit/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Credit.save() failed !!")
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
    var creditArray;
    var tempstore=new Array(14);
    for (let i=0;i<14;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<14;i++){
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
        creditArray=new Array(lineno);

        let saveone=(async new_credit=>{
                await new_credit.save()
                .then(()=>{
                    console.log("Saved document:"+new_credit.a05caseID)
                    })
                .catch((err)=>{
                    console.log("Credit.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            creditArray[k]=new Array(14);
            for (let m=0;m<14;m++){
                creditArray[k][m]=tempstore[m][k]
                //console.log(creditArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of creditArray:"+creditArray[0][0]);
        console.log("read total lines:"+creditArray.length);
        let sequence=Promise.resolve();
        creditArray.forEach(function(creditj){
            sequence=sequence.then(function(){
                var new_credit = new Credit({
                  a05caseID:creditj[0],
                  a10when:creditj[1],
                  a15totalcredit:creditj[2],
                  a20enforce:creditj[3],
                  a25expire:creditj[4],
                  a30credithash:creditj[5],
                  a35creditblock:creditj[6],
                  a40tracelink:creditj[7],
                  a45nowhash:creditj[8],
                  a50nowblock:creditj[9],
                  a55holder:creditj[10],
                  a60share:creditj[11],
                  a65contract:creditj[12],
                  a99footnote:creditj[13]
                });//EOF new credit
                    saveone(new_credit)
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
        statusreport="完成credit批次輸入";
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
    await Credit.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a credit....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/credit/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Credit.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Credit.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newcredit)=>{
        console.log("Saving new_credit....:"+newcredit);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/credit/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Credit.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
