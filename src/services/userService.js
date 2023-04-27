import db from "../models/index";
import bcrypt from "bcryptjs"

const salt = bcrypt.genSaltSync(10)

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            
            if(isExist){
                userData.errCode = 0
                //nếu người dùng tồn tại
                //kiểm tra password của người dùng
                let user = await db.User.findOne({
                    // chỉ lấy từ database 5 cột này
                    attributes : ['email','password','roleId','firstName' , 'lastName'],
                    where : {email: email},
                    raw : true
                    // attributes : {
                    //     include : ['email', 'roleId','password'], //hiển thị những cột muốn show
                    //     // exclude : []   ->>>//những cột không muốn hiển thị
                    // }
                });
                if(user){
                    //check password trong database với password người dùng nhập vào
                    let check = bcrypt.compareSync(password,user.password)
                    if(check){
                        userData.errCode = 0;
                        userData.errMessage = "Success";
                        //sau khi so sánh password hợp lệ thì xóa đi cột password
                        delete user.password;
                        userData.user = user;
                    }
                    else{
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                }
                else{
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`
                }
            }
            else {
                userData.errCode = 1;
                userData.errMessage = `Your email isn't exist. Please enter other email !`
             
            }
            resolve(userData)
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise( async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where : {email : userEmail}
            })

            if(user) {
                resolve(true);
            }
            else{
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = "";
            if(userId == "ALL"){
                users = await db.User.findAll({
                    attributes : {
                        exclude : ["password"]
                    },
                    
                });
                resolve(users)
            };
            if(userId && userId !== "ALL"){
                users = await db.User.findOne({
                    attributes :{
                        exclude : ["password"]
                    },
                    where : {id : userId},
                   
                })
                if(!users){
                    users = "Invalid user ID"
                }
                resolve(users)
            }

           
        
           
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) =>{
    return new Promise(async (resolve, reject) => {
        try {
            //check email đã tồn tại chưa
            let checkEmail = await checkUserEmail(data.email);
            if(checkEmail){
                resolve({
                    errCode : 1,
                    errMessage : "(*)Email is already in used."
                })
            }
            else{
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber : data.phoneNumber,
                    gender : data.gender === '1'?true : false,
                    roleId : data.roleId,
                    
                })
                let allUsers = await db.User.findAll();
                resolve({
                    errCode : 0,
                    errMessage: "Created new user successfully",
                    allUsers
                });
            }

           
        } catch (e) {
            reject(e)
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise( async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password,salt)
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }

    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await db.sequelize.query(
                `DELETE FROM Users WHERE id = ${userId}`
            );
            console.log(result);
            if(result[0].affectedRows === 0) {
                resolve({
                    errCode : 2,
                    errMessage : "The user isn't exist"
                })
            }else{
                 
                let allUsers = await db.User.findAll();
                resolve({
                    errCode: 0,
                    errMessage : "Delete user successfully",
                    allUsers
                });
    
            }
           
               
        } catch (e) {
            reject(e)
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await db.User.update(
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address
                },
                {
                    where: { id: data.id }
                }
            );
               
            if(result[0] === 0){
                resolve({
                    errCode: 2,
                    errMessage: "Invalid User",
                })

            }
               
                let  allUsers = await db.User.findAll();
                resolve({
                    errCode: 0,
                    errMessage: "Updated user successfully!",
                    allUsers 
                });
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!typeInput) {
                resolve({
                    errCode:1,
                    errMessage: 'Missing required parameters!'
                })
            }else{
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where : {type : typeInput}
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
           
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin : handleUserLogin,
    getAllUsers :  getAllUsers,
    createNewUser : createNewUser,
    deleteUser : deleteUser,
    editUser : editUser,
    getAllCodeService : getAllCodeService
}