const mongoose=require("mongoose")
const Schema = mongoose.Schema;
const historySchema=Schema({
    userId:{type:String,required:true},
    dateTime:[{
        type:Date,
        default: Date.now()
        }],
        activity:[{
            name:{type:String,required:true},
            duration:{type:Number,required:true}
            }]
})