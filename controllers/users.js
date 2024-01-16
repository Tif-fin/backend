const User = require("../model/user")
const { checkExistsAndDelete } = require("../utils/compress")
const { removeAttribute } = require("../utils/user.hide.secrete")
const userValidation = require("../validation/user/userValidation")
const userService = require("../services/userService")
const authValidation = require("../validation/authValidation")
const nameValidation = require("../validation/user/name.validation")
const { AuthenticationToken } = require("../middleware/authToken")
const DeleteUser = require("../model/delete_user")
class UserController {
    //create a new user 
    async createUser(req,res){
   try {
        //validate data
        let data = userValidation.validate(req.body)
        //create a new user 
        const newUser = await userService.createUser(data)
        return res.status(200).json({success:true,data:newUser})
        } catch (error) {
            
            res.status(400).json({status:false, error: error.message });
        }
    }
    //Authenticate user 
    async authUser(req,res){
        try {
            //validate data
            const data= authValidation.validate(req.body)
            //authenticate user
            const result = await userService.auth({...data})
            const expire_at =  new Date(Date.now() + 1000 * 60 * 60 * 24*2)
            const cookieOptions = {
                    expires:expire_at, 
                    httpOnly: true, // prevents JavaScript from accessing the cookie
                    secure:true,
                    sameSite: "none",
                }; 
                //set token in the cookie
                res.cookie('token',result.token,cookieOptions)
                res.setHeader('Access-Control-Allow-Credentials',true)
                res.status(200).json({success:true,data:{...result,expire_at}})
                res.end()
          
         } catch (error) {
            res.status(400).json({status:false, error: error.message });
         }
    }
    //edit user name
    async editName  (req,res){
        try {
            //validate name
            const data = nameValidation.validate(req.body)
            const {userId} = req.user 
            //update name
            await userService.updateById(data,userId)
            return res.status(200).json({success:true,message:"Updated name successfully"});
        } catch (error) {
            res.status(400).json({status:false, error: error.message });
        }
    }
    //edit profile 
       async editProfile (req,res,next){
            try {
                const {uploadedUrl} = req 
                const {userId} = req.user 
                //update 
                await userService.updateById({ profile:uploadedUrl[0]},userId)
                return res.status(200).json({success:true,data:{"profile":uploadedUrl[0]}})
            } catch (error) {
                //delete the uploaded image if and only if the image exists
                checkExistsAndDelete(uploadedUrl[0])
                res.status(400).json({status:false, error: error.message });
            }
        }

        async sendVerificationCode (req,res,next){
            const {email} = req 
            try {
                const user =await User.findOne({email});
                const result=  await passwordResetService(true,user)
                return res.status(200).json({
                    success:result,
                    message:result?'Verification code is sent':'Failed to sent verification code'
                })
            } catch (error) {
                next(error)
            }
        }
        //get current user 
      async  getCurrentUser (req,res,next){
            const {userId} = req.user 
            try {
                let user=await userService.getById(userId);
                user = removeAttribute(Array.of(user),['password','__v','created_date'])
                return res.status(200).json({success:true,data:user[0]})
            } catch (error) {
                res.status(400).json({status:false, error: error.message });
            }
        }
        //get all the registered user 
        async getUsers  (req,res,next){
            try {
                let  users =await userService.getUsers();
                users = removeAttribute(users,['password','__v','created_date'])
                return res.status(200).json({success:true,data:users})
            } catch (error) {
                res.status(400).json({status:false, error: error.message });
            }
        }
        async getUserById  (req,res,next){
            const {userId} = req.params    
            req.user = {userId}
            this.getCurrentUser(req,res,next)
        }
        async requestForVerifiedUser(req,res){
            const {userId} = req.user;
            const {fspId,credit} = req.body; 
            try {
                let result=await userService.requestForVerifiedUser({userId,credit,fspId});
                //console.log(result);
                return res.status(200).json({success:true,data:result})
            } catch (error) {
                res.status(400).json({status:false, error: error.message });
            }
        }
        async deleteAuthUser(req,res){
            try {
                //validate data
                const data= authValidation.validate(req.body)
                //authenticate user
                const result = await userService.auth({...data})
                const expire_at =  new Date(Date.now() + 1000 * 60 * 60 * 24*2)
                const cookieOptions = {
                        expires:expire_at, 
                        httpOnly: true, // prevents JavaScript from accessing the cookie
                        // secure:secure || req.headers['x-forwarded-proto'] === 'https',
                        // sameSite: "none",
                    }; 
                    //set token in the cookie
                    res.cookie('token',result.token,cookieOptions)
                    res.setHeader('Access-Control-Allow-Credentials',true)
                    res.redirect("/user/delete?status=success")
                    res.end()
              
             } catch (error) {
                res.send(`<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <title>Login Failed</title>
                <style>
                  /* Basic styling for demonstration purposes */
                  body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
                  .error-message { color: red; font-size: 18px; margin-bottom: 20px; }
                  .back-link { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; }
                  .back-link:hover { background-color: #0056b3; }
                </style>
                </head>
                <body>
                
                <h2>Login Failed</h2>
                <p class="error-message">Invalid credentials. Please try again.</p>
                <a href="/user/delete" class="back-link">Back to Login</a>
                
                </body>
                </html>
                `)
             }
        }
        async deleteAccountAndAssociatedData(req,res){
            const token = req.cookies['token'];
            if(token){
                AuthenticationToken(req,res,()=>{})
               const {email,userId} = req.user;
                return res.send(`<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <title>Account Deletion Request</title>
                <style>
                  body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f8f9fa;
                    color: #333;
                    line-height: 1.6;
                    padding: 50px 20px;
                    text-align: center;
                  }
                
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                
                  h2, h3 {
                    margin-bottom: 20px;
                  }
                
                  .delete-link {
                    display: inline-block;
                    padding: 15px 30px;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 25px;
                    font-size: 18px;
                    transition: background-color 0.3s;
                  }
                
                  .delete-link:hover {
                    background-color: #0056b3;
                  }
                
                  .note {
                    font-size: 16px;
                    color: #777;
                    margin-top: 30px;
                  }
                </style>
                </head>
                <body>
                
                <div class="container">
                  <h2>Request for Account Deletion</h2>
                  <h3>Email: ${email}</h3>
                  <h3>User ID: ${userId}</h3>
                  <p>We understand your decision. If you're certain about deleting your account, kindly proceed by clicking the button below. Please remember that you have a 30-day window to confirm your decision.</p>
                  <form action="/user/delete/request" method="post">
                    <input type="submit" value="Initiate Account Deletion" class="delete-link">
                  </form>
                  <div class="note">
                    <p><strong>Note:</strong> Should you choose to log in within the 30-day period, the scheduled deletion process will be automatically halted.</p>
                  </div>
                </div>
                
                </body>
                </html>
                `)
            }


            res.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <title>Tiffin Service - Login</title>
            <style>
              /* Styling for the login form */
              body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
              }
            
