import mongoose from "mongoose";

const categorySchemna = new  mongoose.Schema({
    name :{
        type : String,
        // required : true,
        // unique :true,
    },
    slug :{
        type : String,
        lowercase : true
    }
});

const category = mongoose.model('category' , categorySchemna)

export default category;