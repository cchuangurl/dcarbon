//載入相對應的model
const Applicant = require('../models/index').applicant;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/applicant !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Applicant.find({}).then(async applicants=>{
        //console.log("found applicants:"+applicants);
        console.log("type of applicants:"+typeof(applicants));
        console.log("type of 1st applicant:"+typeof(applicants[0]));
        //console.log("1st applicant:"+applicants[0].a15firmname)
        console.log("No. of applicant:"+applicants.length)
        let applicantlist=encodeURIComponent(JSON.stringify(applicants));
        console.log("type of applicants:"+typeof(applicantlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("applicant/listpage",{
        //ctx.response.send({
            applicantlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Applicant.find({}) failed !!");
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
	await ctx.render("applicant/inputpage",{
		statusreport:ctx.request.body.statusreport
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered applicant.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Applicant.findById(ctx.params.id)
        .then(async applicantx=>{
            console.log("Applicantx:"+applicantx);
            let applicant=encodeURIComponent(JSON.stringify(applicantx));
            console.log("applicant:"+applicant);
            console.log("type of applicant:"+typeof(applicant));
            await ctx.render("applicant/editpage",{
                applicant:applicant,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Applicant.findById(ctx.params.id) failed !!");
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
    var new_applicant = new Applicant(ctx.request.body);
    console.log("got new_applicant:"+new_applicant.a15firmname);
    await new_applicant.save()
    .then(()=>{
        console.log("Saving new_applicant....");
    statusreport="儲存單筆客戶資料後進入本頁";
    ctx.redirect("/base4dcarbon/applicant/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Applicant.save() failed !!")
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
    var applicantArray;
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
        applicantArray=new Array(lineno);

        let saveone=(async new_applicant=>{
                await new_applicant.save()
                .then(()=>{
                    console.log("Saved document:"+new_applicant.a15firmname)
                    })
                .catch((err)=>{
                    console.log("Applicant.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            applicantArray[k]=new Array(9);
            for (let m=0;m<9;m++){
                applicantArray[k][m]=tempstore[m][k]
                //console.log(applicantArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of applicantArray:"+applicantArray[0][0]);
        console.log("read total lines:"+applicantArray.length);
        let sequence=Promise.resolve();
        applicantArray.forEach(function(applicantj){
            sequence=sequence.then(function(){
                var new_applicant = new Applicant({
                  a05lastname:applicantj[0],
                  a10firstname:applicantj[1],
                  a15firmname:applicantj[2],
                  a20position:applicantj[3],
                  a25phone:applicantj[4],
                  a30email:applicantj[5],
                  a35tel:applicantj[6],
                  a40address:applicantj[7],
                  a99footnote:applicantj[8]
                });//EOF new applicant
                    saveone(new_applicant)
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
        statusreport="完成applicant批次輸入";
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
    await Applicant.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a applicant....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/applicant/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Applicant.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Applicant.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newapplicant)=>{
        console.log("Saving new_applicant....:"+newapplicant);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/applicant/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Applicant.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
