var router = require('@koa/router')();

const progressController = require('../controllers/index').progress;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await progressController.list(ctx)
});
//到新增資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await progressController.inputpage(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id)
    await progressController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await progressController.batchinput(ctx,next)
});
//依參數id取得資料
router.get('/:id', async(ctx, next)=> {
	await progressController.retrieve(ctx)
});
//依參數no取得一筆資料
router.get('/find/:no', async(ctx, next)=> {
	await progressController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add', async (ctx, next)=> {
	console.log(ctx.request.body);
	await progressController.create(ctx)
});
//由API寫入一筆資料
router.get('/add0', async (ctx, next)=> {
	await progressController.create0(ctx)
});
//依參數id刪除資料
router.get('/delete/:id', async (ctx, next)=> {
	await progressController.destroy(ctx)
});
//依參數id更新資料
router.post('/update', async (ctx, next)=> {
	await progressController.update(ctx)
});
//碳權申請人查詢案件進度
router.get('/applycase/:id', async (ctx, next)=> {
	await progressController.applycase(ctx)
});
//到測試片段程式頁
router.get('/codetest', async (ctx, next)=> {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("progress/codetest",{
		statusreport:statusreport
	})
});
module.exports = router;
