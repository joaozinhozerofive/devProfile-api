import multer from 'multer'
import crypto from 'crypto'
import path from 'path'

const TMP_FOLDER  = path.resolve(__dirname, "..", "..", "TMP") 

 const uploadConfig = {
    storage : multer.diskStorage({
        destination : TMP_FOLDER, 
        filename(request, file, callback){
            const fileHash = crypto.randomBytes(16).toString("hex"); 
            const filename = `${fileHash}-${file.originalname}`

            return callback(null, filename)
        }
    })
}


export {uploadConfig}
export {TMP_FOLDER}


