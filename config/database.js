const mongoose=require("mongoose")
const databaseConnect=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology: true});
        console.log(`database connect successfully:${process.env.MONGO_URL} `)
    }catch(error){
        console.log('Database connection failed');
    }
}

module.exports=databaseConnect