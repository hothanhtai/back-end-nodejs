import { json } from "body-parser";
import db from "../models/index";
import CRUDservice from "../services/CRUDservice";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
  
        return res.render("homepage.ejs",{
            data: JSON.stringify(data)
        });
        
    } catch (error) {
        console.log(error)
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
   let getAllUser =  await CRUDservice.createNewUser(req.body);
    
    return res.render("display-crud",{
        data : getAllUser
    });
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    return res.render("display-crud.ejs",{
        data
    })
}

let getEditCRUD = async(req, res) => {
    let userId = req.query.id;
    if(userId){
        let userData = await CRUDservice.getUserInfoById(userId);
        return res.render('edit-crud.ejs',{
            userData
        })

    }
    else{
        res.send("User not found")

    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers =  await CRUDservice.updateUserData(data);
    return res.render("display-crud.ejs",{
        data : allUsers
    })
}

let deleteCRUD = async (req,res) => {
    let id = req.query.id;

    if(id){
        let allUsers = await CRUDservice.deleteUserById(id);
        return res.render("display-crud.ejs",{
            data : allUsers
        })
    }
    else{
        res.send("Not found!");
    }
}

module.exports = {
    getHomePage : getHomePage,
    getCRUD : getCRUD,
    postCRUD : postCRUD,
    displayGetCRUD : displayGetCRUD,
    getEditCRUD : getEditCRUD,
    putCRUD : putCRUD,
    deleteCRUD : deleteCRUD
}