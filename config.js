const mysql = require("mysql2");
var db = mysql.createConnection({
  host: "db4free.net",
  user: "folarin",
  password: "Prince12",
  database: "folarin_feedback",
  port: 3306,
});

module.exports = { db };
