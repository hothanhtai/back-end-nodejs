import bcypt from "bcryptjs"
import db from "../models/index"

const salt = bcypt.genSaltSync(10)
 
let createNewUser = async (data) => {
    return new Promise( async (resolve,reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstname,
                lastName: data.lastname,
                address: data.address,
                phoneNumber : data.phonenumber,
                gender : data.gender === '1'?true : false,
                roleId : data.roleId,
                
            })

            let allUsers = await db.User.findAll();
            resolve(allUsers);
        } catch (e) {
            reject(e);
        }
    })
 
}


let hashUserPassword = (password) => {
    return new Promise( async (resolve, reject) => {
        try {
            var hashPassword = await bcypt.hashSync(password,salt)
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }

    })
}

let getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw : true,
            });
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}
 
let getUserInfoById = (userId) => {
    return new Promise (async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id : userId},
                raw: true
            })

            if(user){
                resolve(user)
            }
            else{
                resolve([])
            }

        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
           
            let result = await db.User.update(
                {
                    firstName: data.firstname,
                    lastName: data.lastname,
                    address: data.address
                },
                {
                    where: { id: data.id }
                }
            );
               
                let  allUsers = await db.User.findAll();
                resolve(allUsers);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUserById = (id) =>{
    return new Promise(async (resolve, reject) => {
        try {
            let result = await db.sequelize.query(
                `DELETE FROM Users WHERE id = ${id}`
            );

            
            let allUsers = await db.User.findAll();
            resolve(allUsers);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser :createNewUser,
    getAllUser : getAllUser,
    getUserInfoById : getUserInfoById,
    updateUserData : updateUserData,
    deleteUserById : deleteUserById
}