const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "users",
});

con.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("mysql connected");
  }
});

// con.query("Select * from student", (error, result) => {
//   console.warn(result);
// });
module.exports = con;
