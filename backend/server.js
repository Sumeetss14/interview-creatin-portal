const express = require("express");
const connection = require("./database");
const interviewRouter = require("./routers/interviewRouter");
const userRouter = require("./routers/userRouter");

//Important variables
const port = 8080;
const app = express();

app.use(express.json());

app.use("/interview", interviewRouter)
app.use("/user", userRouter)

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.listen(port, () => {
    console.log("Sever is running.")
})