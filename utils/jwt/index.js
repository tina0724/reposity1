const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

// 签名的密钥
const jwt_secret = 'mySecretKey'

const jwt_access_expiration = 60 * 60 * 24 *100
const jwt_refresh_expiration = jwt_access_expiration * 100

const createJwt = ({ account, role_id }) => {
  const maxage = new Date().valueOf()
  const refresh_token_maxage = new Date(maxage + jwt_refresh_expiration)

  const refresh_token = createRefreshToken()
  const access_token = createAccessToken({ account, role_id })

  return [refresh_token, refresh_token_maxage, access_token]
}

const createAccessToken = (params) => {
  return jwt.sign(params, jwt_secret, {
    expiresIn: jwt_access_expiration,
  })
}
//当访问令牌过期后，客户端可以使用刷新令牌向服务器请求一个新的访问令牌，而无需用户重新提供凭证。
const createRefreshToken = () => {
  return uuidv4()
}
//验证传入的令牌
const verifyJwt = (token) => {
  if (!token) return undefined // 没有token的请求也需要额外处理
  const result = jwt.verify(token, jwt_secret, null, null)
  return result
}

module.exports = {
  createJwt,
  createAccessToken,
  verifyJwt,
}
