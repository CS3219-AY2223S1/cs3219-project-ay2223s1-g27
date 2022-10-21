import mongoose from 'mongoose';
var Schema = mongoose.Schema
export let MessageHistorySchema = new Schema({
    room_id: {
        type: String,
        required: true,
    },
    messages: [{
        text: {
            type: String,
            required: false,
        },
        username: {
            type: String,
            required: false,
        },
        socketID: {
            type: String,
            required: false,
        },
        id: {
            type: String,
            required: false,
        },
    }]
}, { timestamps: true })

export default mongoose.model('MessageHistoryModel', MessageHistorySchema)
