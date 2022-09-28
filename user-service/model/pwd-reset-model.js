import mongoose from 'mongoose';
var Schema = mongoose.Schema
export let PwdResetSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
})

export default mongoose.model('PwdResetModel', PwdResetSchema)