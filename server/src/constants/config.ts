export const envConfig = {
  port: (process.env.PORT as string) || 4000,
  //   host: process.env.HOST as string,
  dbName: process.env.DB_NAME as string,
  passwordSecret: process.env.PASSWORD_SECRET as string
}
