const mongoose =require('mongoose')
const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI)
.then(()=>console.log('MongoDB connected successfully'))
.catch((error)=>console.error('Mongo connection error',error));