//載入相對應的model
const Award = require('../models/index').award;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/award !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Award.find({}).then(async awards=>{
        //console.log("found awards:"+awards);
        console.log("type of awards:"+typeof(awards));
        console.log("type of 1st award:"+typeof(awards[0]));
        //console.log("1st award:"+awards[0].a15point)
        console.log("No. of award:"+awards.length)
        let awardlist=encodeURIComponent(JSON.stringify(awards));
        console.log("type of awards:"+typeof(awardlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("award/listpage",{
        //ctx.response.send({
            awardlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Award.find({}) failed !!");
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
	await ctx.render("award/inputpage",{
		statusreport:ctx.request.body.statusreport
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered award.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Award.findById(ctx.params.id)
        .then(async awardx=>{
            console.log("Awardx:"+awardx);
            let award=encodeURIComponent(JSON.stringify(awardx));
            console.log("award:"+award);
            console.log("type of award:"+typeof(award));
            await ctx.render("award/editpage",{
                award:award,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Award.findById(ctx.params.id) failed !!");
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
    var new_award = new Award(ctx.request.body);
    console.log("got new_award:"+new_award.a15point);
    await new_award.save()
    .then(()=>{
        console.log("Saving new_award....");
    statusreport="儲存單筆客戶資料後進入本頁";
    ctx.redirect("/base4dcarbon/award/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Award.save() failed !!")
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
    var awardArray;
    var tempstore=new Array(10);
    for (let i=0;i<10;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<10;i++){
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
        awardArray=new Array(lineno);

        let saveone=(async new_award=>{
                await new_award.save()
                .then(()=>{
                    console.log("Saved document:"+new_award.a15point)
                    })
                .catch((err)=>{
                    console.log("Award.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            awardArray[k]=new Array(10);
            for (let m=0;m<10;m++){
                awardArray[k][m]=tempstore[m][k]
                //console.log(awardArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of awardArray:"+awardArray[0][0]);
        console.log("read total lines:"+awardArray.length);
        let sequence=Promise.resolve();
        awardArray.forEach(function(awardj){
            sequence=sequence.then(function(){
                var new_award = new Award({
                  a05when:awardj[0],
                  a10loyalistID:awardj[1],
                  a15point:awardj[2],
                  a20awardhash:awardj[3],
                  a25awardblock:awardj[4],
                  a30nowhash:awardj[5],
                  a35nowblock:awardj[6],
                  a40holder:awardj[7],
                  a45share:awardj[8],
                  a99footnote:awardj[9]
                });//EOF new award
                    saveone(new_award)
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
        statusreport="完成award批次輸入";
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
    await Award.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a award....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/award/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Award.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Award.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newaward)=>{
        console.log("Saving new_award....:"+newaward);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/award/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Award.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
