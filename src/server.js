import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connectDB from "./config/connectDB"
// import cors from "cors"
require('dotenv').config();

let app = express();

// app.use(cors({ origin : true }));

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//phân tích dữ liệu được gửi đến server từ client-side dưới dạng application/json 
//và thêm chúng vào đối tượng req.body trong các route handler.
app.use(bodyParser.json());

// nó sẽ phân tích các dữ liệu được gửi đến server từ client-side dưới dạng application/x-www-form-urlencoded
// và thêm chúng vào đối tượng req.body. 
// Tham số extended: true được truyền vào để cho phép phân tích các object lồng nhau.
app.use(bodyParser.urlencoded({ extended: true}));

//khai báo view
viewEngine(app);

//khai báo tất cả route
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 8001;

app.listen(port, () => {
    console.log("Server is running on the port: " + port);
});



