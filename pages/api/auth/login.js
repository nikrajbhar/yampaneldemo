import User from "../../../models/user";
import createHandler from "../../../mongoose/createHandler";
import { secretKey, sessionExpiresInSeconds, userType } from "../../../components/global";
import { decrypt } from "../../../components/encryption";
import jwt from 'jsonwebtoken';

const handler = createHandler();

handler.post(async (req, res) => {
    try {
        if (req.body.userType == userType.teacher) {
            let user = await User.findOne({ 'email': req.body.email, 'userType': userType.teacher });
            if (user) {
                if (user && decrypt(user.password) == req.body.password) {
                    if (user.isEmailverified) {
                        var token = jwt.sign({ id: user._id }, secretKey, { expiresIn: sessionExpiresInSeconds });
                        user.password = undefined;
                        res.status(200).send({ success: true, auth: true, token: token, user: user, message: 'Login successful.' });
                    }
                    else {
                        res.status(200).send({ success: false, code: -1, message: 'Please verify your email' });
                    }
                }
                else {
                    res.status(200).send({ success: false, code: -2, message: 'Invalid Password' });
                }
            }
            else {
                res.status(200).send({ success: false, code: -3, message: 'Invalid Email' });
            }
        } else {
            res.status(200).send({ success: false, code: -3, message: 'Invalid Email' });
        }
    }
    catch (error) {
        res.status(200).send({ success: false, code: -4, message: 'Something went wrong! Please try again.' });
    }
});

export default (req, res) => handler.run(req, res);