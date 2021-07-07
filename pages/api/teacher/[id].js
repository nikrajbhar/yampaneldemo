import User from "../../../models/user";
import createHandler from "../../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
    await fetchUser(req, res)
});
handler.delete(async (req, res) => {
    await deleteUser(req, res)
  });

const fetchUser = async (req, res) => {
    const { id } = req.query
    console.log(req.query);
    const user = await User.findOne({ _id: id })
    res.status(200).json(user)
}

const deleteUser = async (req,res)=>{
    console.log('query',req.query);
    const { id } =  req.query   
    await User.findByIdAndDelete({_id:id})
    res.status(200).json({})
  }

export default (req, res) => handler.run(req, res)