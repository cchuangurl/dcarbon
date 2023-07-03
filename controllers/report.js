//載入相對應的model
const Report = require('../models/index').report;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/report !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Report.find({}).then(async reports=>{
        //console.log("found reports:"+reports);
        console.log("type of reports:"+typeof(reports));
        console.log("type of 1st report:"+typeof(reports[0]));
        //console.log("1st report:"+reports[0].a30filename)
        console.log("No. of report:"+reports.length)
        let reportlist=encodeURIComponent(JSON.stringify(reports));
        console.log("type of reports:"+typeof(reportlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("report/listpage",{
        //ctx.response.send({
            reportlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Report.find({}) failed !!");
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
	await ctx.render("report/inputpage",{
		statusreport:ctx.request.body.statusreport
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered report.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Report.findById(ctx.params.id)
        .then(async reportx=>{
            console.log("Reportx:"+reportx);
            let report=encodeURIComponent(JSON.stringify(reportx));
            console.log("report:"+report);
            console.log("type of report:"+typeof(report));
            await ctx.render("report/editpage",{
                report:report,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Report.findById(ctx.params.id) failed !!");
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
    var new_report = new Report(ctx.request.body);
    console.log("got new_report:"+new_report.a30filename);
    await new_report.save()
    .then(()=>{
        console.log("Saving new_report....");
    statusreport="儲存單筆客戶資料後進入本頁";
    ctx.redirect("/base4dcarbon/report/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Report.save() failed !!")
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
    var reportArray;
    var tempstore=new Array(9);
    for (let i=0;i<9;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<9;i++){
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
        reportArray=new Array(lineno);

        let saveone=(async new_report=>{
                await new_report.save()
                .then(()=>{
                    console.log("Saved document:"+new_report.a30filename)
                    })
                .catch((err)=>{
                    console.log("Report.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            reportArray[k]=new Array(9);
            for (let m=0;m<9;m++){
                reportArray[k][m]=tempstore[m][k]
                //console.log(reportArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of reportArray:"+reportArray[0][0]);
        console.log("read total lines:"+reportArray.length);
        let sequence=Promise.resolve();
        reportArray.forEach(function(reportj){
            sequence=sequence.then(function(){
                var new_report = new Report({
                  a05caseID:reportj[0],
                  a10loyalistID:reportj[1],
                  a15reporttime:reportj[2],
                  a20conclusion:reportj[3],
                  a25filetype:reportj[4],
                  a30filename:reportj[5],
                  a35reporthash:reportj[6],
                  a40reportblock:reportj[7],
                  a99footnote:reportj[8]
                });//EOF new report
                    saveone(new_report)
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
        statusreport="完成report批次輸入";
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
    await Report.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a report....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/report/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Report.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Report.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newreport)=>{
        console.log("Saving new_report....:"+newreport);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/report/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Report.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
