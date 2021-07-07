import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import next from 'next';
import { dbConnectionString, secret } from '../components/global';
// step 1 : Connection
// step 2 : token check error no token provided
// step 3 : Verify not verified
// step 4 : Verify then fetch api

const databaseMiddleware = async (req, res, next) => {

    try {
        console.log("Original URL: ", req.url);
        if ((req.url + "").includes('/api/auth/')) {
            if (!global.mongoose) {
                global.mongoose = await mongoose.connect(dbConnectionString, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                });
            }
            return next();
        } else {
            var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
            if (token) {
                console.log(token);
                jwt.verify(token, secret, async function (err, decoded) {
                    if (err) {
                        res.status(403).send({ success: false, message: 'Failed to authenticate token' })
                    } else {
                        console.log("verified", decoded);
                        req.decoded = decoded;
                        if (!global.mongoose) {
                            global.mongoose = await mongoose.connect(dbConnectionString, {
                                useNewUrlParser: true,
                                useUnifiedTopology: true,
                                useFindAndModify: false,
                            });
                        }
                        return next();
                    }
                })

            } else {
                res.status(403).send({ success: false, message: 'Token not Provided' })
            }
        }


    } catch (ex) {
        console.error(ex);
    }



}






// let tokens = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjBjN2YzMzE3YzhkMDAxYTUxMzU1NiIsImlhdCI6MTYyNTIxNTAyMywiZXhwIjozMTcxNjk2NTc0MjN9.gTtvpSRqlKF_ZXjXd604-tqkdb2eRJ-CX9eKuBinpmM"
// var secret = 'yamappgoodappforstudent';

// if (tokens) {
//     jwt.verify(tokens, secret, function (err, decoded) {
//         if (err) {
//             // return res.json({ success: false, message: 'Failed to authenticate token' })
//             console.log("json error", err);
//         } else {

//             console.log("verified", decoded);
//         }
//     })

// } else {
//     return res.json({ success: false, message: 'No token provided' })
// }

// if (decoded) {

//  };
export default databaseMiddleware;

// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjBjN2YzMzE3YzhkMDAxYTUxMzU1NiIsImlhdCI6MTYyNTIxNTAyMywiZXhwIjozMTcxNjk2NTc0MjN9.gTtvpSRqlKF_ZXjXd604-tqkdb2eRJ-CX9eKuBinpmM'

// var token = jwt.sign({ id: savedUser._id }, config.secret, { expiresIn: "9999 years" });

// jwt.sign({ id: savedUser._id }, secret, { expiresIn: "9999 years" });

// const databaseMiddleware = async (req, res, next) => {
//     let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjBjN2YzMzE3YzhkMDAxYTUxMzU1NiIsImlhdCI6MTYyNTIxNTAyMywiZXhwIjozMTcxNjk2NTc0MjN9.gTtvpSRqlKF_ZXjXd604-tqkdb2eRJ-CX9eKuBinpmM';
//     var secret = 'yamappgoodappforstudent';
//     try {
//         if (!global.mongoose) {
//             global.mongoose = await mongoose.connect(dbConnectionString, {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//                 useFindAndModify: false,
//             });
//         }
//     }
//     catch (ex) {
//         console.error(ex);
//     }
//     if (token) {
//         jwt.verify(token, secret, function (err, decoded) {
//             if (err) {
//                 return res.json({ success: false, message: 'Failed to authenticate token' })
//             } else {

//                 return next();
//             }
//         })

//     } else {
//         return res.json({ success: false, message: 'No token provided' })
//     }

// };
// export default databaseMiddleware;