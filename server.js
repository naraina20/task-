const app = require("./app");
const connectmongodb = require('./database');


// process.on("uncaughtException", err => {
//   console.log(`Error: ${err.message}`);
//   console.log("shutting down server due to uncaught Exception");
//   process.exit(1);
// })


const bodyParser = require('express').json;
app.use(bodyParser());

const UserRouter = require('./singin')
app.use('/user', UserRouter)


//config
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

//connect database
connectmongodb();

app.listen(process.env.PORT, () => {
  console.log("server is started at http://localhost:8000");
});


// //unhandler promise rejection
// process.on("unhandledRejection", err => {
//   console.log(`Error : ${err.message}`);
//   console.log("shutting down server due to unhandled promise Rejection");

//   server.close(() => {
//     process.exit(1);
//   });
// });