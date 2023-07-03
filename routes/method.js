var router = require('@koa/router')();

const methodController = require('../controllers/index').method;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await methodController.list(ctx)
});
//到新增資料頁
router.get('/inputpage', async (ctx, next)=> {
    await methodController.inputpage(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id)
    await methodController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch', async (ctx, next)=> {
    await methodController.batchinput(ctx,next)
});
//依參數id取得資料
router.get('/:id', async(ctx, next)=> {
	await methodController.retrieve(ctx)
});
//依參數no取得一筆資料
router.get('/find/:no', async(ctx, next)=> {
	await methodController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add', async (ctx, next)=> {
	console.log(ctx.request.body);
	await methodController.create(ctx)
});
//依參數id刪除資料
router.get('/delete/:id', async (ctx, next)=> {
	await methodController.destroy(ctx)
});
//依參數id更新資料
router.post('/update', async (ctx, next)=> {
	await methodController.update(ctx)
});
//到測試片段程式頁
router.get('/codetest', async (ctx, next)=> {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("method/codetest",{
		statusreport:statusreport
	})
});
module.exports = router;
