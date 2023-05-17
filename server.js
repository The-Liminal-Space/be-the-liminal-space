const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());



//Multer storage configuration
const storage = multer.memoryStorage()
const upload = multer({ storage })
// const storage = multer.memoryStorage() creates a new storage engine. memoryStorage engine stores the uploaded file in memory as a 'Buffer' object rather than saving it to disk. It is suitable for smaller files or scenarios where you don't want to persist the uploaded file.

//Express route for file upload
app.post('/upload', upload.single('image'), (req, res) => {
    const { originalname, buffer } = req.file

    db.uploadPhoto(originalname, buffer)
    .then((photoId) => {
        res.send(`Photo uploaded successfully with ID: ${photoId}`)
    })
    .catch((error) => {
        console.error(`Error uploading photo`, error)
        res.status(500).send('Error uploading photo')
    })
})

    //app.post('/upload'....) defines a POST route for the /upload URL path

//upload.single('image') This part is middleware provided by multr. It is used to handle a single upload with the field name 'image'. If the request contains multi files or the field name does not match then 'multr' will rise an error.

// originalname is the name of the uploaded file as specified by the client.

//buffer contains the binary data of the uploaded file stored in memory (if using multer.memoryStorage() as the storage engine)

    // Save the file to the database
//Over all the above code handles the execution of the SQL query to insert the uploaded image into the PostgreSQL database. It also handles the response and errors
// 'pool.query() is method provided by pg (node-postgres) library and is used to send a SQL query to the database. It takes three parameters: The SQL query string, an array of values to substitute into the query, and a callback function that handles the query result or error.
//'Insert INTO images (name, data) Values ($1, $2) is the SQL query being executed. It is an INSERT statement that inserts data into the 'images' table. The (name, data) column names represent the columns where the file's name and data will be stored, respectively. The $1 and $2 are placeholders for the values to be inserted.
// [originalname, buffer] This array provides the values to be substituted into the SQL query. originalname refers to the file's original name and buffer referres to binary data
// (error, result) => {...} This is the callback function that handles the result or error returned by the pool.query() method. 
// res.send('Image uploaded successfully') This line sends a response to the client with the message string. It indicates that the image was uploaded and saved to the database successfully.




/*Things to consider with storage:
1. Disk Storage
    - multr.diskStorage() to store uploaded files on disk. This approach writes the file to a specified destination on the server's file system.
    - Configure multer.diskStorage() with a destination directory where the files will be stored. This way, the uploaded image files will be written directly to disk instead of being held in memory.
    - Disk storage is suitable for larger files as it avoids consuming excessive memory. However, keep in mind that you should have enough disk space available and consider implementing a strategy to manage and clean up old files periodically.
2. Cloud Storage Services
    - Instead of storing the files on your local disk, you can integrate multer with cloud storage services like Amazon S3, Google Cloud Storage, Azure Blob Storage.
    - Using cloud storage services allows you to offload the storage and management of large image files to scalable reliable cloud infrastructure.
    - Configure multer to use the appropriate storage engine for your chosen cloud storage service. Each service will have its own setup and configuration process. You will typically need to provide authentication credentials, bucket/container names, and other relevant details.
3. Memory Storage
    -this is a multer thing that stores and uploads the file in memory
    - this is great for small, single file uploads. A few megabytes in size or smaller. For example, it works well for handling image thumbnails, small documents, or short audio clips.
*/

//Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

