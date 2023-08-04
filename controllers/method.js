//載入相對應的model
const Method = require('../models/index').method;
const Case = require('../models/index').case;
const Term = require('../models/index').term;
const Activity = require('../models/index').activity;
const Subact = require('../models/index').subact;
const Input = require('../models/index').input;
const Emissor = require('../models/index').emissor;
const Progress = require('../models/index').progress;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/method !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Method.find({}).then(async methods=>{
        //console.log("found methods:"+methods);
        console.log("type of methods:"+typeof(methods));
        console.log("type of 1st method:"+typeof(methods[0]));
        //console.log("1st method:"+methods[0].a25different)
        console.log("No. of method:"+methods.length)
        let methodlist=encodeURIComponent(JSON.stringify(methods));
        console.log("type of methods:"+typeof(methodlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("method/listpage",{
        //ctx.response.send({
            methodlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Method.find({}) failed !!");
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
	await ctx.render("method/inputpage",{
		statusreport:ctx.request.body.statusreport
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered method.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Method.findById(ctx.params.id)
        .then(async methodx=>{
            console.log("Methodx:"+methodx);
            let method=encodeURIComponent(JSON.stringify(methodx));
            console.log("method:"+method);
            console.log("type of method:"+typeof(method));
            await ctx.render("method/editpage",{
                method:method,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Method.findById(ctx.params.id) failed !!");
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
    var new_method = new Method(ctx.request.body);
    console.log("got new_method:"+new_method.a25different);
    await new_method.save()
    .then(()=>{
        console.log("Saving new_method....");
    statusreport="儲存單筆客戶資料後進入本頁";
    ctx.redirect("/base4dcarbon/method/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Method.save() failed !!")
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
    var methodArray;
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
        methodArray=new Array(lineno);

        let saveone=(async new_method=>{
                await new_method.save()
                .then(()=>{
                    console.log("Saved document:"+new_method.a25different)
                    })
                .catch((err)=>{
                    console.log("Method.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            methodArray[k]=new Array(9);
            for (let m=0;m<9;m++){
                methodArray[k][m]=tempstore[m][k]
                //console.log(methodArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of methodArray:"+methodArray[0][0]);
        console.log("read total lines:"+methodArray.length);
        let sequence=Promise.resolve();
        methodArray.forEach(function(methodj){
            sequence=sequence.then(function(){
                var new_method = new Method({
                  a05activityID:methodj[0],
                  a10loyalistID:methodj[1],
                  a15subact_old:methodj[2],
                  a20subact_new:methodj[3],
                  a25different:methodj[4],
                  a30baseline:methodj[5],
                  a35dataneed:methodj[6],
                  a40formula:methodj[7],
                  a99footnote:methodj[8]
                });//EOF new method
                    saveone(new_method)
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
        statusreport="完成method批次輸入";
        await ctx.render("branch/datamanage",{
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
    await Method.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a method....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/method/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Method.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Method.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newmethod)=>{
        console.log("Saving new_method....:"+newmethod);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/method/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Method.findOneAndUpdate() failed !!")
        console.log(err)
    })
},
//去公式編輯作業頁
async editformula(ctx,next){
  console.log("get /base4dcarbon/method/formula!!")
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
  var personID=ctx.params.id;
  var activityID;
  var thecase, theactivity,termlist,subactlist,inputlist,emissorlist;
  await Case.findById(caseID)
    .then(async casex=>{
        console.log("Casex:"+casex);
        thecase=encodeURIComponent(JSON.stringify(casex));
        console.log("case:"+thecase);
        console.log("type of case:"+typeof(thecase));
        activityID=casex.a10activityID;
        console.log("activityID:"+activityID);
        })
      .catch(err=>{
          console.log("Case.findById() failed !!");
          console.log(err)
        })
      await Activity.findById(activityID)
      .then(async activityx=>{
          console.log("activityx:"+activityx);
          theactivity=encodeURIComponent(JSON.stringify(activityx));
          console.log("the activity:"+theactivity);
          console.log("type of theactivity:"+typeof(theactivity));
          })
      .catch(err=>{
          console.log("Case.findById() failed !!");
          console.log(err)
        })
  await Subact.find({a05activityID:activityID})
    .then(async subacts=>{
      //console.log("found subacts:"+subacts);
      console.log("type of subacts:"+typeof(subacts));
      console.log("type of 1st subact:"+typeof(subacts[0]));
      //console.log("1st subact:"+subacts[0].a15nickname)
      console.log("No. of subact:"+subacts.length)
      subactlist=encodeURIComponent(JSON.stringify(subacts));
      console.log("type of subacts:"+typeof(subactlist));
      let inputarray=new Array();
      let emissorarray=new Array();
      for(subact of subacts){
        let basesubactID,nonbaseID;
        let orderno;
        let baseinputs=new Array();
        let emissors=new Array();
        if(subact.a10type!="baseline"){
          orderno=subact.a25order;
          let basesubact=subacts.find(subact1=>subact1.a25order==orderno);
          basesubactID=basesubact._id;
          nonbaseID=subact._id;
          await Input.find({a05subactID:basesubactID})
            .then(async inputs0=>{
                console.log("no. of inputs0:"+inputs0.length)
                console.log("1st inputs0:"+inputs0[0]);
                  for(let i=0;i<inputs0.length;i++){
                    baseinputs[i]=inputs0[i];
                    }
            })
            .catch(err=>{
                console.log("input.find(basesubact) failed !!");
                console.log(err)
            })
          await Input.find({a05subactID:nonbaseID})
            .then(async inputs1=>{
                console.log("no. of inputs1:"+inputs1.length)
                console.log("1st inputs1:"+inputs1[0]);
                for(let [index,input0] of baseinputs.entries()){
                  let input1=inputs1.find(input=>input.a15nickname==input0.a15nickname);
                    if(input0.a20describe==input1.a20describe){
                      baseinputs[index].a99footnote="(同左)";
                    }else{
                      baseinputs[index].a99footnote=input1.a20describe;
                    }
                    }
                })
            .catch(err=>{
                console.log("input.find() failed !!");
                console.log(err)
                })
            }
            await Emissor.find({a05subactID:subact._id})
            .then(async emissors0=>{
                console.log("no. of emissors0:"+emissors0.length)
                console.log("1st emissors0:"+emissors0[0]);
                for(let [index,emissorx] of emissors0.entries()){
                emissors[index]=emissorx;
                }
            })
            .catch(err=>{
                console.log("Emissor.find(subact) failed !!");
                console.log(err)
            })
          inputarray=inputarray.concat(baseinputs);
          console.log("no of inputarray: "+inputarray.length)
          emissorarray=emissorarray.concat(emissors);
          console.log("no of emissorarray: "+emissorarray.length)
        }
        console.log("1st of inputarray: "+inputarray[0])
        inputlist=encodeURIComponent(JSON.stringify(inputarray));
        console.log("type of inputlist:"+typeof(inputlist));
        console.log("1st of emsissorearray: "+emissorarray[0])
        emissorlist=encodeURIComponent(JSON.stringify(emissorarray));
        console.log("type of emissorlist:"+typeof(emisorslist));
        })
      .catch(err=>{
        console.log("Subact.find({}) failed !!");
        console.log(err)
        })
    await Term.find({a15model:{$in:["case","activity","subact","input"]}}).then(async terms=>{
        console.log("type of terms:"+typeof(terms));
        console.log("type of 1st term:"+typeof(terms[0]));
        console.log("1st term:"+terms[0])
        console.log("No. of term:"+terms.length)
        termlist=encodeURIComponent(JSON.stringify(terms));
        console.log("type of termlist:"+typeof(termlist));
      })
      await ctx.render("method/editformula",{
        termlist,
        subactlist,
        inputlist,
        emissorlist,
        thecase,
        theactivity,
        statusreport,
        personID,
        caseID,
        status
      })
    .catch(err=>{
        console.log("Term.find({}) failed !!");
        console.log(err)
    })
},
//去顯示公式頁
async showformula(ctx,next){
  console.log("get /base4dcarbon/method/showformula!!")
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
  var personID=ctx.params.id;
  var activityID;
  var thecase, theactivity,emissorlist;
  await Case.findById(caseID)
    .then(async casex=>{
        console.log("Casex:"+casex);
        thecase=encodeURIComponent(JSON.stringify(casex));
        console.log("case:"+thecase);
        console.log("type of case:"+typeof(thecase));
        activityID=casex.a10activityID;
        console.log("activityID:"+activityID);
        })
      .catch(err=>{
          console.log("Case.findById() failed !!");
          console.log(err)
        })
      await Activity.findById(activityID)
      .then(async activityx=>{
          console.log("activityx:"+activityx);
          theactivity=encodeURIComponent(JSON.stringify(activityx));
          console.log("the activity:"+theactivity);
          console.log("type of theactivity:"+typeof(theactivity));
          })
      .catch(err=>{
          console.log("Case.findById() failed !!");
          console.log(err)
        })
  await Subact.find({a05activityID:activityID})
    .then(async subacts=>{
      //console.log("found subacts:"+subacts);
      console.log("type of subacts:"+typeof(subacts));
      console.log("type of 1st subact:"+typeof(subacts[0]));
      //console.log("1st subact:"+subacts[0].a15nickname)
      console.log("No. of subact:"+subacts.length)
      let emissorarray=new Array();
      for(subact of subacts){
            let emissors=new Array();
            await Emissor.find({a05subactID:subact._id})
            .then(async emissors0=>{
                console.log("no. of emissors0:"+emissors0.length)
                console.log("1st emissors0:"+emissors0[0]);
                for(let [index,emissorx] of emissors0.entries()){
                emissors[index]=emissorx;
                }
            })
            .catch(err=>{
                console.log("Emissor.find(subact) failed !!");
                console.log(err)
            })
          emissorarray=emissorarray.concat(emissors);
          console.log("no of emissorarray: "+emissorarray.length)
        }
        console.log("1st of emsissorearray: "+emissorarray[0])
        emissorlist=encodeURIComponent(JSON.stringify(emissorarray));
        console.log("type of emissorlist:"+typeof(emissorlist));
        })
      .catch(err=>{
        console.log("Subact.find({}) failed !!");
        console.log(err)
        })
    await ctx.render("method/showformula",{
        emissorlist,
        thecase,
        theactivity,
        statusreport,
        personID,
        caseID,
        status
      })
},
//確認公式更新進度
async doneformula(ctx, next) {
  console.log("進入method controller的doneformula");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
  let new_progress=new Progress({
    a05caseID:caseID,
    a10stage:"methodology",
    a15when:Date.now(),
    a99footnote:"create after formula done"
    })
  await new_progress.save()
      .then(async ()=>{
        console.log("Saving new_progress....");
      })
      .catch((err)=>{
        console.log("Progress.save() failed !!")
        console.log(err)
     })
  await ctx.redirect("/base4dcarbon/branch/pwa4methodor/"+personID)
}
}//EOF export
