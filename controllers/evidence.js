//載入相對應的model
const Evidence = require('../models/index').evidence;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/evidence !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Evidence.find({}).then(async evidences=>{
        //console.log("found evidences:"+evidences);
        console.log("type of evidences:"+typeof(evidences));
        console.log("type of 1st evidence:"+typeof(evidences[0]));
        //console.log("1st evidence:"+evidences[0].a30filename)
        console.log("No. of evidence:"+evidences.length)
        let evidencelist=encodeURIComponent(JSON.stringify(evidences));
        console.log("type of evidences:"+typeof(evidencelist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("evidence/listpage",{
        //ctx.response.send({
            evidencelist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Evidence.find({}) failed !!");
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
	await ctx.render("evidence/inputpage",{
		statusreport:ctx.request.body.statusreport
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered evidence.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Evidence.findById(ctx.params.id)
        .then(async evidencex=>{
            console.log("Evidencex:"+evidencex);
            let evidence=encodeURIComponent(JSON.stringify(evidencex));
            console.log("evidence:"+evidence);
            console.log("type of evidence:"+typeof(evidence));
            await ctx.render("evidence/editpage",{
                evidence:evidence,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Evidence.findById(ctx.params.id) failed !!");
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
    var new_evidence = new Evidence(ctx.request.body);
    console.log("got new_evidence:"+new_evidence.a30filename);
    await new_evidence.save()
    .then(()=>{
        console.log("Saving new_evidence....");
    statusreport="儲存單筆客戶資料後進入本頁";
    ctx.redirect("/base4dcarbon/evidence/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Evidence.save() failed !!")
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
    var evidenceArray;
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
        evidenceArray=new Array(lineno);

        let saveone=(async new_evidence=>{
                await new_evidence.save()
                .then(()=>{
                    console.log("Saved document:"+new_evidence.a30filename)
                    })
                .catch((err)=>{
                    console.log("Evidence.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            evidenceArray[k]=new Array(9);
            for (let m=0;m<9;m++){
                evidenceArray[k][m]=tempstore[m][k]
                //console.log(evidenceArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of evidenceArray:"+evidenceArray[0][0]);
        console.log("read total lines:"+evidenceArray.length);
        let sequence=Promise.resolve();
        evidenceArray.forEach(function(evidencej){
            sequence=sequence.then(function(){
                var new_evidence = new Evidence({
                  a05caseID:evidencej[0],
                  a10needdataID:evidencej[1],
                  a15uploadtime:evidencej[2],
                  a20datatype:evidencej[3],
                  a25filetype:evidencej[4],
                  a30filename:evidencej[5],
                  a35datahash:evidencej[6],
                  a40datablock:evidencej[7],
                  a99footnote:evidencej[8]

                });//EOF new evidence
                    saveone(new_evidence)
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
        statusreport="完成evidence批次輸入";
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
    await Evidence.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a evidence....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/evidence/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Evidence.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Evidence.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newevidence)=>{
        console.log("Saving new_evidence....:"+newevidence);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/evidence/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Evidence.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
