// const express = require("express");
// const con = require("./config");

// const app = express();
// const cors = require("cors");

// app.use(cors());

// app.use(express.json());

// app.get("/getALL", (req, res) => {
//   con.query("select * from hostel", (error, result, fields) => {
//     if (error) {
//       res.send("error");
//     } else {
//       res.send(result);
//     }
//   });
// });

// app.get("/getALL/:id", (req, res) => {
//   const data = req.params.id;
//   con.query("select * from hostel where id=?", (error, result, fields) => {
//     if (error) error;
//     res.send(data);
//   });
// });
// app.post("/insert", (req, res) => {
//   const data = {
//     name: "Rajkumar",
//     email: "rajkumar@sample.com",
//     password: "cvcsb6767dbb7dh8hd",
//   };
//   con.query("INSERT INTO student SET?", data, (error, result, fields) => {
//     if (error) error;
//     res.send(data);
//   });
// });

// app.post("/insert", (req, res) => {
//   const data = req.body;
//   con.query("INSERT INTO student SET ?", data, (error, result, fields) => {
//     if (error) error;
//     res.send(data);
//   });
// });

// app.put("/update", (req, res) => {
//   const data = ["motilal", "motilal@example.com", "e3nnddndndndde333e3e", 72];
//   con.query(
//     "UPDATE student  SET name=?,email=?, password=? where id=?",
//     data,
//
//   // res.send("update is done");
// });   (error, result, fields) => {
//       if (error) error;
//       res.send(result);
//     }
//   );

// app.put("/update/:id", (req, res) => {
//   const data = [
//     req.body.name,
//     req.body.email,
//     req.body.password,
//     req.params.id,
//   ];
//   con.query(
//     "UPDATE student  SET name=?,email=?, password=? where id=?",
//     data,
//     (error, result, fields) => {
//       if (error) error;
//       res.send(data);
//     }
//   );
//   // res.send("update is done");
// });

// app.delete("/:id", (req, res) => {
//   con.query(
//     "DELETE FROM student WHERE id=" + req.params.id,
//     (error, result, fields) => {
//       if (error) error;
//       res.send(result);
//     }
//   );
// });

// app.listen(1600, () => {
//   console.log("server is run on 1600");
// });
