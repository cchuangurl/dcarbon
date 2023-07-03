//載入相對應的model
const Input = require('../models/index').input;
const Term = require('../models/index').term;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/input !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Input.find({}).then(async inputs=>{
        //console.log("found inputs:"+inputs);
        console.log("type of inputs:"+typeof(inputs));
        console.log("type of 1st input:"+typeof(inputs[0]));
        //console.log("1st input:"+inputs[0].a15nickname)
        console.log("No. of input:"+inputs.length)
        let inputlist=encodeURIComponent(JSON.stringify(inputs));
        console.log("type of inputs:"+typeof(inputlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("input/listpage",{
        //ctx.response.send({
            inputlist:inputlist,
            personID,
            statusreport:statusreport
        })
    })
    .catch(err=>{
        console.log("Input.find({}) failed !!");
        console.log(err)
    })
},
//到生產資材管理
async operate(ctx,next){
  console.log("found route /base4dcarbon/input/operate !!");
  var statusreport=ctx.query.statusreport;
  console.log("gotten statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("gotten status:"+status);
  var subactID=ctx.query.subactID;
  console.log("gotten subactID:"+subactID);
  var caseID=ctx.query.caseID;
  console.log("gotten caseID:"+caseID);
  var personID=ctx.params.id;
  console.log("gotten personID:"+personID);
  await Input.find({a05subactID:subactID}).then(async inputs=>{
      //console.log("found inputs:"+inputs);
      console.log("type of inputs:"+typeof(inputs));
      console.log("type of 1st input:"+typeof(inputs[0]));
      //console.log("1st input:"+inputs[0].a15nickname)
      console.log("No. of input:"+inputs.length)
      let inputlist=encodeURIComponent(JSON.stringify(inputs));
      console.log("type of inputs:"+typeof(inputlist));
      if(status=="0"){
        await ctx.render("input/listpage",{
          //ctx.response.send({
              inputlist:inputlist,
              statusreport:statusreport
          })
      }else{
      await ctx.render("input/operate",{
      //ctx.response.send({
          inputlist,
          statusreport,
          subactID,
          caseID,
          personID
      })
    }
  })
  .catch(err=>{
      console.log("Input.find({}) failed !!");
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
	await ctx.render("input/inputpage",{
		statusreport:ctx.request.body.statusreport
	})
},
//到新增單筆資料頁
async inputpage1(ctx, next) {
  var statusreport=ctx.query.statusreport;
  console.log("gotten statusreport:"+statusreport);
  if(statusreport===undefined){
      statusreport="status未傳成功!"
    };
  var status=ctx.query.status;
  console.log("gotten status:"+status);
  var subactID=ctx.query.subactID;
  console.log("gotten subactID:"+subactID);
  var caseID=ctx.query.caseID;
  console.log("gotten caseID:"+caseID);
  var personID=ctx.params.id;
  console.log("gotten personID:"+personID);
  await Term.find({a15model:"input"}).then(async terms=>{
    console.log("type of terms:"+typeof(terms));
    console.log("type of 1st term:"+typeof(terms[0]));
    console.log("1st term:"+terms[0])
    console.log("No. of term:"+terms.length)
    termlist=encodeURIComponent(JSON.stringify(terms));
    console.log("type of termlist:"+typeof(termlist));
    })
    .catch(err=>{
        console.log("Term.find({}) failed !!");
        console.log(err)
    })
  if(status=="0"){
    await ctx.render("input/inputpage",{
      statusreport
      })
  }else{
    await ctx.render("input/inputpage1",{
        statusreport,
        caseID,
        subactID,
        personID,
        termlist
    })
  }
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered input.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Input.findById(ctx.params.id)
        .then(async inputx=>{
            console.log("Inputx:"+inputx);
            let input=encodeURIComponent(JSON.stringify(inputx));
            console.log("input:"+input);
            console.log("type of input:"+typeof(input));
            await ctx.render("input/editpage",{
                input:input,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Input.findById(ctx.params.id) failed !!");
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
  console.log("found route /base4dcarbon/input/inputadd1 !!");
  var new_input = new Input(ctx.request.body);
    console.log("got new_input:"+new_input.a15nickname);
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
      };
    var {status}=ctx.request.body;
    console.log("gotten status:"+status);
    var {subactID}=ctx.request.body;
    console.log("gotten subactID:"+subactID);
    var {caseID}=ctx.request.body;
    console.log("gotten caseID:"+caseID);
    var personID=ctx.params.id;
    console.log("gotten personID:"+personID);
    await new_input.save()
    .then(async ()=>{
        console.log("Saving new_input....");
    statusreport="儲存單筆客戶資料後進入本頁";
    if(status=="0"){
        await ctx.redirect("/base4dcarbon/input/:id?statusreport="+statusreport)
    }else{
      let querytext="?statusreport="+statusreport+"&status=1&subactID="+subactID+"&caseID="+caseID;
      await ctx.redirect("/base4dcarbon/input/operate/"+personID+querytext)
    }
    })
    .catch((err)=>{
        console.log("Input.save() failed !!")
        console.log(err)
    })
},
//批次新增資料
async batchinput(ctx, next){
    var statusreport=ctx.query.statusreport;
    console.log("gotten statusreport:"+statusreport);
    var status=ctx.query.status;
    console.log("gotten status:"+status);
    var personID=ctx.params.id;
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
    var inputArray;
    var tempstore=new Array(6);
    for (let i=0;i<6;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<6;i++){
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
        inputArray=new Array(lineno);

        let saveone=(async new_input=>{
                await new_input.save()
                .then(()=>{
                    console.log("Saved document:"+new_input.a15nickname)
                    })
                .catch((err)=>{
                    console.log("Input.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            inputArray[k]=new Array(6);
            for (let m=0;m<6;m++){
                inputArray[k][m]=tempstore[m][k]
                //console.log(inputArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of inputArray:"+inputArray[0][0]);
        console.log("read total lines:"+inputArray.length);
        let sequence=Promise.resolve();
        inputArray.forEach(function(inputj){
            sequence=sequence.then(function(){
                var new_input = new Input({
                  a05subactID:inputj[0],
                  a10inputtype:inputj[1],
                  a15nickname:inputj[2],
                  a20describe:inputj[3],
                  a25loyalistID:inputj[4],
                  a99footnote:inputj[5]
                });//EOF new input
                    saveone(new_input)
                .catch(err=>{
                    console.log(err)
                })
            })//EOF sequence
            })//EOF forEach
            resolve();
        })//EOF promise
        })//EOF savedata
    await readfile()
    .then(async()=>{
        setTimeout(savedata,3000);
        statusreport="完成input批次輸入";
        await ctx.redirect("/base4dcarbon/input/"+personID)
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
    await Input.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a input....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/input/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Input.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Input.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newinput)=>{
        console.log("Saving new_input....:"+newinput);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/input/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Input.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
