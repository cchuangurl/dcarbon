var router = require('@koa/router')();

const awardController = require('../controllers/index').award;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await awardController.list(ctx)
});
//到新增資料頁
router.get('/inputpage', async (ctx, next)=> {
    await awardController.inputpage(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id)
    await awardController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch', async (ctx, next)=> {
    await awardController.batchinput(ctx,next)
});
//依參數id取得資料
router.get('/:id', async(ctx, next)=> {
	await awardController.retrieve(ctx)
});
//依參數no取得一筆資料
router.get('/find/:no', async(ctx, next)=> {
	await awardController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add', async (ctx, next)=> {
	console.log(ctx.request.body);
	await awardController.create(ctx)
});
//依參數id刪除資料
router.get('/delete/:id', async (ctx, next)=> {
	await awardController.destroy(ctx)
});
//依參數id更新資料
router.post('/update', async (ctx, next)=> {
	await awardController.update(ctx)
});
//到測試片段程式頁
router.get('/codetest', async (ctx, next)=> {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("award/codetest",{
		statusreport:statusreport
	})
});
module.exports = router;
