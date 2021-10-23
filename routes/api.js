const express = require('express');
const { exportingFilesFastCSV, downloadingFilesJSON2CSV, exportingFilesExcel, exportingFilesExcelAppend } = require('../controller/export-file');

const router = express.Router();

router.get('/export_file_fastCSV', exportingFilesFastCSV);
router.get('/export_file_JSON2CSV', downloadingFilesJSON2CSV);
router.get('/export_file_excel', exportingFilesExcel);
router.get('/export_file_excel_with_append', exportingFilesExcelAppend);

module.exports = router;
