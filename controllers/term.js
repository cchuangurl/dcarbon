//載入相對應的model
const Term = require('../models/index').term;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/term !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Term.find({}).then(async terms=>{
        //console.log("found terms:"+terms);
        console.log("type of terms:"+typeof(terms));
        console.log("type of 1st term:"+typeof(terms[0]));
        //console.log("1st term:"+terms[0].a30mean)
        console.log("No. of term:"+terms.length)
        let termlist=encodeURIComponent(JSON.stringify(terms));
        console.log("type of terms:"+typeof(termlist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("term/listpage",{
        //ctx.response.send({
            termlist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Term.find({}) failed !!");
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
	await ctx.render("term/inputpage",{
		statusreport:ctx.request.body.statusreport
	})
},
//到修正單筆資料頁
async editpage(ctx, next) {
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    console.log("ID:"+ctx.params.id);
    console.log("entered term.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Term.findById(ctx.params.id)
        .then(async termx=>{
            console.log("Termx:"+termx);
            let term=encodeURIComponent(JSON.stringify(termx));
            console.log("term:"+term);
            console.log("type of term:"+typeof(term));
            await ctx.render("term/editpage",{
                term:term,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Term.findById(ctx.params.id) failed !!");
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
    var new_term = new Term(ctx.request.body);
    console.log("got new_term:"+new_term.a30mean);
    await new_term.save()
    .then(()=>{
        console.log("Saving new_term....");
    statusreport="儲存單筆term資料後進入本頁";
    ctx.redirect("/base4dcarbon/term/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Term.save() failed !!")
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
    var termArray;
    var tempstore=new Array(7);
    for (let i=0;i<7;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<7;i++){
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
        termArray=new Array(lineno);

        let saveone=(async new_term=>{
                await new_term.save()
                .then(()=>{
                    console.log("Saved document:"+new_term.a30mean)
                    })
                .catch((err)=>{
                    console.log("Term.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            termArray[k]=new Array(7);
            for (let m=0;m<7;m++){
                termArray[k][m]=tempstore[m][k]
                //console.log(termArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of termArray:"+termArray[0][0]);
        console.log("read total lines:"+termArray.length);
        let sequence=Promise.resolve();
        termArray.forEach(function(termj){
            sequence=sequence.then(function(){
                var new_term = new Term({
                    a05project:termj[0],
                    a10database:termj[1],
                    a15model:termj[2],
                    a20field:termj[3],
                    a25code:termj[4],
                    a30mean:termj[5],
                    a99footnote:termj[6]
                });//EOF new term
                    saveone(new_term)
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
        statusreport="完成term批次輸入";
        await ctx.render("innerweb/datamanage",{
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
    await Term.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a term....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/term/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Term.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Term.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newterm)=>{
        console.log("Saving new_term....:"+newterm);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/term/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Term.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
