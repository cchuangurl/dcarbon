//載入相對應的model
const Source = require('../models/index').source;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/source !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Source.find({}).then(async sources=>{
        //console.log("found sources:"+sources);
        console.log("type of sources:"+typeof(sources));
        console.log("type of 1st source:"+typeof(sources[0]));
        //console.log("1st source:"+sources[0].a10fulltitle)
        console.log("No. of source:"+sources.length)
        let sourcelist=encodeURIComponent(JSON.stringify(sources));
        console.log("type of sources:"+typeof(sourcelist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("source/listpage",{
        //ctx.response.send({
            sourcelist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Source.find({}) failed !!");
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
	await ctx.render("source/inputpage",{
		statusreport:ctx.request.body.statusreport
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered source.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Source.findById(ctx.params.id)
        .then(async sourcex=>{
            console.log("Sourcex:"+sourcex);
            let source=encodeURIComponent(JSON.stringify(sourcex));
            console.log("source:"+source);
            console.log("type of source:"+typeof(source));
            await ctx.render("source/editpage",{
                source:source,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Source.findById(ctx.params.id) failed !!");
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
    var new_source = new Source(ctx.request.body);
    console.log("got new_source:"+new_source.a10fulltitle);
    await new_source.save()
    .then(()=>{
        console.log("Saving new_source....");
    statusreport="儲存單筆客戶資料後進入本頁";
    ctx.redirect("/base4dcarbon/source/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Source.save() failed !!")
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
    var sourceArray;
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
        sourceArray=new Array(lineno);

        let saveone=(async new_source=>{
                await new_source.save()
                .then(()=>{
                    console.log("Saved document:"+new_source.a10fulltitle)
                    })
                .catch((err)=>{
                    console.log("Source.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            sourceArray[k]=new Array(4);
            for (let m=0;m<4;m++){
                sourceArray[k][m]=tempstore[m][k]
                //console.log(sourceArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of sourceArray:"+sourceArray[0][0]);
        console.log("read total lines:"+sourceArray.length);
        let sequence=Promise.resolve();
        sourceArray.forEach(function(sourcej){
            sequence=sequence.then(function(){
                var new_source = new Source({
                  a05type:sourcej[0],
                  a10fulltitle:sourcej[1],
                  a15website:sourcej[2],
                  a99footnote:sourcej[3]
                });//EOF new source
                    saveone(new_source)
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
        statusreport="完成source批次輸入";
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
    await Source.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a source....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/source/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Source.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Source.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newsource)=>{
        console.log("Saving new_source....:"+newsource);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/source/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Source.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
