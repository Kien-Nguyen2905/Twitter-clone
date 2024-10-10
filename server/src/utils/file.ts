import { UPLOAD_TEMP_DIR } from '~/constants/dir'
import { Request } from 'express'
import { File } from 'formidable'
import fs from 'fs'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true // mục đích là để tạo folder nested
    })
  }
}

export const handleImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  // formidable hanlde upload file image
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 50000 * 1024, // 4MB
    maxTotalFileSize: 4000 * 1024 * 4,
    // filter
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        // default form dosen't throw error so using form.emit throw error
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  // use Promise handle asynchronous of form.parse, throw error
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve(files.image as File[])
    })
  })
}

export const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}
