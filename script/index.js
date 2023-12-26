//加载系统初始化脚本，其中包括检查数据库中是否已存在用户、角色和权限数据，如果不存在则进行加载。
// 函数内部，首先使用 await 关键字获取了用户、角色和权限的文档数量，然后通过条件判断和数据库操作来确保数据的完整性。在此过程中，还涉及到了 Redis 数据库的操作，通过 redisClient 对象与 Redis 进行交互，并根据条件判断来决定是否加载默认数据。
// 最后，通过 module.exports 导出了 loadScript 函数，使其可以在其他文件中被引用和调用。
const path = require('path')
const _ = require('lodash')
const userModel = require('../models/user')
const roleModel = require('../models/role')
const permissionModel = require('../models/permission')
const { redisClient } = require('../config/db/redis')//Redis 客户端实例
const { finishInWhichDB } = require('../redis/permission')
const { REDIS_DB } = require('../public/constants')
const data = require('./data')

const loadScript = async () => {
  const userCount = await userModel.countDocuments()
  const roleCount = await roleModel.countDocuments()
  const permissionCount = await permissionModel.countDocuments()
  await finishInWhichDB(REDIS_DB.permission, async (redisClient) => {
    const allKeys = await redisClient.keys('*')
    if (!allKeys.length) {
      let params = null
      if (!permissionCount) params = data.REDIS_KEY_AND_VALUE
      else {
        const result = await roleModel.aggregate([
          {
            $lookup: {
              from: 'permissions',
              localField: 'permission_ids',
              foreignField: '_id',
              as: 'permissions',
            },
          },
        ])
        params = result.reduce((res, item) => {
          return {
            ...res,
            [item._id?.toString()]: JSON.stringify(item.permissions),
          }
        }, {})
      }
      await redisClient.mSet(params)
    }
  })

  // 如果是空的，就加载默认数据
  switch (true) {
    case !userCount:
      await userModel.insertMany(data.DEFAULT_USERS)
    case !roleCount:
      await roleModel.insertMany(data.DEFAULT_ROLES)
    case !permissionCount:
      await permissionModel.insertMany(data.DEFAULT_PERMISSIONS)
    default:
      console.log('默认数据加载完成')
  }
}

module.exports = { loadScript }
