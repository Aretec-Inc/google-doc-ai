const router = require('express').Router()
const { createSubmmission } = require('../controllers/post')
const path = require('path')
var Multer = require('multer')

function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: PDF Only!');
    }
}

var multer = Multer({
    dest: 'uploads/',
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    }
}).array('files', 20);

var multerSuppDocs = Multer({
    dest: 'uploads/',
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file', 1);

var multerSuppDocsOneFile = Multer({
    dest: 'uploads/',
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file', 1);

router.post('/create-submission', createSubmmission)

// router.post('/upload', multer, upload)
// router.post('/uploadIncome', multer, uploadIncome)

// router.post('/uploadApplication', multerSuppDocsOneFile, uploadApplication)
// router.post('/upload-supp-doc', multerSuppDocs, uploadSupportingDocs)

// // router.post('/login', login)
// // router.post('/register', register)
// router.post('/updateCasePriority', updateCasePriority)
// router.post('/submitApplication', submitApplication)
// router.post('/updateIsOpen', updateIsOpen)
// router.post('/getCaseDetails', getCaseDetails)

// router.post('/getDocumentByAdjudication', getDocumentByAdjudication)

// router.post('/getCasesByCaseStatus', getCasesByCaseStatus)

// router.post('/getCasesByCategory', getCasesByCategory)

// router.post('/updateCaseNotes', updateCaseNotes)
// router.post('/uploadIdentity', multer, uploadIdentity)
// router.post('/feedback', feedback)
// router.post('/addNotes', addNotes)

module.exports = router