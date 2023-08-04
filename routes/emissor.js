var router = require('@koa/router')();

const emissorController = require('../controllers/index').emissor;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await emissorController.list(ctx)
});
//到新增資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await emissorController.inputpage(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id)
    await emissorController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await emissorController.batchinput(ctx,next)
});
/*依參數id取得資料
router.get('/:id', async(ctx, next)=> {
	await emissorController.retrieve(ctx)
});
*/
//依參數no取得一筆資料
router.get('/find/:no', async(ctx, next)=> {
	await emissorController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add/:id', async (ctx, next)=> {
	console.log(ctx.request.body);
	await emissorController.create(ctx)
});
//依參數id刪除資料
router.get('/delete/:id', async (ctx, next)=> {
	await emissorController.destroy(ctx)
});
//依參數id更新資料
router.post('/update', async (ctx, next)=> {
	await emissorController.update(ctx)
});
//選擇要認領參數
router.get('/chooseemissor/:id', async (ctx, next)=> {
	await emissorController.move2collect(ctx)
});
//到測試片段程式頁
router.get('/codetest', async (ctx, next)=> {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("emissor/codetest",{
		statusreport:statusreport
	})
});
module.exports = router;
