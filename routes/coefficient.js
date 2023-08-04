var router = require('@koa/router')();

const coefficientController = require('../controllers/index').coefficient;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await coefficientController.list(ctx)
});
//到新增資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await coefficientController.inputpage(ctx,next)
});
//到新增係數頁
router.get('/inputcoeff/:id', async (ctx, next)=> {
  await coefficientController.inputpage(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id)
    await coefficientController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await coefficientController.batchinput(ctx,next)
});
//依參數id取得資料
router.get('/:id', async(ctx, next)=> {
	await coefficientController.retrieve(ctx)
});
//依參數no取得一筆資料
router.get('/find/:no', async(ctx, next)=> {
	await coefficientController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add/:id', async (ctx, next)=> {
	console.log(ctx.request.body);
	await coefficientController.create(ctx)
});
//依參數id刪除資料
router.get('/delete/:id', async (ctx, next)=> {
	await coefficientController.destroy(ctx)
});
//依參數id更新資料
router.post('/update', async (ctx, next)=> {
	await coefficientController.update(ctx)
});
//到測試片段程式頁
router.get('/codetest', async (ctx, next)=> {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("coefficient/codetest",{
		statusreport:statusreport
	})
});
module.exports = router;
