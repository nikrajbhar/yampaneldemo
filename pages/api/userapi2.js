import User from "../../models/user";
import { userType } from "../../components/global";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
  console.log("get called");
  await getUser(req, res)
});
handler.post(async (req, res) => {
  console.log("getting post");
  await postUser(req, res)
});
handler.put(async (req, res) => {
  console.log("getting put");
  await updateUser(req, res)
});

const getUser = async (req, res) => {
    // 
    try {        
        
      let teachers = await User.find({'userType': userType.teacher }).countDocuments()
      let students = await User.find({'userType': userType.student }).countDocuments()

      let addDate = [0,0,0,0,0,0,0,0,0,0,0,0]
      let user = [];
  
      user = await User.aggregate([
        { $match: { userType: userType.student } },
        {
          $project: {
            _id: 0,
            firstName : "$firstName",
            createdMonth: { $month: "$createdDate" },
          },
        },
      ]);
      // res.send(user)
      for (let i = 0; i < user.length; i++) {
        const ele = user[i].createdMonth;
        if (ele == 1) {
          addDate[0] += 1;
        }
        else if (ele == 2){
          addDate[1] += 1;
        }
        else if (ele == 3){
          addDate[2] += 1;
        }
        else if (ele == 4){
          addDate[3] += 1;
        }
        else if (ele == 5){
          addDate[4] += 1;
        }
        else if (ele == 6){
          addDate[5] += 1;
        }
        else if (ele == 7){
          addDate[6] += 1;
        }
        else if (ele == 8){
          addDate[7] += 1;
        }
        else if (ele == 9){
          addDate[8] += 1;
        }
        else if (ele == 10){
          addDate[9] += 1;
        }
        else if (ele == 11){
          addDate[10] += 1;
        }
        else if (ele == 12){
          addDate[11] += 1;
        }
        else{
          return;
        }
      }
      
      res.json({addDate, teachers, students});
      console.log({addDate, teachers, students});
    } catch (error) {
      res.json({ error });
    }
    // 
  
}


export default (req, res) => handler.run(req, res)