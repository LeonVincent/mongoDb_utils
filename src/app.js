const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const bodyParser = require('koa-bodyparser')
const Db = require('./utils/Mongodb')
console.log(Db)
console.log(Db)
const app = new Koa()
const router = new Router()
console.log(__dirname + '/views')
const render = views(__dirname + '/views', {
  map: {
    html: 'ejs'
  }
})

// app.use(views('views', {
//   extension: 'ejs'
// }))
app
  .use(render)
// .use(bodyParser)


router.get('/', async (ctx) => {
  console.time('aa')
  const haha = await Db.find('us', { name: 'lee999998' })
  console.timeEnd('aa')
  console.time('bb')
  const data = await Db.find('us', { name: 'lee999999' })
  console.timeEnd('bb')
  setTimeout(async () => {
    console.time('cc')
    const cc = await Db.find('us', { name: 'lee999989' })
    console.log(cc)
    console.timeEnd('cc')
  }, 3000);
  await ctx.render('app')
})

router.get('/main/:name/:id', async (ctx) => {
  // console.log(ctx.params)
  const insert = await Db.insertOne('users', { name: 'leon3', age: 129 })
  // console.log(insert)
  await Db.update('users', { name: 'leon3', age: 129 }, { name: 'leon666', age: 20 })


  ctx.body = 'main'
})

router.post('/doAdd', async (ctx) => {
  ctx.body = ctx.request.body //获取表单提交的数据
})




app
  .use(router.routes()) //启动路由
  .use(router.allowedMethods()) //跨域？？？

app.listen(3000)