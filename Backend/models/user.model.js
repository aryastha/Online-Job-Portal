import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        fullname:{
            type: String,
            required: true ,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        phoneNumber:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
            minlength: 8,
        },
        role:{
            type:String,
            enum: ['Employee', 'Recruiter'],
            default: 'Employee',
            required: true,
        },
        profile:{
            bio:{
                type: String,
                default: '',
            },
            skills: [{type: String,}],
            resume:{
                type: String,
            },
            resumeOriginalname:{
                type: String,
            },
            company:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Company",
            },
            profilePhoto: {
                type: String,
                default: '',
            },
        },
    },
    {timestamps: true}
);

export const User = mongoose.model("User", userSchema);

