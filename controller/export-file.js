const fileSystem = require('fs');
const fastcsv = require('fast-csv');
const { v1 } = require('uuid');

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const CsvParser = require('json2csv').Parser;
const { tutorials } = require('../public/sample');
const { startCloudinary } = require('../config/cloudinary-config');

exports.exportingFilesFastCSV = async (req, res) => {
  const fileData = [{
    id: 1,
    name: 'AAA',
    age: 21,
  }, {
    id: 2,
    name: 'BBB',
    age: 41,
  }, {
    id: 1,
    name: 'CCC',
    age: 31,
  }];

  const ws = fileSystem.createWriteStream('public/data.csv');
  fastcsv
    .write(fileData, { headers: true })
    .on('finish', () => res.send('<a href="/public/data.csv" download="data.csv" id="download-link">download </a><script>document.getElementById("download-link").click();</script>'))
    .pipe(ws);
};

exports.downloadingFilesJSON2CSV = async (req, res) => {
  const sampleData = tutorials;

  // objs.forEach((obj) => {
  //   const { id, title, description, published } = obj;
  //   tutorials.push({ id, title, description, published });
  // });

  const csvFields = ['id', 'name', 'age'];
  const csvParser = new CsvParser({ csvFields });
  const csvData = csvParser.parse(sampleData);

  res.setHeader('Content-Type', 'application/vnd');
  res.setHeader('Content-Disposition', 'attachment; filename=tutorials.csv');

  res.status(200).end(csvData);
};

exports.exportingFilesExcel = async (req, res) => {
  const data = tutorials;

  try {
    // Buat Workbook
    const fileName = 'person';
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: fileName,
      Author: 'John Doe',
      CreatedDate: new Date(),
    };
    // Buat Sheet
    wb.SheetNames.push('Sheet 1');
    // Buat Sheet dengan Data
    const ws = XLSX.utils.json_to_sheet(data);

    // Cek apakah folder downloadnya ada
    const downloadFolder = path.resolve(__dirname, '../downloads');

    if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder);
    }

    if (fs.existsSync(`${downloadFolder}${path.sep}${fileName}.xlsx`)) {
      fs.unlinkSync(`${downloadFolder}${path.sep}${fileName}.xlsx`);
      console.log('delete file');
    }

    try {
      //

      // Simpan filenya
      wb.Sheets['Sheet 1'] = ws;
      XLSX.writeFile(wb, `${downloadFolder}${path.sep}${fileName}.xlsx`);

      // return res.download(`${downloadFolder}${path.sep}${fileName}.xlsx`, 'product.xlsx', (err) => {
      //   if (err) {
      //     console.log(err);
      //   }
      //   fs.unlink(`${downloadFolder}${path.sep}${fileName}.xlsx`, () => {
      //     console.log('File was deleted');
      //   });
      // });

      // return res.download(`${downloadFolder}${path.sep}${fileName}.xlsx`);

      // const image = {
      //   module_src: reqType,
      //   module_id: idModule,
      //   file_type: 'image',
      //   file: `svc-product/${filename}`,
      //   name: dataDetail.image ? dataDetail.image[index].name : '',
      //   description: dataDetail.image ? dataDetail.image[index].description : '',
      //   sort_order: countPicture ? countPicture.countImage + 1 + index : index + 1,
      // };

      // const bufferDocExcel = fs.readFileSync(`${downloadFolder}${path.sep}${fileName}.xlsx`);

      // const fileExcel = {
      //   fieldname: 'document',
      //   encoding: '7bit',
      //   buffer: bufferDocExcel,
      //   originalname: 'product.xlsx',
      //   mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // };

      const cloudinary = await startCloudinary();
      const randUUID = v1();

      const uploadingExcel = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(`${downloadFolder}${path.sep}${fileName}.xlsx`,
          {
            resource_type: 'auto',
            public_id: randUUID,
          }, (error, result) => {
            if (error) return reject(error);
            if (result) return resolve(result);
            return true;
          });
      });

      if (fs.existsSync(`${downloadFolder}${path.sep}${fileName}.xlsx`)) {
        fs.unlinkSync(`${downloadFolder}${path.sep}${fileName}.xlsx`);
        console.log('delete file');
      }

      return res.send(uploadingExcel);
      // //
    } catch (e) {
      console.log(e.message);
      return res.send(e);
    }

    // samplet output
    // {
    //   "asset_id": "7286e2c45fb9f139aff73e559bc21e44",
    //   "public_id": "5640b300-33e9-11ec-ba8b-5127589e7759.xlsx",
    //   "version": 1634983782,
    //   "version_id": "1ee97c1af8c09d360b767c85e363a3dc",
    //   "signature": "22848b77d9ff9af7f9214d3f5de8e9fd8fa867cd",
    //   "resource_type": "raw",
    //   "created_at": "2021-10-23T10:09:42Z",
    //   "tags": [],
    //   "bytes": 22104,
    //   "type": "upload",
    //   "etag": "b46b34b9d47d9d2f9ed872a9a1e7b6da",
    //   "placeholder": false,
    //   "url": "http://res.cloudinary.com/raw/upload/v1634983782/5640b300-33e9-11ec-ba8b-5127589e7759.xlsx",
    //   "secure_url": "https://res.cloudinary.com/raw/upload/v1634983782/5640b300-33e9-11ec-ba8b-5127589e7759.xlsx",
    //   "original_filename": "person",
    //   "api_key": ""
    // }
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

