var router = require('@koa/router')();

const dataneedController = require('../controllers/index').dataneed;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await dataneedController.list(ctx)
});
//到新增資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await dataneedController.inputpage(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id)
    await dataneedController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await dataneedController.batchinput(ctx,next)
});

//依參數no取得一筆資料
router.get('/find/:no', async(ctx, next)=> {
	await dataneedController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add', async (ctx, next)=> {
	console.log(ctx.request.body);
	await dataneedController.create(ctx)
});
//依參數id刪除資料
router.get('/delete/:id', async (ctx, next)=> {
	await dataneedController.destroy(ctx)
});
//依參數id更新資料
router.post('/update', async (ctx, next)=> {
	await dataneedController.update(ctx)
});
//到訂定基線資料項目
router.get('/baselineitem/:id', async(ctx, next)=> {
	await dataneedController.baselineoperate(ctx)
});
//到訂定減碳或增匯資料項目
router.get('/newactitem/:id', async(ctx, next)=> {
	await dataneedController.newactoperate(ctx)
});
//到訂定持續減碳或增匯資料項目
router.get('/postitem/:id', async(ctx, next)=> {
	await dataneedController.postoperate(ctx)
});
//到測試片段程式頁
router.get('/codetest', async (ctx, next)=> {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("dataneed/codetest",{
		statusreport:statusreport
	})
});
module.exports = router;
