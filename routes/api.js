const express = require('express');
const { exportingFilesFastCSV, downloadingFilesJSON2CSV, exportingFilesExcel } = require('../controller/export-file');

const router = express.Router();

router.get('/export_file_fastCSV', exportingFilesFastCSV);
router.get('/export_file_JSON2CSV', downloadingFilesJSON2CSV);
router.get('/export_file_excel', exportingFilesExcel);

module.exports = router;
