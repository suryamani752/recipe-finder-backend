const jwt = require('jsonwebtoken');
const User = require('./userModel');

// authorize user using jwt
const authUser = async (req, res, next) => {
    try {
        // access the http header
        const userToken = req.headers['x-access-token'];

        // verify the token and secret inside header
        const decodedToken = jwt.verify(userToken, 'deliSecrets');

        // find the user in database that has the matching token inside the ID
        const user = await User.findOne({_id: decodedToken._id});
        
        // return error if the user can't be found
        if(!user){
            return res.status(404).json('Please authenticate');
        }

        // return user if the user is found
        req.user = user;

        // then proceed to the next command
        next();
    } catch (error) {

        // print the error message if user is not found
        console.log(error);
        res.status(500).send();
    }
}

module.exports = authUser;