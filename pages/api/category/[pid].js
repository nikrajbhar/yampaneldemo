import Categorie from "../../../models/categorie";
import createHandler from "../../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
    await fetchcategory(req, res)
});
handler.delete(async (req, res) => {
    await deleteCategory(req, res)
  });

const fetchcategory = async (req, res) => {
    const { pid } = req.query
    console.log(req.query);
    const category = await Categorie.findOne({ _id: pid })
    res.status(200).json(category)
}

const deleteCategory = async (req,res)=>{
    console.log('query',req.query);
    const {pid } =  req.query   
    await Categorie.findByIdAndDelete({_id:pid})
    res.status(200).json({})
  }

export default (req, res) => handler.run(req, res)