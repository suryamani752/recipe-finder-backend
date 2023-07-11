const mongoose = require('mongoose');
const db = process.env.MONGODB_URI;

// connect to mongo db
mongoose.connect(db)
.then(() => {console.log('Connected to Database')})
.catch(error => console.log(error))