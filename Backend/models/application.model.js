import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.SchemaType.Types.ObjrctId,
        ref:'job',
        required:true,
    },
    application:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'pending',
        required:true,
    },
    status:{
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
        required: true,
    }
},{
    timestamps: true,
});

export const Application = mongoose.model('Application',applicationSchema);