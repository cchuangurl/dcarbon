var router = require('@koa/router')();

const inputController = require('../controllers/index').input;
//列出清單
router.get('/', async (ctx, next)=> {
	await inputController.list(ctx)
});
//到新增資料頁
router.get('/inputpage', async (ctx, next)=> {
    await inputController.inputpage(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id)
    await inputController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch', async (ctx, next)=> {
    await inputController.batchinput(ctx,next)
});
//依參數id取得資料
router.get('/:id', async(ctx, next)=> {
	await inputController.retrieve(ctx)
});
//依參數no取得一筆資料
router.get('/find/:no', async(ctx, next)=> {
	await inputController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add', async (ctx, next)=> {
	console.log(ctx.request.body);
	await inputController.create(ctx)
});
//依參數id刪除資料
router.get('/delete/:id', async (ctx, next)=> {
	await inputController.destroy(ctx)
});
//依參數id更新資料
router.post('/update', async (ctx, next)=> {
	await inputController.update(ctx)
});
//到測試片段程式頁
router.get('/codetest', async (ctx, next)=> {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("input/codetest",{
		statusreport:statusreport
	})
});
module.exports = router;
