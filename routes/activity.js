var router = require('@koa/router')();

const activityController = require('../controllers/index').activity;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await activityController.list(ctx)
});
//到新增活動資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await activityController.inputpage(ctx,next)
});
//到申請人填寫活動資料頁
router.get('/inputpage1/:id', async (ctx, next)=> {
  await activityController.inputpage1(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id)
    await activityController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await activityController.batchinput(ctx,next)
});
//依參數id取得資料
router.get('/:id', async(ctx, next)=> {
	await activityController.retrieve(ctx)
});
//依參數no取得一筆資料
router.get('/find/:no', async(ctx, next)=> {
	await activityController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add', async (ctx, next)=> {
	console.log(ctx.request.body);
	await activityController.create(ctx)
});
//存入申請人填寫的活動資料
router.post('/add1/:id', async (ctx, next)=> {
	console.log(ctx.request.body);
	await activityController.create1(ctx)
});
//依參數id刪除資料
router.get('/delete/:id', async (ctx, next)=> {
	await activityController.destroy(ctx)
});
//依參數id更新資料
router.post('/update', async (ctx, next)=> {
	await activityController.update(ctx)
});
//到測試片段程式頁
router.get('/codetest', async (ctx, next)=> {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("activity/codetest",{
		statusreport:statusreport
	})
});
module.exports = router;
