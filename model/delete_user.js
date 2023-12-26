const mongoose = require('mongoose');

const userDeleteSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },  
    timestamp:{
        type:Date,
        default:Date.now
    },
  
});





const DeleteUser = mongoose.model('delete_user', userDeleteSchema);

module.exports = DeleteUser;
