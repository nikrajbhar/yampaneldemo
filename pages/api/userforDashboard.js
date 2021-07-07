import Lesson from "../../models/lesson";
import Course from "../../models/course";
import User from "../../models/user";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();



handler.get(async (req, res) => {
  console.log("get called");
  await getUser(req, res)
});


const getUser = async (req, res) => {  
  const { usertype } = req.query
  console.log("get called....",usertype);
  User.find({'userType': usertype}).countDocuments().then(user => {
    res.status(200).json({ user })
  })
}


export default (req, res) => handler.run(req, res)
