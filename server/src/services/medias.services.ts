import { Request } from 'express'
import { getNameFromFullname, handleImage, handleVideo } from '~/utils/file'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
config()
class MediasService {
  async uploadImage(req: Request) {
    const file = await handleImage(req)
    // use promise.all to file in file.map execution faster, rather than use file.map normally
    const result = await Promise.all(
      file.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return isProduction
          ? `${process.env.HOST}/static/${newName}.jpg`
          : `http://localhost:${process.env.PORT}/static/${newName}.jpg`
      })
    )
    return result
  }
  async uploadVideo(req: Request) {
    const files = await handleVideo(req)
    const result = files.map((file) => {
      return isProduction
        ? `${process.env.HOST}/static/video/${file.newFilename}`
        : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`
    })
    return result
  }
}

const mediasService = new MediasService()

export default mediasService
