import mongoose from "mongoose"

const dbConnect = async()=>{
    try {
        const connectDB = mongoose.connect(process.env.MONGO_URL)
        connectDB && console.log("DB connected")

    } catch (error) {
        console.log(error)
    }
}

export default dbConnect