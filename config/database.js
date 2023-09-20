const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/passportJS')

const userSchema = new mongoose.Schema({
    username : String,
    password : String 
})


const UserModel = mongoose.model("User" , userSchema);

module.exports  = UserModel;

