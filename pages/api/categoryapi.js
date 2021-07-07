import Categorie from "../../models/categorie";
import language from "../../models/language";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
  console.log("get called");
  await getCategory(req, res)
});
handler.post(async (req, res) => {
  console.log("getting post");
  await postCategory(req, res)
});
handler.put(async (req, res) => {
  await updateCategory(req, res)
});
handler.delete(async (req, res) => {
  await deleteCategory(req, res)
});

const getCategory = async (req, res) => {
  Categorie.find().populate({path:'languageId', model:'language'}).then(categories => {
    res.status(200).json({ categories })
  })
}


//  .populate("languageId")
// "languageName"

const postCategory = async (req, res) => {
  const {isActive, categoryName, languageId, createdBy } = req.body
  console.log(req.body);
  const product = await new Categorie({    
    isActive,
    categoryName,
    languageId,
    createdBy
  }).save()
  res.status(201).json(product)
}


const updateCategory = async (req, res) => {
  console.log("req.body categori api", req.body);
  const { _id, categoryName, isActive, languageId, updateBy, updateDate } = req.body
  const categoryop = await Categorie.findOneAndUpdate(
    { _id: _id },
    { $set: { categoryName: categoryName, isActive: isActive, languageId:languageId, updateBy:updateBy, updateDate: updateDate } }
  )
  res.status(201).json(categoryop)
}

export default (req, res) => handler.run(req, res)

const deleteCategory = async (req,res)=>{
  const {pid } =  req.query
 
  await Categorie.findByIdAndDelete({_id:pid})
  res.status(200).json({})
}