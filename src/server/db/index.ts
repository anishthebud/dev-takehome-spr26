import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not provided");
}

export default async function dbConnect() {
    let conn;
    try {
        conn = mongoose.connect(MONGODB_URI!);
    } catch (e) {
        throw e;
    }
    return conn;
}

const itemSchema = new mongoose.Schema({
    requestorName: String,
    itemRequested: String,
    createdDate: Date,
    lastEditedDate: Date,
    status: String,
})

export const Item =
    mongoose.models.Item || mongoose.model('Item', itemSchema, 'requests');
