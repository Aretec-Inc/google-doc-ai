const { storage } = require('../config')

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

const downloadFile = async (file) => {
    const res = await file.download()

    let pdfBinary = res?.flat()?.[0] || res?.[0]
    if (pdfBinary) {
        let buff = Buffer.from(pdfBinary, 'binary')

        return buff

    } else {
        throw new Error(`Something went wrong when downloading file!`)
    }
}

module.exports = (bucketName, fileName) => {

    return new Promise(async (resolve, reject) => {

        const bucket = storage.bucket(bucketName)
        const file = bucket.file(fileName)
        try {

            //download the file in memory
            const fileDownload = await downloadFile(file)
            resolve(fileDownload)

        } catch (e) {
            console.log("Before Sleep ==>")
            sleep(2000)
            console.log("After Sleep ==>")
            const fileDownload = await downloadFile(file)
            if (fileDownload) {
                resolve(fileDownload)
            }
            else {
                reject(e)
            }
        }

    })

} 