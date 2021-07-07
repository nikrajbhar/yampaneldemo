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
  const { usertype, isActive } = req.query
  console.log("get called....",usertype);
  console.log("isActive....",isActive);
  if (usertype) {
    if (isActive== undefined) {
      User.find({ 'userType': usertype, 'isEmailverified' :true }).then(users => {
        res.status(200).json({ users })
      })
    }else{
      User.find({ 'userType': usertype, 'isActive': isActive , 'isEmailverified' :true }).then(users => {
        res.status(200).json({ users })
      })
    }
   
  } else
    {
    // 
    try {
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
      
      res.json(addDate);
    } catch (error) {
      res.json({ error });
    }
    // 
  }
}

const postUser = async (req, res) => {
  const { fbToken, isEmailverified, isActive, email, password, userType, otp, otpDate, firstName,
    lastName, rollno, studentclass, gender, mobileNo, parentsName, parentsnumber,
    dob, bloodgroup, address, profileImage, designation, education, department } = req.body
  console.log(req.body);
  const user = await new User({
    fbToken,
    isEmailverified,
    isActive,
    email,
    password,
    userType,
    otp,
    otpDate,
    firstName,
    lastName,
    rollno,
    studentclass,
    gender,
    mobileNo,
    parentsName,
    parentsnumber,
    dob,
    bloodgroup,
    address,
    profileImage,
    joiningDate,
    designation,
    education,
    department
  }).save()
  res.status(201).json(user)
}

//student
const updateUser = async (req, res) => {
  console.log("req.body api", req.body);
  const { _id, isActive, email, userType, firstName, lastName, rollno,
    studentclass, gender, mobileNo, parentsName, parentsnumber,
    dob, bloodgroup, address, profileImage, designation, education, department, updateBy, updateDate } = req.body
  const userop = await User.findOneAndUpdate(
    { _id: _id },
    {
      $set: {
        isActive: isActive, firstName: firstName, lastName: lastName,
        rollno: rollno, studentclass: studentclass, gender: gender, mobileNo: mobileNo, parentsName: parentsName,
        parentsnumber: parentsnumber, dob: dob, bloodgroup: bloodgroup, address: address,
        profileImage: profileImage, designation:designation, education: education, department:department, updateBy:updateBy , updateDate:updateDate
      }
    }
  )
  res.status(201).json(userop)
}
// handler.get(async (req, res) => {
//   console.log("get called");
//   user.find().then(users => {
//     res.status(200).json({ users })
//   })
// });

export default (req, res) => handler.run(req, res)