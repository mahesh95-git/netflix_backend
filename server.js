const app=require("./app")  
const database=require("./config/database")

database()
app.listen(process.env.PORT,()=>{
    console.log('Server is running on port 8080')
})