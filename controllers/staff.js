//載入相對應的model
const Staff = require('../models/index').staff;
const Term = require('../models/index').term;
module.exports = {
//列出清單list(req,res)
async list(ctx,next){
    console.log("found route /base4dcarbon/staff !!");
    var statusreport=ctx.query.statusreport;
    console.log("gotten query:"+statusreport);
    var personID=ctx.params.id;
    await Staff.find({}).then(async staffs=>{
        //console.log("found staffs:"+staffs);
        console.log("type of staffs:"+typeof(staffs));
        console.log("type of 1st staff:"+typeof(staffs[0]));
        //console.log("1st staff:"+staffs[0].a10firstname)
        console.log("No. of staff:"+staffs.length)
        let stafflist=encodeURIComponent(JSON.stringify(staffs));
        console.log("type of staffs:"+typeof(stafflist));
        if(statusreport===undefined){
            statusreport="未截到status"
        }
        await ctx.render("staff/listpage",{
        //ctx.response.send({
            stafflist,
            personID,
            statusreport
        })
    })
    .catch(err=>{
        console.log("Staff.find({}) failed !!");
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
    var termlist;
    await Term.find({a15model:"staff"}).then(async terms=>{
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
        await ctx.render("staff/inputpage",{
            statusreport:ctx.request.body.statusreport,
            termlist
        })
        }else{
            await ctx.render("staff/inputpage1",{
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
    console.log("entered staff.findById(ctx.params.id)!!");
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
    await Staff.findById(ctx.params.id)
        .then(async staffx=>{
            console.log("Staffx:"+staffx);
            let staff=encodeURIComponent(JSON.stringify(staffx));
            console.log("staff:"+staff);
            console.log("type of staff:"+typeof(staff));
            await ctx.render("staff/editpage",{
                staff:staff,
                statusreport:statusreport
            })
        })
        .catch(err=>{
            console.log("Staff.findById(ctx.params.id) failed !!");
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
    var new_staff = new Staff(ctx.request.body);
    console.log("got new_staff:"+new_staff.a10firstname);
    await new_staff.save()
    .then(()=>{
        console.log("Saving new_staff....");
    statusreport="儲存單筆團隊成員資料後進入本頁";
    ctx.redirect("/base4dcarbon/staff/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Staff.save() failed !!")
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
    var staffArray;
    var tempstore=new Array(15);
    for (let i=0;i<15;i++){
        tempstore[i]=new Array();
    };
    let readfile=(()=>{
        console.log("reading..."+datafile+".csv");
        return new Promise((resolve,reject)=>{
    //當讀入一行資料時
    lineReader.on('line', function(data) {
        var values = data.split(',');
        for (let i=0;i<15;i++){
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
        staffArray=new Array(lineno);

        let saveone=(async new_staff=>{
                await new_staff.save()
                .then(()=>{
                    console.log("Saved document:"+new_staff.a10firstname)
                    })
                .catch((err)=>{
                    console.log("Staff.save() failed !!")
                    console.log(err)
                })
        });//EOF saveone
        for (let k=0;k<lineno;k++){
            staffArray[k]=new Array(15);
            for (let m=0;m<15;m++){
                staffArray[k][m]=tempstore[m][k]
                //console.log(staffArray[k])
            }
        }
        console.log("3 second later...");
        console.log("1st datum of staffArray:"+staffArray[0][0]);
        console.log("read total lines:"+staffArray.length);
        let sequence=Promise.resolve();
        staffArray.forEach(function(staffj){
            sequence=sequence.then(function(){
                var new_staff = new Staff({
                  a05lastname:staffj[0],
                  a10firstname:staffj[1],
                  a15dateofjoin:staffj[2],
                  a20department:staffj[3],
                  a25tel:staffj[4],
                  a30phone:staffj[5],
                  a30email:staffj[6],
                  a35institution:staffj[7],
                  a40position:staffj[8],
                  a45address:staffj[9],
                  a50degree:staffj[10],
                  a55resume:staffj[11],
                  a60expertise:staffj[12],
                  a65extra:staffj[13],
                  a99footnote:staffj[14]

                });//EOF new staff
                    saveone(new_staff)
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
        statusreport="完成staff批次輸入";
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
    await Staff.deleteOne({_id: ctx.params.id})
    .then(()=>{
        console.log("Deleted a staff....");
    statusreport="刪除單筆名詞對照後進入本頁";
    //ctx.res.end()
    ctx.redirect("/base4dcarbon/staff/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Staff.deleteOne() failed !!")
        console.log(err)
    })
},

//依參數id更新資料
async update(ctx,next){
    let {_id}=ctx.request.body;
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    await Staff.findOneAndUpdate({_id:_id}, ctx.request.body, { new: true })
    .then((newstaff)=>{
        console.log("Saving new_staff....:"+newstaff);
    statusreport="更新單筆名詞對照後進入本頁";
    ctx.redirect("/base4dcarbon/staff/?statusreport="+statusreport)
    })
    .catch((err)=>{
        console.log("Staff.findOneAndUpdate() failed !!")
        console.log(err)
    })
}
}//EOF export
