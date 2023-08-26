var router = require('@koa/router')();

const caseController = require('../controllers/index').case;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await caseController.list(ctx)
});
//到新增資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await caseController.inputpage(ctx,next)
});
//到申請人新增申請案頁
router.get('/inputpage1/:id', async (ctx, next)=> {
  await caseController.inputpage1(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id)
    await caseController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await caseController.batchinput(ctx,next)
});
//依參數id取得資料
router.get('/:id', async(ctx, next)=> {
	await caseController.retrieve(ctx)
});
//依參數no取得一筆資料
router.get('/find/:no', async(ctx, next)=> {
	await caseController.findByNo(ctx)
});
////檢視某一個申請案資料
router.get('/caseinfo/:id', async(ctx, next)=> {
	await caseController.caseinfo(ctx)
});
//寫入一筆資料
router.post('/add', async (ctx, next)=> {
	console.log(ctx.request.body);
	await caseController.create(ctx)
});
//寫入申請人填寫資料
router.post('/addbyapplicant/:id', async (ctx, next)=> {
	console.log(ctx.request.body);
	await caseController.create1(ctx)
});
//applicant查詢申請案件
router.get('/applycase/:id', async (ctx, next)=> {
  await caseController.applycase(ctx,next)
});

//到Applicant上傳資料準備
router.get('/preparedata/:id', async (ctx, next)=> {
  await caseController.preparedata(ctx,next)
});
//依參數id刪除資料
router.get('/delete/:id', async (ctx, next)=> {
	await caseController.destroy(ctx)
});
//依參數id更新資料
router.post('/update', async (ctx, next)=> {
	await caseController.update(ctx)
});
//到測試片段程式頁
router.get('/codetest', async (ctx, next)=> {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("case/codetest",{
		statusreport:statusreport
	})
});
module.exports = router;
