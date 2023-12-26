//包装 Express 路由处理函数的中间件；在路由处理函数完成后对返回结果进行处理，并进行加密和格式化后发送给客户端。
const { OK, Fail } = require('../result')
const cryptoInstance = require('../crypto')
//handler为路由处理函数
const wrapper = (handler) => async (req, res, next) => {
  try {
    const response = await handler?.(req, res, next)
    const result = new OK({
      data: response,
      msg: '操作成功',
    })
    //const encryptData = cryptoInstance.encryptByAES(JSON.stringify(result), res.AESKey)
    //res.send(encryptData)
    res.json(result)
  } catch (error) {
    const errorResult = new Fail({
      msg: error.message,
    })
    res.send(errorResult)
  }
}

module.exports = wrapper
