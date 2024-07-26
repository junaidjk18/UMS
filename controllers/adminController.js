const User = require ('../models/userModel')
const bcrypt = require ('bcrypt')

const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash 
    } catch (error) {
        console.log(error.message);
        
    }
} 

const loadLogin = async(req,res)=>{
    try {
        
        res.render('login')
        
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try {
        const email = req.body.email
        const password=req.body.password


      const userData = await User.findOne({email:email})
      if(userData)
      {
        const passwordMatch = await bcrypt.compare(password,userData.password)
        if(passwordMatch)
        {
          if(userData.is_admin===0)
          {
            res.render('login',{message:'email and password is incorrect'})
          }
          else
          {
            req.session.admin_id = userData._id
            res.redirect('/admin/home')
          }
        } 
        else
        {
            res.render('login',{message:'password is incorrect'})
        }
      }
      else
      {
        res.render('login',{message:'email and password is incorrect'})
      }
    } catch (error) {
        console.log(error.message);
    }
}
const loadDashboard = async(req,res)=>{
    try {
        const userData =await User.findById({_id:req.session.admin_id})
        console.log("user data : ",userData);
        res.render('home',{admin:userData})
    } catch (error) {
        console.log(error.message);
    }
}
const logout = async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/admin')

    } catch (error) {
        console.log(error.message);
    }
}
const adminDashboard = async(req,res)=>{
    try {
       
        var search = '';
        if(req.query.Search)
        {
            search = req.query.Search
        }
        const usersData = await User.find({
            is_admin:0,
            $or:[
                {name:{ $regex: search , $options:'i' }},
                {email:{ $regex: search , $options:'i'} }
            ]
        })
        res.render('dashboard', { users:usersData, search, });
    } catch (error) {
        console.log(error.message);
    }
}
const newUserLoad = async(req,res)=>{
    try {
        const emailExist = req.session.emailExist;
        req.session.emailExist = undefined;
        res.render('new-user',{emailExistError: emailExist})
    } catch (error) {
        console.log(error.message);
    }
}
const addUser = async(req,res)=>{
    try {

        const emailExist = await User.findOne({email: req.body.email})
        console.log(emailExist);

        if(emailExist){
            req.session.emailExist = "Email already exist";
            return res.redirect('/admin/new-user');
        }
        const name = req.body.name
        const email = req.body.email
        const password=req.body.password

        const spassword = await securePassword(password)

        const user = new User({
            name:name,
            email:email,
            password:spassword,
            is_admin: 0
        })
           const userData = await user.save()

           if(userData)
           {
             res.redirect('/admin/dashboard')
           }
           else
           {
             res.render('new-user',{message:'something wrong'})
           }

    } catch (error) {
        console.log(error.message);
    }
}
const editUserLoad = async(req,res)=>{
    try {


        const massage = req.query.massage
        const msg = massage == '1' ? massage : 0; 

        const id = req.query.id
        const userData = await User.findById({_id:id})

      

        if(userData)
        {
         res.render('edit-user',{ user:userData, msg})
        }
        else
        {
           res.render('/admin/dashboard') 
        }
        
    } catch (error) {
        console.log(error.message);
    }
}
const updateUsers = async(req,res)=>{
    try {
        console.log('data')
            const isUser = await User.findOne({email: req.body.email});
            
            
            if(isUser?.email == req.body.email && isUser._id != req.body.id) {
                return res.redirect(`/admin/edit-user?massage=1&id=${req.body.id}`);
            }
            const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,is_varified:req.body.verify}})
            if(userData)
            {
            res.redirect('/admin/dashboard')
            }
        
      
    } catch (error) {
        console.log(error);
    }
}
const deleteUser = async(req,res)=>{
    try {
        const id = req.query.id

        

        const userData = await User.deleteOne({_id:id})
        if(userData)
        {
        res.redirect('/admin/dashboard')
        }
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser

}