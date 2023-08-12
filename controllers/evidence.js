const {Storage} = require('@google-cloud/storage');
//載入相對應的model
const Evidence = require('../models/index').evidence;
const Dataneed = require('../models/index').dataneed;
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
},
//去上傳資料頁
async uploadpage(ctx,next){
  console.log("進入evidence controller的uploadpage");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var dataneedID=ctx.query.dataneedID;
  console.log("got dataneedID:"+dataneedID);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
  await ctx.render("evidence/uploadpage",{
    dataneedID,
    caseID,
    personID,
    statusreport,
    status
  })
  },
//上傳檔案
async uploadfile(ctx,next){
  console.log("進入evidence controller的uploadfile");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
  var dataneedID=ctx.query.dataneedID;
  console.log("got dataneedID:"+dataneedID);
  var file2upload=ctx.query.file2upload;
  console.log("got file2upload:"+file2upload);
  var localpath=ctx.query.localpath;
  console.log("got localpath:"+localpath);
  var alias=ctx.query.alias;
  console.log("got alias:"+alias);
  /*
  var {statusreport}=ctx.request.body;
  console.log("got statusreport:"+statusreport);
  var {status}=ctx.request.body;
  console.log("got status:"+status);
  var {dataneedID}=ctx.request.body;
  console.log("got dataneedID:"+dataneedID);
  var {caseID}=ctx.request.body;
  console.log("got caseID:"+caseID);
  var {localpath}=ctx.request.body;
  console.log("got localpath:"+localpath);
  var {file2upload}=ctx.request.body;
  console.log("got file2upload:"+file2upload);
  var {mimetype}=ctx.request.body;
  console.log("got mimetype:"+mimetype);
  var alias,dotnumber,pathlength;
  pathlength=localpath.length;
  dotnumber=localpath.indexOf(".", pathlength-5);
  alias=localpath.slice(pathlength-dotnumber-1);
*/
  const bucketName = 'dcarbon-bucket1';
  const storename=dataneedID+"."+alias;
  const destination = 'https://console.cloud.google.com/storage/browser/dcarbon-bucket1/'+storename;
  /**
   * TODO(developer):
   *  1. Uncomment and replace these variables before running the sample.
   *  2. Set up ADC as described in https://cloud.google.com/docs/authentication/external/set-up-adc
   *  3. Make sure you have the necessary permission to list storage buckets "storage.buckets.list"
   *    (https://cloud.google.com/storage/docs/access-control/iam-permissions#bucket_permissions)
   */
 // Creates a client
/*
  async function authenticateImplicitWithAdc() {
    // This snippet demonstrates how to list buckets.
    // NOTE: Replace the client created below with the client required for your application.
    // Note that the credentials are not specified when constructing the client.
    // The client library finds your credentials using ADC.
    const storage = new Storage({
      projectId:"deep0-340312",
      keyFilename:"../../pubic/json/deep0-340312-ac0308c9dc4b.json"
    });
    const [buckets] = await storage.getBuckets();
    console.log('Buckets:');

    for (const bucket of buckets) {
      console.log(`- ${bucket.name}`);
    }

    console.log('Listed all storage buckets.');
  }

  authenticateImplicitWithAdc();
*/
  async function uploadFile() {
    // Uploads a local file to the bucket
    const storage = new Storage({
      projectId:"deep0-340312",
      keyFilename:"../../pubic/json/deep0-340312-ac0308c9dc4b.json"
    });
    await storage.bucket(bucketName).upload(localpath+file2upload, {
      destination: destination,
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
    });

    console.log(`${localpath} uploaded to ${bucketName}.`);
  }

  uploadFile().catch(console.error);

/* 另一種方法:
  const fs = require('fs');
  const axios = require('axios');
  const FormData =require('form-data');

  var localFile = fs.createReadStream('./'+fileKey);

  var formData = new FormData();
  formData.append('key',fileKey);
  formData.append('Signature',data.authorization );
  formData.append('file',localFile);

  var headers = formData.getHeaders();//獲取headers
  //獲取form-data長度
  formData.getLength(async function(err, length){
   if (err) {
      return  ;
    }
   //設置長度，important!!!
   headers['content-length']=length;

  await axios.post(data.url,formData,{headers}).then(res=>{
         console.log("上傳成功",res.data);
    }).catch(res=>{
        console.log(res.data);
   })

  })
再另一種方法:
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

// Process the file upload and upload to Google Cloud Storage.
app.post('/upload', multer.single('file'), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => {
    next(err);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});
  */
  await Dataneed.findById(dataneedID)
    .then(async dataneedx=>{
      let newcheck;
      if(dataneedx.a30check==0)
      {newcheck=1}else{
      newcheck=dataneedx.a30check++
      }
    await Dataneed.findOneAndUpdate({_id:dataneedID},{a30check:newcheck})
      .then(async ()=>{
        let querytext="?statusreport="+statusreport+"&status="+status+"&caseID="+caseID;
      await ctx.redirect('/base4dcarbon/case/preparedata/'+personID+querytext)
      })
      .catch(err=>{
        console.log("Dataneed.findOneAndUpdate({_id}) failed !!");
        console.log(err)
      })
    })
    .catch(err=>{
      console.log("Dataneed.findById({dataneedID}) failed !!");
      console.log(err)
    })
  },
//去拍照後上傳
async takepicture(ctx,next){
  console.log("to be construct....")
}
}//EOF export
