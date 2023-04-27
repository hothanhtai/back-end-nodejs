import express from "express";

let configViewEngine = (app) => {

    //đoạn code này thiết lập thư mục tĩnh (static folder) để chứa các file tĩnh như hình ảnh, tệp css, tệp js,...
    // Với đoạn mã trên, thư mục chứa các tệp tĩnh là ./src/public.
    app.use(express.static("./src/public"));

    //đoạn code này thiết lập view engine sử dụng là EJS (Embedded JavaScript), 
    //cho phép tạo các trang HTML động bằng cách sử dụng các template EJS.
    app.set("view engine", "ejs");

    //đoạn code này thiết lập đường dẫn đến thư mục chứa các file view của ứng dụng là ./src/views. 
    //Điều này cho phép Express biết được chỗ nào để tìm các file view của ứng dụng để render ra các trang web động.
    app.set("views", "./src/views");

}

module.exports = configViewEngine;