exports.exportingFilesExcelAppend = async (req, res) => {
  const data = tutorials;

  try {
    // Buat Workbook
    const fileName = 'person';
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: fileName,
      Author: 'John Doe',
      CreatedDate: new Date(),
    };
    // Buat Sheet
    wb.SheetNames.push('Sheet 1');
    // Buat Sheet dengan Data
    const ws = XLSX.utils.json_to_sheet(data);

    // Cek apakah folder downloadnya ada
    const downloadFolder = path.resolve(__dirname, '../downloads');

    if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder);
    }

    if (fs.existsSync(`${downloadFolder}${path.sep}${fileName}.xlsx`)) {
      fs.unlinkSync(`${downloadFolder}${path.sep}${fileName}.xlsx`);
      console.log('delete file');
    }

    try {
      //
      const appendingExcel = [];
      const totalPage = [1];
      const appendData = [
        {
          id: 999999,
          name: 'TEST APPENDING DATA',
          age: 1000,
        },
      ];

      totalPage.map(() => {
        appendingExcel.push(XLSX.utils.sheet_add_json(ws, appendData, { skipHeader: true, origin: -1 }));
        return true;
      });

      await Promise.all(appendingExcel);

      // Simpan filenya
      wb.Sheets['Sheet 1'] = ws;
      XLSX.writeFile(wb, `${downloadFolder}${path.sep}${fileName}.xlsx`);

      const cloudinary = await startCloudinary();
      const randUUID = v1();

      const uploadingExcel = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(`${downloadFolder}${path.sep}${fileName}.xlsx`,
          {
            resource_type: 'auto',
            public_id: randUUID,
          }, (error, result) => {
            if (error) return reject(error);
            if (result) return resolve(result);
            return true;
          });
      });

      if (fs.existsSync(`${downloadFolder}${path.sep}${fileName}.xlsx`)) {
        fs.unlinkSync(`${downloadFolder}${path.sep}${fileName}.xlsx`);
        console.log('delete file');
      }

      return res.send(uploadingExcel);
      // //
    } catch (e) {
      console.log(e.message);
      return res.send(e);
    }

    // samplet output
    // {
    //   "asset_id": "7286e2c45fb9f139aff73e559bc21e44",
    //   "public_id": "5640b300-33e9-11ec-ba8b-5127589e7759.xlsx",
    //   "version": 1634983782,
    //   "version_id": "1ee97c1af8c09d360b767c85e363a3dc",
    //   "signature": "22848b77d9ff9af7f9214d3f5de8e9fd8fa867cd",
    //   "resource_type": "raw",
    //   "created_at": "2021-10-23T10:09:42Z",
    //   "tags": [],
    //   "bytes": 22104,
    //   "type": "upload",
    //   "etag": "b46b34b9d47d9d2f9ed872a9a1e7b6da",
    //   "placeholder": false,
    //   "url": "http://res.cloudinary.com/raw/upload/v1634983782/5640b300-33e9-11ec-ba8b-5127589e7759.xlsx",
    //   "secure_url": "https://res.cloudinary.com/raw/upload/v1634983782/5640b300-33e9-11ec-ba8b-5127589e7759.xlsx",
    //   "original_filename": "person",
    //   "api_key": ""
    // }
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};
