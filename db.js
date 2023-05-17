const { Pool } = require('pg');

// Create a new pool instance with the database connection details
const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432, // replace with your PostgreSQL port if different
});

module.exports = {
  uploadPhoto: (name, data) => {
    return new Promise((resolve, reject) => {
      // Execute the INSERT query to store the photo in the database
      pool.query('INSERT INTO photos (name, data) VALUES ($1, $2) RETURNING id', [name, data], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.rows[0].id);
        }
      });
    });
  },
}


