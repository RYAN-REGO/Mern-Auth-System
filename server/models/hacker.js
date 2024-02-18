import mongoose from "mongoose";

const hackerSchema = mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true},
    password : {type : String},
    id : {type : String},
    userPic : {type : String},
})

export default mongoose.model("hacker", hackerSchema);