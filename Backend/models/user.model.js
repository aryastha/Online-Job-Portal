import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        role: {
            type: String,
            enum: ["Admin", "Employee", "Recruiter"],
            default: "Employee",
        },
        profile: {
            bio: {
                type: String,
                trim: true,
            },
            skills: [{
                type: String,
                trim: true
            }],
            resume: {
                type: String
            },
            resumeOriginalname: {
                type: String
            },
            profilePhoto: {
                type: String
            },
            company: {
                type: String,
                trim: true
            },
            position: {
                type: String,
                trim: true
            }
        },
        location: {
            type: String,
            trim: true,
        },
        experience: [{
            title: String,
            company: String,
            duration: String
        }],
        education: [{
            degree: String,
            institution: String,
            year: String
        }],
        profileImage: {
            public_id: String,
            url: String
        },
        socialLinks: {
            linkedin: String,
            twitter: String,
            portfolio: String
        },
        bookmarks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }],
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {timestamps: true}
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);

