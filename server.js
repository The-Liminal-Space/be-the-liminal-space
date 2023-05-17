const express = require('express')
const app = express()
const multer = require('multer')
const { Pool } = require('pg')

const pool = new Pool({
    user: 'your_username', //username for your PostgreSQL database
    host: 'your_host', // host or IP address where your PostgreSQL server is running
    database: 'your_database', // Name of the database you want to connect to
    password: 'your_password',// password for your database user
    port: 5432, // PostgreSQL port
})
/*
Local Development:

User: If you installed PostgreSQL locally, you might be using the default user, which is often postgres. Alternatively, you might have created a new user during the PostgreSQL installation process.
Host: For local development, the host is typically localhost or 127.0.0.1, which refers to the local machine.
Database: You should know the name of the database you want to connect to. If you haven't created one yet, you can use the default postgres database or create a new one using a PostgreSQL administration tool.
Password: During the installation process, you might have set a password for the default postgres user or any other user you created. If you don't remember the password or didn't set one, you can try accessing the database without a password.
Hosting Providers:

User: Depending on your hosting provider, they may provide you with a specific username or allow you to create a new database user.
Host: Hosting providers usually provide a hostname or IP address associated with your PostgreSQL database.
Database: You need to know the name of the database provided by your hosting service.
Password: When setting up your database, you might have been prompted to create a password for the user associated with the database.
*/

//Multer storage configuration
const storage = multer.memoryStorage()
const upload = multer({ storage })
// const storage = multer.memoryStorage() creates a new storage engine. memoryStorage engine stores the uploaded file in memory as a 'Buffer' object rather than saving it to disk. It is suitable for smaller files or scenarios where you don't want to persist the uploaded file.

//Express route for file upload
app.post('/upload', upload.single('image'), (req, res) => {
    const { originalname, buffer } = req.file
    
    // Save the file to the database
pool.query('INSERT INTO images (name, data) VALUES ($1, $2)', [originalname, buffer], (error, result) => {
    if(error) {
        console.error('Error saving image to database', error)
        res.status(500).send('Error saving image to database')
    } else {
        res.send('Image uploaded successfully!')
    }
})
})

//app.post('/upload'....) defines a POST route for the /upload URL path

//upload.single('image') This part is middleware provided by multr. It is used to handle a single upload with the field name 'image'. If the request contains multi files or the field name does not match then 'multr' will rise an error.

// originalname is the name of the uploaded file as specified by the client.

//buffer contains the binary data of the uploaded file stored in memory (if using multer.memoryStorage() as the storage engine)

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

