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

//Express route for file upload
app.post('/upload', upload.single('image')), (req, res) => {
    const { originalname, buffer } = req.file
}