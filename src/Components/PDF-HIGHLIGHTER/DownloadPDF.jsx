// import { PDFDocument } from 'pdf-lib'
// import Download from 'downloadjs'
// const getFileInBytes = (url) => fetch(url).then(res => res.arrayBuffer())

// export const DownloadPDFWithSignature = (PDF_URL, { imgURL, layout }, pageNumber) => {

//     return new Promise(async(resolve,reject) => {  
//         try {   
//             const pdfInBytes = await getFileInBytes(PDF_URL)
//             // Load a PDFDocument from the  PDF bytes
//             const pdfDoc = await PDFDocument.load(pdfInBytes)
//             const pages = pdfDoc.getPages()
//             const page = pages[pageNumber]


//             const pngImageBytes = await getFileInBytes(imgURL)
//             const pngImage = await pdfDoc.embedPng(pngImageBytes)

//             // Draw the PNG image at layout (specific x,y)
   


//             const pageWidth = page.getSize().width
//             const pageHeight = page.getSize().height

//             const width = parseInt(layout?.width) 
//             const height = parseInt(layout?.height)
//             const x=  (layout?.x) * pageWidth
//             const y =( layout?.y) * pageHeight
//             page.drawImage(pngImage, {height,width,x,y} )

//             // Serialize the PDFDocument to bytes (a Uint8Array)
//             const pdfBytes = await pdfDoc.save()
//             await Download(pdfBytes, "signed.pdf",  "application/pdf" );
//          resolve(pdfBytes)
//         }
//         catch (e) {
//             reject(e)
//         }
//     })
// }
