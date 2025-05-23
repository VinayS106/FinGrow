import mongoose, { Connection } from "mongoose";
let config: Connection;
export function connectToDatabase(): Connection {
    try {
        config = mongoose.createConnection("mongodb://mongodb/fingrowDB");
        console.log("Connected");
    } catch (error: any) {
        throw new Error("Database connection failed: " + error.message);
    }
    return config;
}
config = connectToDatabase();
export {config}
