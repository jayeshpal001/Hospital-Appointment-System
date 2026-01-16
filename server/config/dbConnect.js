const mongoose = require("mongoose"); 

const dbConnect = async()=>{
    try {
        const db = await mongoose.connect("mongodb://localhost:27017/roleDb"); 
        console.log(`Db connect successfully at : ${db.connection.host}`);
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = dbConnect; 