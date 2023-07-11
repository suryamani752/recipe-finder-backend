// set user schema
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    token: {
        type: String,
    },

    favorites: {
        type: [String]
    }
})

// encrypt user's password twice before saving the user's details to database
userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hashSync(user.password, 2);
    }
    
    next();
})

// to validate user
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Invalid Credentials');
    }
    const passwordMatch = await bcrypt.compareSync(password, user.password);
    if(!passwordMatch){
        throw new Error('Invalid Credentials');
    }
    return user;
}

// to assign token to user's id and make it expire in 24 hours
userSchema.methods.generateToken = async function (){
    const user = this;
    const token = await jwt.sign({_id: user._id}, "deliSecrets", {expiresIn: "24h"});
    user.token = token;
    await user.save();
    return token;
}

// to hide sensitive user's information
userSchema.methods.toJSON = function (){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject._id;
    return userObject;
}

// set the collection name and model into mongo db
const User = mongoose.model('users', userSchema);

// export this module
module.exports = User;