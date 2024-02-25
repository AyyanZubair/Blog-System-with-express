import { connectDB } from "./db/dbConnection.js";
import { app } from "./app.js"
import dotenv from "dotenv";

dotenv.config();

connectDB().then(() => {
    app.listen(process.env.PORT || 7000, () => {
        console.log(`server started!!`);
    })
})
    .catch((error) => {
        console.log("Mongo DB connection failed!", error);
    })


