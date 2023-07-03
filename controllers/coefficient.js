//載入相對應的model
const Coefficient = require('../models/index').coefficient;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/coefficient !!");
    var statusreport=ctx.query.statusreport;
    console.log("got query:"+statusreport);
    await Coefficient.find({}).then(async coefficients=>{
        //console.log("found coefficients:"+coefficients);
        console.log("type of coefficients:"+typeof(coefficients));
        console.log("type of 1st coefficient:"+typeof(coefficients[0]));
        //console.log("1st coefficient:"+coefficients[0].a10data)
        console.log("No. of coefficient:"+coefficients.length)
        let coefficientlist=encodeURIComponent(JSON.stringify(coefficients));
        console.log("type of coefficients:"+typeof(coefficientlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("coefficient/listpage",{
        //ctx.response.send({
            coefficientlist:coefficientlist,
            statusreport:statusreport
        })
    })
    .catch(err=>{
        console.log("Coefficient.find({}) failed !!");
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
	await ctx.render("coefficient/inputpage",{
		statusreport:ctx.request.body.statusreport
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("got query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered coefficient.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Coefficient.findById(ctx.params.id)
        .then(async coefficientx=>{
            console.log("Coefficientx:"+coefficientx);
            let coefficient=encodeURIComponent(JSON.stringify(coefficientx));
            console.log("coefficient:"+coefficient);
            console.log("type of coefficient:"+typeof(coefficient));
            await ctx.render("coefficient/editpage",{
                coefficient:coefficient,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Coefficient.findById(ctx.params.id) failed !!");
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
    var new_coefficient = new Coefficient(ctx.request.body);
    console.log("got new_coefficient:"+new_coefficient.a10data);
    await new_coefficient.save()
    .then(()=>{
        console.log("Saving new_coefficient....");
    statusreport="儲存單筆客戶資料後進入本頁";
    ctx.redirect("/base4dcarbon/coefficient/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Coefficient.save() failed !!")
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
    var coefficientArray;
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
        coefficientArray=new Array(lineno);

        let saveone=(async new_coefficient=>{
                await new_coefficient.save()
                .then(()=>{
                    console.log("Saved document:"+new_coefficient.a10data)
                    })
                .catch((err)=>{
                    console.log("Coefficient.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            coefficientArray[k]=new Array(10);
            for (let m=0;m<10;m++){
                coefficientArray[k][m]=tempstore[m][k]
                //console.log(coefficientArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of coefficientArray:"+coefficientArray[0][0]);
        console.log("read total lines:"+coefficientArray.length);
        let sequence=Promise.resolve();
        coefficientArray.forEach(function(coefficientj){
            sequence=sequence.then(function(){
                var new_coefficient = new Coefficient({
                  a05subactID:coefficientj[0],
                  a10data:coefficientj[1],
                  a15unit:coefficientj[2],
                  a20describe:coefficientj[3],
                  a25sourceID:coefficientj[4],
                  a30detail:coefficientj[5],
                  a35loyalistID:coefficientj[6],
                  a40when:coefficientj[7],
                  a45renew:coefficientj[8],
                  a99footnote:coefficientj[9]

                });//EOF new coefficient
                    saveone(new_coefficient)
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
        statusreport="完成coefficient批次輸入";
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
    await Coefficient.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a coefficient....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/coefficient/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Coefficient.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("got query:"+statusreport);
    await Coefficient.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newcoefficient)=>{
        console.log("Saving new_coefficient....:"+newcoefficient);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/coefficient/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Coefficient.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
