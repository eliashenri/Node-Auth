import mongoose from "mongoose";
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true
    },
    cpf: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpire: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash

    next()
})

const User = mongoose.model("User", UserSchema)

export default User;