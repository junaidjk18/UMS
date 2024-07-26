const user = require('../models/userModel')
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcrypt')
const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash 
    } catch (error) {
        console.log(error.message);
        
    }
} 

const loadRegister = async(req,res)=>{
    try{
        const emailExist = req.session.emailExist;
        req.session.emailExist = undefined; 
        const message = req.session.err;
        req.session.err = undefined;       
        res.render('Registration',{emailExistError: emailExist, message: message})
    }
    catch(error){
        console.log(error.message);
    }
}

//register post
const insertUser = async(req,res)=>{
    try{

        const emailExist = await user.findOne({email: req.body.email})
        console.log(emailExist);

        if(emailExist){
            req.session.emailExist = "Email already exist";
            return res.redirect('/register');
        }
        const spassword = await securePassword(req.body.password)
        const User = new user({
            name:req.body.name,
            email:req.body.email,
            password:spassword,
            is_admin:0

        })
           const userData = await User.save()

           if(userData){
            req.session.err = 'your registration is completed';
            res.redirect('login')
           }
           else{
            req.session.err = 'your registration is failed';
            res.redirect('registration')
           }

    }
    catch(error){
        console.log(error.message);
    }

}

const loginload = async(req,res)=>{
    try {
        const message = req.session.err;
        req.session.err = undefined; 
        
        res.render('login', {message: message})
   
    } catch (error) {
        console.log(error.message);
    }
}


//login post
const verifyLogin = async(req,res)=>{
    try {
        const newemail=req.body.email
        const password=req.body.password

        const userData =  await user.findOne({email:newemail, is_admin: 0})
        console.log(userData)
        if(userData){
           
            const passwordMatch = await  bcrypt.compare(password,userData.password)

            
            if(passwordMatch)
            {
                
                req.session.user_id = userData._id  
                
                res.redirect('/home')

            }
            else
            {
                req.session.err = "password is wrong";
                res.redirect('/login')

            }
        }
        else
        {
            req.session.err = "email doesn't exist";
            res.redirect('/login');
        }
            
    } catch (error) {
        console.log(error.message);
    }
}
const loadHome = async(req,res)=>{
    try {
        
        const userData = await user.findById({_id:req.session.user_id})
        
        res.render('home',{user:userData})
    } catch (error) {
        console.log(error.message);
        
    }
}

const userLogout = async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/')
        
    } catch (error) {
        console.log(error.message);
        
    }
}

// const editLoad = async(req,res)=>{
//     try {
    
//         const id = req.query.id
        
//         const userData = await user.findById({_id:id})
        
//         if(userData){
//             res.render('edit',{user:userData})
//         }
//         else
//         {
//             res.redirect('/home')
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }
// const updateProfile = async(req,res)=>{
//     try {
//         if(req.file)
//         {
//             const userData = await user.findByIdAndUpdate({_id:req.body.user_id},{$set :{name:req.body.name,email:req.body.email}})
//         }
//         else
//         {
//           const userData = await user.findByIdAndUpdate({_id:req.body.user_id},{$set :{name:req.body.name,email:req.body.email}})
//         }
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }


// // const exp = require ('express')
// const app= exp()

// app.listen(4000)




module.exports={
    loadRegister,
    insertUser,
    loginload,
    verifyLogin,
    loadHome,
    userLogout
}

