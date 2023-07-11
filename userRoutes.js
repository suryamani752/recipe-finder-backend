const router = require('express').Router();
const User = require('./userModel');
const authUser = require('./authUser');

// sign user up 
router.post('/signup', async (req, res) => {
    try {
        const user = await User.create(req.body);
        await user.generateToken();
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})

// log user in
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body);
    try {
        const user = await User.findByCredentials(email, password);
        await user.generateToken();
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})

// automatically authenticate and log user in 
router.post('/auto-login', authUser, async(req, res) => {
    res.send(req.user);
})

// authenticate and log user out
router.post('/logout', authUser, async(req, res) => {
    const user = req.user;
    user.token = '';
    await user.save();
    res.status(200).send()
})

// authenticate user and add user's meal to favorites
router.post('/add-favorites', authUser, async(req, res) => {
    const {mealId} = req.body;
    const user = req.user;
    user.favorites.push(mealId);
    await user.save();
    res.status(200).send(user);
})

// authenticate user and remove user's meal from favorites
router.post('/remove-favorites', authUser, async(req, res) => {
    const {mealId} = req.body;
    const user = req.user;
    user.favorites = user.favorites.filter(id => id !== mealId);
    await user.save();
    res.status(200).send(user);
})

// exporting this module
module.exports = router;