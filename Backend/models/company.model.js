import mongoose from 'mongoose';
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    website:{
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    logo:{
        type: String,//url for logo
        required: true
    },
    userId:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
},{
    timestamps: true
});

export const Company = mongoose.model("Company", companySchema);