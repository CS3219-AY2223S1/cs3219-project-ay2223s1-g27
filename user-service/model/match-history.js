import mongoose from 'mongoose';
var Schema = mongoose.Schema
export let MatchHistorySchema = new Schema({
    room_id: {
        type: String,
        required: true,
    },
    users: [{
        type: String,
        required: true,
    }]
})

export default mongoose.model('MatchHistoryModel', MatchHistorySchema)
