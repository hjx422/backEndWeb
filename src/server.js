/**
 * Created by hjx on 9/7/2017.
 */
const Koa = require('koa')
const Router = require('koa-router')
const Views = require('koa-views')

//const app = new Koa()
//const router = new Router()
//
//app.use(Views(__dirname + '/views', {
//    map: { html: 'mustache' }
//}))
//
//const route = router.get('/', (ctx, next) => {
//    ctx.render('app.html', {
//        pageTitle: '哈哈哈'
//    })
//})
//
//app.use(route)
//
//app.listen(3000)
//console.log('Koa started on port 3000')

const app = new Koa()
const router = new Router()

app.use(Views(__dirname + '/views', {
    map: {
        jade: 'jade',
        html: 'mustache'
    }
}))

//const indexRoute = router.get('/', async (ctx, next) => {
//    await ctx.render('app.html', {
//        pageTitle: '哈哈'
//    })
//})

const indexPage = async (ctx, next) => {
    await ctx.render('app.html', {
        pageTitle: '哈哈=='
    })
}

//app.use(async (ctx, next) => {
//    await ctx.render('app.html', {
//        pageTitle: '哈哈'
//    })
//})

app.use(indexPage)

app.listen(3000)
console.log('Koa started on port 3000')
