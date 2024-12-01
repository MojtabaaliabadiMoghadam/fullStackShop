const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // رمز عبور دیتابیس شما
    database: 'shop_db' // نام دیتابیس شما
});

// تست اتصال
db.connect((err) => {
    if (err) {
        console.error('failed to connect data base:', err.message);
        return;
    }
    console.log('successfully connected to data base.');
});

module.exports = db;
