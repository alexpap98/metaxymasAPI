
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

const sendToPHPServer = async (req) => {
    const file = req.file;
    const imagePath = file.path;
    return new Promise((resolve, reject) => {
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.log("err", err);
                reject(err);
                return;
            }
            const formData = new FormData();
            const blob = new Blob([data], { type: file.mimetype });
            const blobWithFilename = new File([blob], file.originalname.toLocaleLowerCase(), { type: file.mimetype });
            formData.append('photo', blobWithFilename);
            console.log("sending");
            fetch(`http://storage.metaximas.gr/index.php/${req.params.folder}`, {
                method: 'POST',
                body: formData,
                headers: { 'Authorization': `${req.signedToken}` }
            })
                .then((response) => {
                    console.log("first");
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then((data) => {
                    console.log("done?");
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error(`Error removing file: ${err}`);
                            return;
                        }
                    });
                    resolve(data);
                })
                .catch((error) => {
                    console.log("error", error);
                    reject(error);
                });
        });
    });
}

const deleteFileFromPHPServer = async (req) => {

    const folderPath = req.params.folder;
    const fileName = req.params.fileName.toLocaleLowerCase();
    return new Promise((resolve, reject) => {
        fetch(`http://storage.metaximas.gr/index.php/${folderPath}/${fileName}`, {
            method: 'DELETE',
            headers: { 'Authorization': `${req.signedToken}` }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

module.exports = function (app) {

    app.post('/:folder', upload.single('photo'), (req, res) => {
        const folderPath = req.params.folder;
        // const acceptedFolders = ["bookCovers"];
        console.log(folderPath);

        // if (acceptedFolders.includes(folderPath)) {
            sendToPHPServer(req).then((result) => {
                res.json({ message: 'File sent to another server', result });
            }).catch((error) => {
                res.status(500).json({ message: error.message });
            })
        // } else {
            // res.status(500).json({ message: 'wrong path' });
        // }
    })

    app.delete('/:folder/:fileName', (req, res) => {


        deleteFileFromPHPServer(req).then((result) => {
            res.json({ message: 'File deleted', result });
        }).catch((error) => {
            res.status(500).json({ message: error.message });
        })

    })

    app.use('/file', express.static(path.join(__dirname, 'uploads')));

}