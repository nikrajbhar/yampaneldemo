import User from "../../../models/user";
import createHandler from "../../../mongoose/createHandler";
import { decrypt } from "../../../components/encryption";

const handler = createHandler();

handler.post(async (req, res) => {
    try {
        if (req.body.uid != null && req.body.uvc != null) {
            var userId = decrypt(req.body.uid);
            var uvc = decrypt(req.body.uvc);
            User.findOne({ '_id': userId, 'otp': uvc }, { _id: 0, isEmailverified: 1 }, function (err, userVerified) {
                if (err) res.send(err);
                if (userVerified) {
                    if (userVerified.isEmailverified == true) {
                        res.status(200).send({ success: false, code: 2 });
                    }
                    else {
                        User.updateOne({ _id: userId }, { $set: { 'isEmailverified': true } }, function (err, count) {
                            if (err) res.status(200).send({ success: false, code: -1 });
                            res.status(200).send({ success: true, code: 1 });
                        });
                    }
                }
                else {
                    res.status(200).send({ success: false, code: -1 });
                }
            });
        }
        else {
            res.status(200).send({ success: false, code: 0 });
        }
    } catch (error) {
        res.status(200).send({ success: false, code: 0 });
    }
});

export default (req, res) => handler.run(req, res);