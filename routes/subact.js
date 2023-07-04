var router = require('@koa/router')();

const subactController = require('../controllers/index').subact;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await subactController.list(ctx)
});
//到新增細部流程資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await subactController.inputpage(ctx,next)
});
//到新增細部流程資料頁
router.get('/inputpage1/:id', async (ctx, next)=> {
  await subactController.inputpage1(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id)
    await subactController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await subactController.batchinput(ctx,next)
});
//依參數id取得資料
router.get('/:id', async(ctx, next)=> {
	await subactController.retrieve(ctx)
});
//依參數no取得一筆資料
router.get('/find/:no', async(ctx, next)=> {
	await subactController.findByNo(ctx)
});
//由作業區單筆輸入寫入一筆資料
router.post('/add1/:id', async (ctx, next)=> {
	console.log(ctx.request.body);
	await subactController.create(ctx)
});
//依參數id刪除資料
router.get('/delete/:id', async (ctx, next)=> {
	await subactController.destroy(ctx)
});
//依參數id更新資料
router.post('/update', async (ctx, next)=> {
	await subactController.update(ctx)
});
//到測試片段程式頁
router.get('/codetest', async (ctx, next)=> {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("subact/codetest",{
		statusreport:statusreport
	})
});
module.exports = router;
