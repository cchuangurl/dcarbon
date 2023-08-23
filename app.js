var koa = require('koa')
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror')
  , path =require("path")
  , koastatic=require('koa-static')
  , cors=require('koa-cors')
  , cookieParser=require("cookie-parser")
  //, bodyparser=require("koa-bodyparser")
  //, bodyparser=require("koa-body")
  , koarouter=require("@koa/router");
  const koabody= require('koa-body').default;
  //import { koabody } from 'koa-body';
//var index = require('./routes/index');
//var users = require('./routes/users');
var app=new koa();

// error handler
onerror(app);

// global middlewares
app.use(cors());
app.use(views(__dirname+'/views', {
    //extension: 'ejs'
    extension: 'ejs'
}));
//app.use(bodyparser());
app.use(koabody({
    enableTypes:["json","form","text"],
    multipart:true
}));
/*
app.use(ctx=>{
    ctx.body=`Request Body:${JSON.Stringify(ctx.request.body)}`
})
*/
app.use(json());
app.use(logger());
//app.use(koa.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(koastatic('https://storage.googleapis.com/cchuang_deep1/public'));
app.use(koastatic(__dirname+'/public'));
//console.log("content of allRouters 1:"+allRouters['post']);
var router=new koarouter();
//home rouer
let indexRouter=new koarouter();
indexRouter.get('/', async (ctx, next) =>{
    console.log(" indextRouter executing!!");
    //next();
    //ctx.body="display test!!"
    await ctx.render('entry')
      });
//router.use('/', indexRouter.routes(), indexRouter.allowedMehtods());
router.use('/', indexRouter.routes());

// catch 404 and forward to error handler
let errpage=new koarouter();
errpage.get('/404', async (ctx, next) =>{
        ctx.body="display error!!"
    //await ctx.render('error');
  });

router.use('/404', errpage.routes());
let otherRouters=require('./routes/index');
for(var key in otherRouters) {
	let temp=key+"temp";
        temp=new koarouter();
        temp =otherRouters[key];
        router.use('/base4dcarbon/'+key, temp.routes(), temp.allowedMethods());
}
app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx, next)=>{
  var start = new Date;
  await next();
  var ms = new Date - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  console.log("logger executed!!")
});

// error-handling
app.on('error', (err, ctx, next) => {
  console.error('server error', err, ctx);
  console.log("error found!!")
});

//app.use(async (err, ctx, next)=> {
    //set locals, only providing error in development
    //ctx.locals.message = err.message;
    //ctx.locals.error = ctx.app.get('env') === 'development' ? err : {};

    // render the error page
    //ctx.status(err.status || 500);
    //ctx.render('error');
  //});
  module.exports = app
