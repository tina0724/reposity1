const express = require('express')
const wrapper = require('../utils/wrapper')
const loginController = require('../controller/login')

const router = express.Router()

//将 /login 路由与 loginController.login 处理函数绑定，并使用 wrapper 中间件对其进行包装
router.post('/login', wrapper(loginController.login))

router.post('/updateAccessToken', wrapper(loginController.updateAccessToken))

router.post('/logout', wrapper(loginController.logout))

module.exports = router
