import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class UserController {

    static registerUser = async (req, res) => {
        const { email } = req.body;
        const { cpf } = req.body;
        try{
            if (await User.findOne({ email }))
                return res.status(400).send("This email has already used");

            if (await User.findOne({ cpf }))
                return res.status(400).send("This cpf has already used");

            const user = await User.create(req.body);

            user.password = undefined;

            return res.status(201).send(user.toJSON());
        } catch (err) {
            return res.status(400).send({message: `${err.message} - Registration fail.`});
        }

    }

    static userAuth = async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user)
            return res.status(400).send({error: 'The email or password is incorrect'});

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({error: 'The email or password is incorrect'});

        user.password = undefined;

        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
            expiresIn: 86400,
        });

        res.send({ user, token });
    }

    static userUpdate = async (req, res) => {
        const { email } = req.body;
        
    }

}


export default UserController;