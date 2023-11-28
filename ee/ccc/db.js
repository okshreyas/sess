const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',         // Replace with your MySQL server host
    user: 'root',     // Replace with your MySQL username
    password: 'Swami@717', // Replace with your MySQL password
    database: 'emp', // Replace with your MySQL database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = db;
