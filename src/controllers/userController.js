import userService from "../services/userService"

let handleLogin =async (req, res) => {
    let email = req.body.email;
    let password = req.body.password; 

    if(!email || !password){
        return res.status(500).json({
            errCode : 1,
            message : "Missing inputs parameter!"
        })
    }

    let userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
       errCode : userData.errCode,
       message : userData.errMessage,
       user  : userData.user? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;//all, id
    let users = await userService.getAllUsers(id);
    if(!id){
        return res.status(200).json({
            errCode : 1,
            errMessage : "ID not found!",
            users:[],
        })
    }
    console.log(users);
    return res.status(200).json({
        errCode : 0,
        errMessage : "Ok",
        users,
    })
} 

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)
    console.log(message)
    return res.status(200).json({
        message
    })
}

let handleEditUser = async (req, res) => {
    let data = req.body;

    if(!data.id){
        return res.status(200).json({
            errCode : 1,
            message : "Missing required parameter!"
        })
    }
    let message = await userService.editUser(data)
    return res.status(200).json({
        message
    })
}

let handleDeleteUser =async (req, res) => {
    let id =  req.body.id;
    if(!id){
        return res.status(200).json({
            errCode : 1,
            message : "Missing required parameter!"
        })
    }
    let message = await userService.deleteUser(id);
    return res.status(200).json({
        message
    })
}

let getAllCode = async (req, res) => {
    try {

        setTimeout( async () => {
            let data = await userService.getAllCodeService(req.query.type);
            return res.status(200).json({
                data
            })

        }, 5000)
        
    } catch (e) {
        console.log('Get all code error: ',e)
        return res.status(200).json({   
            errCode : -1,
            errMessage : 'Error from server'
        })
    }
}

module.exports = {
    handleLogin : handleLogin,
    handleGetAllUsers : handleGetAllUsers,
    handleCreateNewUser : handleCreateNewUser,
    handleEditUser : handleEditUser,
    handleDeleteUser : handleDeleteUser,
    getAllCode : getAllCode

}