              .login-container {
                background-color: #fff;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                width: 320px;
              }
            
              .login-container h2 {
                text-align: center;
                margin-bottom: 20px;
                color: #333;
              }
            
              .form-group {
                margin-bottom: 20px;
              }
            
              .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #555;
              }
            
              .form-group input[type="text"],
              .form-group input[type="password"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                font-size: 16px;
              }
            
              .form-group input[type="submit"] {
                width: 100%;
                padding: 12px;
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s;
              }
            
              .form-group input[type="submit"]:hover {
                background-color: #0056b3;
              }
            </style>
            </head>
            <body>
            
            <div class="login-container">
              <h2>Welcome to Tiffin Service</h2>
              <form action="/user/delete/auth/" method="post">
                <div class="form-group">
                  <label for="email">Email Address:</label>
                  <input type="text" id="email" name="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                  <label for="password">Password:</label>
                  <input type="password" id="password" name="password" placeholder="Enter your password" required>
                </div>
                <div class="form-group">
                  <input type="submit" value="Login">
                </div>
              </form>
            </div>
            
            </body>
            </html>
            `)
        }
        async deleteAccountRequest(req,res){
            const token = req.cookies['token'];
            if(token){
                 try {
                    AuthenticationToken(req,res,()=>{})
                    const {userId} = req.user;
                    const result = DeleteUser({userId}).save()
                    if(!result){
                        throw new Error("Failed")
                    }
                    res.send(`<!DOCTYPE html>
                    <html lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <title>Account Deletion Scheduled</title>
                    <style>
                      /* Basic styling for demonstration purposes */
                      body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
                      .confirmation-container { max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9; }
                      .confirmation-message { font-size: 18px; color: #007bff; margin-bottom: 20px; }
                    </style>
                    </head>
                    <body>
                    
                    <div class="confirmation-container">
                      <h2>Account Deletion Scheduled</h2>
                      <p class="confirmation-message">Your account has been successfully scheduled for deletion.</p>
                    </div>
                    
                    </body>
                    </html>
                    `)
                 } catch (error) {
                    res.send(`<!DOCTYPE html>
                    <html lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <title>Failed to Delete Account</title>
                    <style>
                      /* Basic styling for demonstration purposes */
                      body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
                      .error-container { max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9; }
                      .error-message { font-size: 18px; color: #ff0000; margin-bottom: 20px; }
                      .home-link { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; }
                      .home-link:hover { background-color: #0056b3; }
                    </style>
                    </head>
                    <body>
                    
                    <div class="error-container">
                      <h2>Failed to Delete Account</h2>
                      <p class="error-message">Sorry, we encountered an error while trying to delete your account.</p>
                      <p>Please try again later or contact support for assistance.</p>
                      <a href="/user/delete" class="home-link">Go to Home</a>
                    </div>
                    
                    </body>
                    </html>
                    `)
                 }   
            }else{
                res.send(`<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <title>Unauthorized Access</title>
                <style>
                  /* Basic styling for demonstration purposes */
                  body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
                  .unauthorized-container { max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9; }
                  .error-message { font-size: 18px; color: #ff0000; margin-bottom: 20px; }
                  .home-link { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; }
                  .home-link:hover { background-color: #0056b3; }
                </style>
                </head>
                <body>
                
                <div class="unauthorized-container">
                  <h2>Unauthorized Access</h2>
                  <p class="error-message">You do not have permission to delete this account.</p>
                  <p>Please ensure you have the necessary authorization and credentials to perform this action.</p>
                  <a href="/user/delete" class="home-link">Go to Home</a>
                </div>
                
                </body>
                </html>
                `)
            }
        }


}

module.exports = new UserController();









