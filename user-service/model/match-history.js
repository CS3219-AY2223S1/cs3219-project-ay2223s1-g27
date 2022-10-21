import mongoose from 'mongoose';
var Schema = mongoose.Schema
export let MatchHistorySchema = new Schema({
    room_id: {
        type: String,
        required: true,
    },
    difficulty_level: {
        type: String,
        required: true,
    },
    users: [{
        type: String,
        required: true,
    }],
    usernames: [{
        type: String,
        required: false,
    }],
}, { timestamps: true })

export default mongoose.model('MatchHistoryModel', MatchHistorySchema)
