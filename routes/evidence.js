var router = require('@koa/router')();

const evidenceController = require('../controllers/index').evidence;
//列出清單
router.get('/:id', async (ctx, next)=> {
	await evidenceController.list(ctx)
});
//到新增資料頁
router.get('/inputpage/:id', async (ctx, next)=> {
    await evidenceController.inputpage(ctx,next)
});
//到修正單筆資料頁
router.get('/editpage/:id', async (ctx, next)=> {
    console.log("get id:"+ctx.params.id)
    await evidenceController.editpage(ctx,next)
});
//批次新增資料
router.get('/inputbatch/:id', async (ctx, next)=> {
    await evidenceController.batchinput(ctx,next)
});
//依參數id取得資料
router.get('/:id', async(ctx, next)=> {
	await evidenceController.retrieve(ctx)
});
//依參數no取得一筆資料
router.get('/find/:no', async(ctx, next)=> {
	await evidenceController.findByNo(ctx)
});
//寫入一筆資料
router.post('/add', async (ctx, next)=> {
	console.log(ctx.request.body);
	await evidenceController.create(ctx)
});
//依參數id刪除資料
router.get('/delete/:id', async (ctx, next)=> {
	await evidenceController.destroy(ctx)
});
//依參數id更新資料
router.post('/update', async (ctx, next)=> {
	await evidenceController.update(ctx)
});
//去上傳既有資料檔頁
router.get('/upload/:id', async (ctx, next)=> {
  await evidenceController.uploadpage(ctx,next)
});
//去上傳既有資料檔頁
router.get('/uploadfile/:id', async (ctx, next)=> {
  await evidenceController.uploadfile(ctx,next)
});
//去拍照及上傳頁
router.get('/photo/:id', async (ctx, next)=> {
	await evidenceController.takepicture(ctx)
});
//到測試片段程式頁
router.get('/codetest', async (ctx, next)=> {
    var {statusreport}=ctx.request.body;
    console.log("gotten query:"+statusreport);
    if(statusreport===undefined){
        statusreport="status未傳成功!"
    }
	await ctx.render("evidence/codetest",{
		statusreport:statusreport
	})
});
module.exports = router;
