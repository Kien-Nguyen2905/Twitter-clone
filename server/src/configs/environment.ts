import dotenv from 'dotenv'
dotenv.config()
interface TypesEnv {
  MG_DB: string
  PORT: string
  DB_NAME: string
}
export const env: TypesEnv = {
  MG_DB: process.env.MG_DB as string,
  PORT: process.env.PORT as string,
  DB_NAME: process.env.DB_NAME as string
}
