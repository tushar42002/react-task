const mongoose = require('mongoose');
const mongoUrl = "mongodb://localhost:27017/reacttask";

const connectToMongo = ()=>{
    mongoose.connect(mongoUrl, ()=>{
        console.log('mongodb connected successfully');
    })
}

module.exports = connectToMongo