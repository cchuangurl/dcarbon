//載入相對應的model
const Coefficient = require('../models/index').coefficient;
const Source = require('../models/index').source;
const Term = require('../models/index').term;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/coefficient !!");
    var statusreport=ctx.query.statusreport;
    console.log("got query:"+statusreport);
    var personID=ctx.params.id;
    await Coefficient.find({}).then(async coefficients=>{
        console.log("type of coefficients:"+typeof(coefficients));
        console.log("type of 1st coefficient:"+typeof(coefficients[0]));
        console.log("No. of coefficient:"+coefficients.length)
        let coefficientlist=encodeURIComponent(JSON.stringify(coefficients));
        console.log("type of coefficients:"+typeof(coefficientlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("coefficient/listpage",{
        //ctx.response.send({
            coefficientlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Coefficient.find({}) failed !!");
        console.log(err)
    })
},


//到新增資料頁
async inputpage(ctx, next) {
  console.log("進入coefficient controller的inputpage");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var emissorID=ctx.query.emissorID;
  console.log("got emissorID:"+emissorID);
  if(statusreport===undefined){
      statusreport="status未傳成功!"
  }
  var sourcelist;
  await Source.find({})
    .then(async sources=>{
      console.log("type of sources:"+typeof(sources));
      console.log("type of 1st source:"+typeof(sources[0]));
      console.log("No. of source:"+sources.length)
      sourcelist=encodeURIComponent(JSON.stringify(sources));
      console.log("type of sources:"+typeof(sourcelist));
    })
	await ctx.render("coefficient/inputpage",{
		statusreport,
    status,
    emissorID,
    personID,
    sourcelist
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
  console.log("進入coefficient controller的add");
    var personID=ctx.params.id;
    console.log("personID:"+personID);
    var {statusreport}=ctx.request.body;
    console.log("got statusreport:"+statusreport);
    var {status}=ctx.request.body;
    console.log("got status:"+status);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    var new_coefficient = new Coefficient(ctx.request.body);
    console.log("got new_coefficient:"+new_coefficient.a10data);
    new_coefficient.a35loyalistID=personID;
    new_coefficient.a40when=Date.now();
    await new_coefficient.save()
    .then(async newcoefficient=>{
        console.log("Saving new_coefficient....:"+newcoefficient.a20describe);
    statusreport="儲存單筆客戶資料後進入本頁";
    let gobackurl;
    switch(status){
        case "0":gobackurl="/base4dcarbon/coefficient/"+personID;break;
        case "9":gobackurl="/base4dcarbon/branch/pwa4collecter/"+personID;break;
        default:gobackurl="/base4dcarbon/branch/pwa4collecter/"+personID
      }
    await ctx.redirect(gobackurl+"?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Coefficient.save() failed !!")
        console.log(err)
    })
},
//批次新增資料
async batchinput(ctx, next){
    console.log("found route /base4dcarbon/iputbatch !!");
    var statusreport=ctx.query.statusreport;
    var personID=ctx.params.personID
    var coefficientlist;
    var datafile=ctx.query.datafile;
    var coefficients=new Array();
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
    var documentlength=9;
    var tempstore=new Array(documentlength);
    for (let i=0;i<documentlength;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
      //當讀入一行資料時
      lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<documentlength;i++){
            tempstore[i][lineno]=values[i].trim();
        }
        lineno++;
        //console.log("read line:"+data)
        });//EOF lineReader.on
        console.log("finished read file")
    })//EOF readfile
    let transpose=( ()=>{
      console.log("3 seconds later....")
      //return new Promise((resolve, reject)=>{
        coefficients=new Array(lineno);
        for(let k=0;k<lineno;k++){
            coefficients[k]=new Array(documentlength);
            for(let i=0;i<documentlength;i++){
                coefficients[k][i]=tempstore[i][k];
            }
        }
        console.log("1st of coefficients:"+coefficients[0]);
        console.log("no. of coefficients:"+coefficients.length);
        coefficientlist=encodeURIComponent(JSON.stringify(coefficients));
        console.log("type of coefficientlist:"+typeof(coefficientlist));
        //esolve();
      //})//EOF promise
    })
    let savedata=( ()=>{
      console.log("2 seconds later....")
      return new Promise((resolve, reject)=>{
        let saveone=(async new_coefficient=>{
          await new_coefficient.save()
          .then(()=>{
              console.log("Saved document:"+new_coefficient.a20describe)
              })
          .catch((err)=>{
              console.log("Coefficient.save() failed !!")
              console.log(err)
          })
            });//EOF saveone
          let sequence=Promise.resolve();
          for(let k=0;k<lineno;k++){
            sequence=sequence.then(function(){
            let new_coefficient = new Coefficient({
              //a05subactID:coefficients[k][0],
              a10data:coefficients[k][0],
              a15unit:coefficients[k][1],
              a20describe:coefficients[k][2],
              a25sourceID:coefficients[k][3],
              a30detail:coefficients[k][4],
              a35loyalistID:coefficients[k][5],
              a40when:coefficients[k][6],
              a45renew:coefficients[k][7],
              a99footnote:coefficients[k][8]
            });//EOF new coefficient
            saveone(new_coefficient)
              .catch(err=>{
                  console.log(err)
              })
            })//EOF sequence
            }//EOF for
              console.log("finish save data!! ")
              resolve();
            })//EOF promise
        })
    let golistpage=( ()=>{
      console.log("10 seconds later....")
      //return new Promise((resolve, reject)=>{
        ctx.redirect("/base4dcarbon/coefficient/"+personID+"?statusreport="+statusreport)
        //resolve();
      //})//EOF promise
    })
    readfile();
    setTimeout(transpose,3000);
    setTimeout(savedata,5000);
    //await golistpage();
    setTimeout(golistpage,18000)
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
