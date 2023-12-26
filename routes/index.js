const fs = require('fs')
require('express-async-errors') // 全局router异常处理的引入

// 后续创建route也无需在index目录中手动添加
// 流程：扫描 -> 过滤 -> 取文件 -> 加载

const autoLoadRoute = (blacklist = ['index.js'], whitelist = []) => {
  const fileList = fs.readdirSync('routes')
  return fileList
    .filter(
      (fileName) =>
        whitelist.includes(fileName) || !blacklist.includes(fileName)
    )
    .map((fileName) => fileName.split('.').shift())
    .reduce(
      (res, item) => ({
        ...res,
        [item]: require(`./${item}`),
      }),
      {}
    )
  //返回的对象将包含所有文件名与对应文件模块导出对象的映射关系。
}

const routeStores = autoLoadRoute()


const loadRouter = (
  expressInstance,
  routes = routeStores,
  publicPath = '/api'
) =>
  Object.values(routes).forEach((router) =>
    expressInstance?.use(publicPath, router)
  )
//将 routes 对象中的所有路由模块都注册到 Express 应用实例中，使用publicPath 进行路径映射。

module.exports = {
  loadRouter,
  routeStores,
}
