var router = require('@koa/router')();

const branchController = require('../controllers/index').branch;
const subactController = require('../controllers/index').subact;
const caseController = require('../controllers/index').case;
//依帳號決定轉頁
router.post('/', async (ctx, next)=> {
	await branchController.dispatch(ctx)
});
//到Applicantweb
router.get('/app4applicant/:id', async (ctx, next)=> {
    await branchController.goapplicant(ctx,next)
});
//到methodorweb
router.get('/pwa4decomposer/:id', async (ctx, next)=> {
  await branchController.godecomposer(ctx,next)
});
//到decomposer的findcase
router.get('/decomposer/findcase/:id', async (ctx, next)=> {
  await branchController.decomposerfindcase(ctx,next)
});
//到decomposer的choosecase
router.get('/decomposer/choosecase/:id', async (ctx, next)=> {
  await branchController.decomposerchoosecase(ctx,next)
});
//到decomposer的operate
router.get('/decomposer/operate/:id', async (ctx, next)=> {
  await subactController.operate(ctx,next)
});
//檢視活動解構結果
router.get('/decomposer/outcome/:id', async (ctx, next)=> {
  await caseController.decomposed(ctx,next)
});
//活動解構結果確定
router.get('/pass2methodor/:id', async (ctx, next)=> {
  await branchController.pass2methodor(ctx,next)
});
//到Methodorweb
router.get('/pwa4methodor/:id', async (ctx, next)=> {
  await branchController.gomethodor(ctx,next)
});
//到methodor的findcase
router.get('/methodor/findcase/:id', async (ctx, next)=> {
  await branchController.methodorfindcase(ctx,next)
});
//到methodor的choosecase
router.get('/methodor/choosecase/:id', async (ctx, next)=> {
  await branchController.methodorchoosecase(ctx,next)
});
//到methodor的operate
router.get('/methodor/workspace/:id', async (ctx, next)=> {
  await branchController.methodorworkspace(ctx,next)
});
//檢視方法建構結果
router.get('/methodor/outcome/:id', async (ctx, next)=> {
  await caseController.decomposed(ctx,next)
});
//到Collecterweb
router.get('/pwa4collecter/:id', async (ctx, next)=> {
  await branchController.gocollecter(ctx,next)
});
//到collecter的findemissor
router.get('/collecter/findemissor/:id', async (ctx, next)=> {
  await branchController.collecterfindemissor(ctx,next)
});
//到Investigatorweb
router.get('/pwa4investigator/:id', async (ctx, next)=> {
  await branchController.goinvestigator(ctx,next)
});
//到Accepterweb
router.get('/pwa4receiver/:id', async (ctx, next)=> {
  await branchController.goreceiver(ctx,next)
});

//到Maintainerweb
router.get('/maintainer/:id', async (ctx, next)=> {
  await branchController.gomaintainer(ctx,next)
});
module.exports = router;

module.exports = router;
