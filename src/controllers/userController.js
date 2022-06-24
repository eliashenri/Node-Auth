import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import mailer from "../modules/mailer.js"

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

    static forgotPassword = async (req, res) => {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email })

            if (!user)
                return res.status(400).send({error: 'User not found'})

            const token = crypto.randomBytes(20).toString('hex')

            const now = new Date()
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate(user.id, {
                '$set' : {
                    passwordResetToken: token,
                    passwordResetExpire: now,
                }
            });

          mailer.sendMail({
            to: email,
            from: 'elias.henrique.andrioli@gmail.com',
            template: 'auth/forgot_password',
            context: { token }
          });

          return res.send()
            
        } catch (err) {
            res.status(400).send({error: 'Error on forgot password '})
        }

    };

    static resetPassword = async (req, res) => {
        const { email, token, password } = req.body;

        try {
            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpire');

            if (!user)
                return res.status(400).send({error: 'User not found'});

            if (token !== user.passwordResetToken)
                return res.status(400).send({error: 'Token Invalid'});

            const now = new Date()

            if (now > user.passwordResetExpire)
                return res.status(400).send({error: 'Token Expired'}) ;

            user.password = password;

            await user.save();

            res.send()

        } catch (err) {
            res.status(400).send({error: 'Cannot reset password'})
        }
    }

}


export default UserController;