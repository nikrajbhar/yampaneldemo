import Support from "../../models/support";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
  console.log("get called");
  await getSupport(req, res)
});
handler.post(async (req, res) => {
  console.log("getting post");
  await postSupport(req, res)
});
handler.put(async (req, res) => {
  await updateSupport(req, res)
});
// handler.delete(async (req, res) => {
//   await deleteCategory(req, res)
// });

const getSupport = async (req, res) => {
    Support.find().then(supports => {
    res.status(200).json({ supports })
  })
}


const postSupport = async (req, res) => {
  const { status, isActive, query, studentId } = req.body
  console.log(req.body);
  const support = await new Support({    
    status,
    isActive,
    query,
    studentId,
  
  }).save()
  res.status(201).json(support)
}

const updateSupport = async (req, res) => {
  console.log("req.body updateQuizze api", req.body);
  const {_id, status, isActive, query, studentId  } = req.body
  const supportop = await Support.findOneAndUpdate(
    { _id: _id },
    { $set: {status: status, isActive: isActive,  query:query, studentId:studentId,  } }
  )
  res.status(201).json(supportop)
}

export default (req, res) => handler.run(req, res)