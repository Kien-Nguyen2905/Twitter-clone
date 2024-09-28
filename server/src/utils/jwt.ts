import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'
import { TokenPayload } from '~/models/requests/User.requests'

config()
interface IPayload {
  user_id: string
  token_type:
    | TokenType.AccessToken
    | TokenType.RefreshToken
    | TokenType.EmailVerifyToken
    | TokenType.ForgotPasswordToken
}

export const signToken = ({ payload }: { payload: IPayload }) => {
  // the reason return promise is jwt function are asynchronous
  return new Promise<string>((resolve, reject) => {
    const privateKeysMap: Record<TokenType, string> = {
      [TokenType.AccessToken]: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      [TokenType.RefreshToken]: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      [TokenType.ForgotPasswordToken]: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      [TokenType.EmailVerifyToken]: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
    }

    const expiresInMap: Record<TokenType, string> = {
      [TokenType.AccessToken]: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
      [TokenType.RefreshToken]: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
      [TokenType.ForgotPasswordToken]: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string,
      [TokenType.EmailVerifyToken]: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string
    }

    const privateKey = privateKeysMap[payload.token_type]
    const expiresIn = expiresInMap[payload.token_type]

    const options: SignOptions = {
      expiresIn,
      algorithm: 'HS256'
    }

    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
