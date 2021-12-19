const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sumeetss14#14",
    database: "interview_app"
})

module.exports = connection;