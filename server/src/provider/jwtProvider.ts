import jwt from 'jsonwebtoken'

const generateToken = ({
  payload,
  secretOrPrivateKey,
  options = {
    algorithm: 'HS256',
  },
}: {
  payload: string | object | Buffer
  secretOrPrivateKey: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

const verifyToken = (token: string, secretOrPrivateKey: string) => {
  return new Promise<any>((resolve, reject) => {
    jwt.verify(token, secretOrPrivateKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded)
    })
  })
}

export const jwtProvider = {
  generateToken,
  verifyToken,
}
