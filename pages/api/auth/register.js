import User from "../../../models/user";
import createHandler from "../../../mongoose/createHandler";
import { userType } from "../../../components/global";
import { absoluteUrl } from "../../../components/getAbsoluteUrl";
import { encrypt } from "../../../components/encryption";
var fs = require('fs');
import { sendEmail } from '../../../components/emailSend';

const handler = createHandler();

handler.post(async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.userType == userType.teacher) {
            User.findOne({ 'email': req.body.email, 'userType': req.body.userType }, function (err, user) {
                console.log("User: ", user);
                if (user) {
                    if (user.isEmailverified) {
                        res.json({ success: false, code: -2, message: 'Email is already registered with us.' });
                    } else {
                        if (user.userType == userType.teacher) {
                            res.json({ success: false, code: -1, message: 'Please verify your email.' });
                        } else {
                            res.json({ success: false, code: -2, message: 'Email is already registered with us.' });
                        }
                    }
                }
                else {
                    req.body.password = encrypt(req.body.password);
                    req.body.otp = Math.floor(1000 + Math.random() * 9000);
                    var newUser = new User(req.body);
                    newUser.save(function (err, userSaved) {
                        if (err) res.send(err);

                        //     send verification email logic write here
                        var verificationLink = "<a style='font-weight: 500;padding:10px 16px;text-decoration:none;color:#fff; border-radius: 6px;background-color: #59b4de;border-color: #46b8da;'  href = '"
                            + absoluteUrl(req).url + "?id="
                            + encrypt(userSaved._id + "") + "&vc="
                            + encrypt(req.body.otp + "") + "'>Click here to verify email</a>";

                        //Email send
                        var emailSubject = "Welcome to Yam";
                        var emailContent = fs.readFileSync('template/Confirmation.txt').toString();
                        emailContent = emailContent.replace("##url##", verificationLink);
                        sendEmail(req.body.email, emailSubject, emailContent);

                        res.status(200).send({ success: true, auth: true, user: userSaved, message: 'Signup successful.' });
                    });
                }
            });
        } else {
            res.status(200).send({ success: false, code: -4, message: 'Something went wrong! Please try again.' });
        }
    }
    catch (error) {
        res.status(200).send({ success: false, code: -4, message: 'Something went wrong! Please try again.' });
    }
});

export default (req, res) => handler.run(req, res);