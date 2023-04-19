const express = require('express')
var router = express.Router();


const ftpClient = require("basic-ftp");
const fs = require("fs");
const os = require('os');


const multer = require("multer");
const path = require('path');
const upload = multer({ dest: "uploads/" });


router.route('/UploadFile').post(upload.single("file"),async (req,res)=>{

    console.log(req.headers);
    console.log(req.file);

    const client = new ftpClient.Client()
    client.ftp.verbose = true

    try{
        await client.access({
            host:'0.0.0.0',
            port: 21,
            user: "user",
            secure: false, // set to true for FTPS connections
        })

        const filePath = req.file.path;
        const fileContents =  fs.createReadStream(filePath);
        //console.log(fileContents)

        await client.cd('/mediafiles');

        const fileName = req.file.originalname;
        const fileNameWithoutExt = path.basename(fileName, path.extname(fileName));
        console.log(fileName)
        const fileExt = path.extname(fileName);

        await client.uploadFrom(fileContents, fileNameWithoutExt + req.file.filename + fileExt);
        console.log("File uploaded successfully!");
        res.send(fileNameWithoutExt + req.file.filename + fileExt);
    }catch(error){
        console.log(error)
        res.status(500).send("Error uploading file")
    }finally{
        client.close()
    }

})

router.route('/DownloadFile/:fileName').get(async (req, res) => {
    const client = new ftpClient.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: '0.0.0.0',
            port: 21,
            user: 'user',
            secure: false,
        });

        const fileName = req.params.fileName;
        const remoteFilePath = `/mediafiles/${fileName}`;
        const localFilePath = path.join(os.homedir(), 'Downloads', fileName);

        await client.cd('/mediafiles');

        await client.downloadTo(localFilePath, remoteFilePath);
        console.log('File downloaded successfully!');
        res.download(localFilePath,fileName);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error downloading file');
    } finally {
        client.close();
    }
});


module.exports = router;