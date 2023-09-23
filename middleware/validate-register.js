const { isEmpty, isEqual, passwordStrengthChecker, emailValidator } = require("../utils/const")
const ValidationError = require('../exception/ValidateError')
const User = require("../model/user")
const ValidateRegister = async(req,res,next)=>{
    const {phoneNumber,country_code,
        firstname,middlename,lastname,
        email,dob,password,
        confirmPassword
    } = req.body 
    let errors = []
  
        if(isEmpty(phoneNumber)){
            errors.push("Phone number is required field");
        }
        if(isEmpty(country_code)){
            errors.push("Country code is required field");
        }
        if(isEmpty(firstname)){
            errors.push("First name is required field");
        }
        if(isEmpty(lastname)){
            errors.push("Last name is required field");
        }
        if(isEmpty(email)){
            errors.push("Email is required field");
        }else{
            if(!emailValidator(email)){
                errors.push("Invalid email address");
            }else{
                if(await User.findOne({email:email})){
                    errors.push("Email already exists");
                }
            }
        }
        if(isEmpty(dob)){
            errors.push("Date of birth is required field");
        }
        if(isEmpty(password)){
            errors.push("Password and confirmPassword is required field");
        }else{
            if(passwordStrengthChecker(password)!==2){
                errors.push("Please enter a strong password");
            }
        }
        if(!isEqual(password,confirmPassword)){
            errors.push("Password and confirmPassword must be matched");
        }
       
        if(await User.findOne({phoneNumber:phoneNumber})){
            errors.push("Phone number already exists");
        }
        
        if(errors.length>0){
            const message = {
                success:false,
                statusCode:422,
                errors:errors
            }
           next( new ValidationError(JSON.stringify(message)))
        }
        const user = {
            phoneNumber,country_code,firstname,middlename,
            lastname,email,dob,password,confirmPassword
        }
        req.user = user 
        next()

}
module.exports = ValidateRegister

