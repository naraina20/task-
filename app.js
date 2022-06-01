const express = require('express')
// const errormiddleware = require('./middleware/error')
// const cookieparser = require("cookie-parser")

const app = express();

app.use(express.json());
// app.use(cookieparser());

//middleware
// app.use(errormiddleware);


//routes import
// const product = require("./routes/productroute");
// const user = require("./routes/userroute");
// const order = require("./routes/orderroute");

// app.use('/api/v1', product);
// app.use('/api/v1', user);
// app.use('/api/v1', order);


module.exports = app;