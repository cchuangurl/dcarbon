//載入相對應的model
const Loyalist = require('../models/index').loyalist;
const Term = require('../models/index').term;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/loyalist !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Loyalist.find({}).then(async loyalists=>{
        //console.log("found loyalists:"+loyalists);
        console.log("type of loyalists:"+typeof(loyalists));
        console.log("type of 1st loyalist:"+typeof(loyalists[0]));
        //console.log("1st loyalist:"+loyalists[0].a10firstname)
        console.log("No. of loyalist:"+loyalists.length)
        let loyalistlist=encodeURIComponent(JSON.stringify(loyalists));
        console.log("type of loyalists:"+typeof(loyalistlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("loyalist/listpage",{
        //ctx.response.send({
            loyalistlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Loyalist.find({}) failed !!");
        console.log(err)
    })
},


//到新增資料頁
async inputpage(ctx, next) {
    var {statusreport}=ctx.request.body;
    var status=ctx.query.status;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var status=0;
    var termlist;
    await Term.find({a15model:"loyalist"}).then(async terms=>{
        console.log("type of terms:"+typeof(terms));
        console.log("type of 1st term:"+typeof(terms[0]));
        console.log("1st term:"+terms[0])
        console.log("No. of term:"+terms.length)
        termlist=encodeURIComponent(JSON.stringify(terms));
        console.log("type of termlist:"+typeof(termlist));
        if(statusreport===undefined){
            statusreport="status未傳成功!"
        }
        if(status=="0"){
        await ctx.render("loyalist/inputpage",{
            statusreport:ctx.request.body.statusreport,
            termlist
        })
        }else{
            await ctx.render("loyalist/inputpage1",{
                statusreport:ctx.request.body.statusreport,
                termlist
            })
        }
      })
    .catch(err=>{
        console.log("Term.find({}) failed !!");
        console.log(err)
    })
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered loyalist.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Loyalist.findById(ctx.params.id)
        .then(async loyalistx=>{
            console.log("Loyalistx:"+loyalistx);
            let loyalist=encodeURIComponent(JSON.stringify(loyalistx));
            console.log("loyalist:"+loyalist);
            console.log("type of loyalist:"+typeof(loyalist));
            await ctx.render("loyalist/editpage",{
                loyalist:loyalist,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Loyalist.findById(ctx.params.id) failed !!");
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
    var new_loyalist = new Loyalist(ctx.request.body);
    console.log("got new_loyalist:"+new_loyalist.a10firstname);
    await new_loyalist.save()
    .then(()=>{
        console.log("Saving new_loyalist....");
    statusreport="儲存單筆淨零義士後進入本頁";
    ctx.redirect("/base4dcarbon/loyalist/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Loyalist.save() failed !!")
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
    var loyalistArray;
    var tempstore=new Array(11);
    for (let i=0;i<11;i++){
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
        loyalistArray=new Array(lineno);

        let saveone=(async new_loyalist=>{
                await new_loyalist.save()
                .then(()=>{
                    console.log("Saved document:"+new_loyalist.a10firstname)
                    })
                .catch((err)=>{
                    console.log("Loyalist.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            loyalistArray[k]=new Array(11);
            for (let m=0;m<11;m++){
                loyalistArray[k][m]=tempstore[m][k]
                //console.log(loyalistArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of loyalistArray:"+loyalistArray[0][0]);
        console.log("read total lines:"+loyalistArray.length);
        let sequence=Promise.resolve();
        loyalistArray.forEach(function(loyalistj){
            sequence=sequence.then(function(){
                var new_loyalist = new Loyalist({
                  a05lastname:loyalistj[0],
                  a10firstname:loyalistj[1],
                  a15role:loyalistj[2],
                  a20tel:loyalistj[3],
                  a25phone:loyalistj[4],
                  a30email:loyalistj[5],
                  a35degree:loyalistj[6],
                  a40resume:loyalistj[7],
                  a45expertise:loyalistj[8],
                  a50extra:loyalistj[9],
                  a99footnote:loyalistj[10]

                });//EOF new loyalist
                    saveone(new_loyalist)
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
        statusreport="完成loyalist批次輸入";
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
    await Loyalist.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a loyalist....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/loyalist/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Loyalist.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Loyalist.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newloyalist)=>{
        console.log("Saving new_loyalist....:"+newloyalist);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/loyalist/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Loyalist.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
