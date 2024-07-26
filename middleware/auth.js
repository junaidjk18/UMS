const isLogin = async(req,res,next)=>{
    try {
        if(req.session.user_id){

          return  next()
        }
        else
        {
            res.redirect('/')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async(req,res,next)=>{
    try {
        if(req.session.user_id)
        {
            res.redirect('/home')
        } else if(req.session.admin_id){
            res.redirect('/admin/home')
        }
        else{

           return next()
        }
        
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    isLogin,
    isLogout
}