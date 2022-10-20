import mongoose from 'mongoose';
var Schema = mongoose.Schema
export let QuestionHistorySchema = new Schema({
    room_id: {
        type: String,
        required: true,
    },
    questions: [{
        titleSlug: {
            type: String,
            required: true,
        },
        codeSegment: {
            type: String,
            required: false,
        }
    }],
})

export default mongoose.model('QuestionHistoryModel', QuestionHistorySchema)
