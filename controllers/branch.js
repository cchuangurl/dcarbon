//載入相對應的model
const User = require('../models/index').user;
const Loyalist = require('../models/index').loyalist;
const Case = require('../models/index').case;
const Progress = require('../models/index').progress;
module.exports = {
//依帳號決定轉頁
async dispatch(ctx, next) {
  console.log("進入branch controller的dispatch");
  statusreport="由系統的暫用統一入口進入本頁";
  var {account}=ctx.request.body;
  var group;
  var pwaroute, personID;
  console.log("the account :"+account)
  await User.findOne({a15account:account}).then(async userx=>{
      console.log("userx:"+userx.a15account);
      console.log("group:"+userx.a25group);
      group=userx.a25group;
      personID=userx.a10personID;
      switch(group){
        case "applicant":pwaroute="/base4dcarbon/branch/app4applicant";break;
        case "decomposer":pwaroute="/base4dcarbon/branch/pwa4decomposer";break;
        case "methodor":pwaroute="/base4dcarbon/branch/pwa4methodor";break;
        case "collecter":pwaroute="/base4dcarbon/branch/pwa4collecter";break;
        case "investigator":pwaroute="/base4dcarbon/branch/pwa4investigator";break;
        case "admin":pwaroute="/base4dcarbon/branch/maintainer";break;
        case "management":pwaroute="/base4dcarbon/branch/maintainer";break;
        case "tester":pwaroute="/base4dcarbon/branch/collecter";break;
        default:pwarouter="/base4dcarbon";
      }
      await ctx.redirect(pwaroute+"/"+personID)
  })
  .catch(err=>{
      console.log("User.findOne() failed !!");
      console.log(err)
  })
},
//到Applicantweb
async goapplicant(ctx, next) {
  console.log("進入branch controller的goapplicant");
  var personID=ctx.params.id;
  var statusreport="以認證申請人身分進入本頁";
  await ctx.render("branch/app4applicant" ,{
    statusreport,
    personID
      })
},
//到decomposerweb
async godecomposer(ctx, next) {
  console.log("進入branch controller的godecomposer");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var case2decompose=new Array();
  var caselist;
  var loyalist1;
  await Case.find({}).then(async cases=>{
    console.log("type of cases:"+typeof(cases));
    console.log("1st case:"+cases[0]);
    console.log("No. of case:"+cases.length)
    for(casex of cases){
      if(casex.a40loyalistID.indexOf(personID)>-1){
          case2decompose.push(casex)
      }
    }
    console.log("No. of case2decompse:"+case2decompose.length)
    caselist=encodeURIComponent(JSON.stringify(case2decompose));
    console.log("type of caselist:"+typeof(caselist))
    })
    .catch(err=>{
      console.log("Case.find({}) failed !!");
      console.log(err)
    })
statusreport="以活動解構士身分進入本頁";
await Loyalist.findOne({_id:personID})
    .then(async loyalistx=>{
      console.log("type of loyalistx:"+typeof(loyalistx));
      console.log("loyalistx:"+loyalistx)
      loyalist1=encodeURIComponent(JSON.stringify(loyalistx));
      console.log("type of loyalist1:"+typeof(loyalist1));
      console.log("loyalist1:"+loyalist1)
      await ctx.render("branch/pwa4decomposer" ,{
        loyalist1,
        caselist,
        personID,
        statusreport
          })
    })
    .catch(err=>{
      console.log("Loyalist.findOne() failed !!");
      console.log(err)
    })
},
//到Decomposer的findcase
async decomposerfindcase(ctx, next){
  console.log("進入branch controller的decomposerfindcase");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var case2choose=new Array();
  var caselist;
  var loyalist1;
  //await Case.find({$elemMatch:a40loyalistID.length==0}).then(async cases=>{
    //await Case.find({'a40loyalistID.length':0}).then(async cases=>{
    await Case.find({}).then(async cases=>{
    console.log("type of cases:"+typeof(cases));
    console.log("1st case:"+cases[0]);
    console.log("No. of case:"+cases.length)
    for(casex of cases){
        if(casex.a40loyalistID.length==0){
        case2choose.push(casex)
        }
    }
    console.log("No. of case2choose:"+case2choose.length)
    caselist=encodeURIComponent(JSON.stringify(case2choose));
    console.log("type of caselist:"+typeof(caselist))
    })
    .catch(err=>{
      console.log("Case.find({}) failed !!");
      console.log(err)
    })
statusreport="以活動解構士身分進入本頁";
await Loyalist.findOne({_id:personID})
    .then(async loyalistx=>{
      console.log("type of loyalistx:"+typeof(loyalistx));
      console.log("loyalistx:"+loyalistx)
      loyalist1=encodeURIComponent(JSON.stringify(loyalistx));
      console.log("type of loyalist1:"+typeof(loyalist1));
      console.log("loyalist1:"+loyalist1)
      await ctx.render("branch/decomposer/findcasepage" ,{
        loyalist1,
        caselist,
        personID,
        statusreport
          })
    })
    .catch(err=>{
      console.log("Loyalist.findOne() failed !!");
      console.log(err)
    })
},
//到Decomposer的choosecase
async decomposerchoosecase(ctx, next){
  console.log("進入branch controller的decomposerchoosecase");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
    var case2decompose=new Array();
  var caselist;
  var loyalist1;
  let new_progress=new Progress({
    a05caseID:caseID,
    a10stage:"disintegrate",
    a15when:Date.now(),
    a99footnote:"create after chose"
    })
  await new_progress.save()
      .then(async ()=>{
        console.log("Saving new_progress....");
      })
      .catch((err)=>{
        console.log("Progress.save() failed !!")
        console.log(err)
     })
  await Case.findById({_id:caseID}).then(async casex=>{
    console.log("type of casex:"+typeof(casex));
    console.log("case found:"+casex);
    casex.a40loyalistID.push(personID);
    console.log("casex.a40loyalistID:"+casex.a40loyalistID.length);
    new_case=new Case(casex);
    //await new_case.updateOne().then(async ()=>{
    await new_case.save().then(async ()=>{
      await Case.find({'a40loyalistID.some(personID)':true}).then(async cases=>{
        //await Case.find({'a40loyalistID.length':0}).then(async cases=>{
          console.log("type of cases:"+typeof(cases));
          console.log("1st case:"+cases[0]);
          console.log("No. of case:"+cases.length)
          for(casex of cases){
            if(casex.a40loyalistID.some(personID)){
            case2decompose.push(casex)
            }
        }
        console.log("No. of case2decompose:"+case2decompose.length)
          caselist=encodeURIComponent(JSON.stringify(case2decompose));
          console.log("type of caselist:"+typeof(caselist))
          })
          .catch(err=>{
            console.log("Case.find({}) failed !!");
            console.log(err)
          })
      })
      .catch(err=>{
        console.log("Case.save({}) failed !!");
        console.log(err)
      })
    })
    .catch(err=>{
      console.log("Case.findById({}) failed !!");
      console.log(err)
    })
statusreport="以活動解構士身分進入本頁";
await Loyalist.findOne({_id:personID})
    .then(async loyalistx=>{
      console.log("type of loyalistx:"+typeof(loyalistx));
      console.log("loyalistx:"+loyalistx)
      loyalist1=encodeURIComponent(JSON.stringify(loyalistx));
      console.log("type of loyalist1:"+typeof(loyalist1));
      console.log("loyalist1:"+loyalist1)
      await ctx.render("branch/pwa4decomposer" ,{
        loyalist1,
        caselist,
        personID,
        statusreport
          })
    })
    .catch(err=>{
      console.log("Loyalist.findOne() failed !!");
      console.log(err)
    })
},
//活動解構結果確定
async pass2methodor(ctx, next) {
  console.log("進入branch controller的pass2methodor");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
  var case2decompose=new Array();
  var caselist;
  var loyalist1;
  let new_progress=new Progress({
    a05caseID:caseID,
    a10stage:"disintegrated",
    a15when:Date.now(),
    a99footnote:"create after decomposed"
    })
  await new_progress.save()
      .then(async ()=>{
        console.log("Saving new_progress....");
      })
      .catch((err)=>{
        console.log("Progress.save() failed !!")
        console.log(err)
     })
     await Case.find({}).then(async cases=>{
      console.log("type of cases:"+typeof(cases));
      console.log("1st case:"+cases[0]);
      console.log("No. of case:"+cases.length)
      for(casex of cases){
        if(casex.a40loyalistID.indexOf(personID)>-1){
            case2decompose.push(casex)
        }
      }
      console.log("No. of case2decompse:"+case2decompose.length)
      caselist=encodeURIComponent(JSON.stringify(case2decompose));
    console.log("type of caselist:"+typeof(caselist))
    })
    .catch(err=>{
      console.log("Case.find({}) failed !!");
      console.log(err)
    })
statusreport="以活動解構士身分進入本頁";
await Loyalist.findOne({_id:personID})
    .then(async loyalistx=>{
      console.log("type of loyalistx:"+typeof(loyalistx));
      console.log("loyalistx:"+loyalistx)
      loyalist1=encodeURIComponent(JSON.stringify(loyalistx));
      console.log("type of loyalist1:"+typeof(loyalist1));
      console.log("loyalist1:"+loyalist1)
      await ctx.render("branch/pwa4decomposer" ,{
        loyalist1,
        caselist,
        personID,
        statusreport
          })
    })
    .catch(err=>{
      console.log("Loyalist.findOne() failed !!");
      console.log(err)
    })
},




//到Methodorweb
async gomethodor(ctx, next) {
  console.log("進入branch controller的gomethodor");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var case2setmethod=new Array();
  var caselist;
  var loyalist1;
  await Case.find({}).then(async cases=>{
    console.log("type of cases:"+typeof(cases));
    console.log("1st case:"+cases[0]);
    console.log("No. of case:"+cases.length)
    for(casex of cases){
        if(casex.a40loyalistID.indexOf(personID)>-1){
        case2setmethod.push(casex)
        }
    }
    console.log("No. of case2setmethod:"+case2setmethod.length)
      caselist=encodeURIComponent(JSON.stringify(case2setmethod));
    console.log("type of caselist:"+typeof(caselist))
    })
    .catch(err=>{
      console.log("Case.find({personID}) failed !!");
      console.log(err)
    })
statusreport="以方法建構士身分進入本頁";
await Loyalist.findOne({_id:personID})
    .then(async loyalistx=>{
      console.log("type of loyalistx:"+typeof(loyalistx));
      console.log("loyalistx:"+loyalistx)
      loyalist1=encodeURIComponent(JSON.stringify(loyalistx));
      console.log("type of loyalist1:"+typeof(loyalist1));
      console.log("loyalist1:"+loyalist1)
      await ctx.render("branch/pwa4methodor" ,{
        loyalist1,
        caselist,
        personID,
        statusreport
          })
    })
    .catch(err=>{
      console.log("Loyalist.findOne() failed !!");
      console.log(err)
    })

},
//到Mehtodor的findcase
async methodorfindcase(ctx, next){
  console.log("進入branch controller的methodorfindcase");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var case2choose=new Array();
  var caselist;
  var loyalist1;
  await Case.find({}).then(async cases=>{
    console.log("type of cases:"+typeof(cases));
    console.log("1st case:"+cases[0]);
    console.log("No. of case:"+cases.length)
    for(casex of cases){
        await Progress.find({a05caseID:casex._id})
         .then(async progresses=>{
            console.log("no. of progresses:"+progresses.length);
            let stages=new Array();
            for(progressx of progresses){
                stages.push(progressx.a10stage)
            }
            console.log("no. of stages:"+stages.length);
            console.log("isdecompsed:"+stages.indexOf("disintegrated"));
            console.log("isconstructing:"+stages.indexOf("constructing"));
            if(stages.indexOf("disintegrated")>-1&&stages.indexOf("constructing")<0){
                case2choose.push(casex)
            }
          })
          .catch(err=>{
            console.log("Progress.find({}) failed !!");
            console.log(err)
          })
    }
    console.log("No. of case2choose:"+case2choose.length)
    caselist=encodeURIComponent(JSON.stringify(case2choose));
    console.log("type of caselist:"+typeof(caselist))
    })
    .catch(err=>{
      console.log("Case.find({}) failed !!");
      console.log(err)
    })
statusreport="以方法建構士身分進入本頁";
await Loyalist.findOne({_id:personID})
    .then(async loyalistx=>{
      console.log("type of loyalistx:"+typeof(loyalistx));
      console.log("loyalistx:"+loyalistx)
      loyalist1=encodeURIComponent(JSON.stringify(loyalistx));
      console.log("type of loyalist1:"+typeof(loyalist1));
      console.log("loyalist1:"+loyalist1)
      await ctx.render("branch/methodor/findcasepage" ,{
        loyalist1,
        caselist,
        personID,
        statusreport
          })
    })
    .catch(err=>{
      console.log("Loyalist.findOne() failed !!");
      console.log(err)
    })
},
//到Mehtodor的choosecase
async methodorchoosecase(ctx, next){
  console.log("進入branch controller的methodorchoosecase");
  var personID=ctx.params.id;
  console.log("personID:"+personID);
  var caseID=ctx.query.caseID;
  console.log("got caseID:"+caseID);
    var case2construct=new Array();
  var caselist;
  var loyalist1;
  let new_progress=new Progress({
    a05caseID:caseID,
    a10stage:"constructing",
    a15when:Date.now(),
    a99footnote:"create after chose by methodor"
    })
  await new_progress.save()
      .then(async ()=>{
        console.log("Saving new_progress....");
      })
      .catch((err)=>{
        console.log("Progress.save() failed !!")
        console.log(err)
     })
  await Case.findById({_id:caseID}).then(async casex=>{
    console.log("type of casex:"+typeof(casex));
    console.log("case found:"+casex);
    casex.a40loyalistID.push(personID);
    console.log("casex.a40loyalistID:"+casex.a40loyalistID.length);
    new_case=new Case(casex);
    //await new_case.updateOne().then(async ()=>{
    await new_case.save().then(async ()=>{
      await Case.find({}).then(async cases=>{
          console.log("type of cases:"+typeof(cases));
          console.log("1st case:"+cases[0]);
          console.log("No. of case:"+cases.length)
          for(casex of cases){
            if(casex.a40loyalistID.indexOf(personID)>-1){
              case2construct.push(casex)
            }
        }
        console.log("No. of case2construct:"+case2construct.length)
          caselist=encodeURIComponent(JSON.stringify(case2construct));
          console.log("type of caselist:"+typeof(caselist))
          })
          .catch(err=>{
            console.log("Case.find({}) failed !!");
            console.log(err)
          })
      })
      .catch(err=>{
        console.log("Case.save({}) failed !!");
        console.log(err)
      })
    })
    .catch(err=>{
      console.log("Case.findById({}) failed !!");
      console.log(err)
    })
statusreport="以方法建構士身分進入本頁";
await Loyalist.findOne({_id:personID})
    .then(async loyalistx=>{
      console.log("type of loyalistx:"+typeof(loyalistx));
      console.log("loyalistx:"+loyalistx)
      loyalist1=encodeURIComponent(JSON.stringify(loyalistx));
      console.log("type of loyalist1:"+typeof(loyalist1));
      console.log("loyalist1:"+loyalist1)
      await ctx.render("branch/pwa4methodor" ,{
        loyalist1,
        caselist,
        personID,
        statusreport
          })
    })
    .catch(err=>{
      console.log("Loyalist.findOne() failed !!");
      console.log(err)
    })
},
//到Mehtodor的workspace
async methodorworkspace(ctx,next){
  console.log("found route /base4dcarbon/branch/methodor/workspace !!");
  var statusreport=ctx.query.statusreport;
  console.log("got statusreport:"+statusreport);
  var status=ctx.query.status;
  console.log("got status:"+status);
  var caseID=ctx.query.caseID;
  console.log("gotten caseID:"+caseID);
  var personID=ctx.params.id;
  console.log("gotten personID:"+personID);
  await ctx.render("branch/methodor/workspace",{
      statusreport,
      personID,
      caseID
  })
},
//到Collecterweb
async gocollecter(ctx, next) {

},
//到Investigatorweb
async goinvestigator(ctx, next) {

},
//到Receiverweb
async goreceiver(ctx, next) {

},
//到maintainertweb
async gomaintainer(ctx, next) {
  console.log("進入branch controller的maintainer");
  statusreport="以資料管理權限進入本頁";
  var personID=ctx.params.id;
  await ctx.render("innerweb/datamanage" ,{
      statusreport,
      personID
  })
}
}//EOF export
