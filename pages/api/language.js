import language from "../../models/language";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
  console.log("get called");
  language.find().then(languages => {
    res.status(200).json({ languages })
  })
});

export default (req, res) => handler.run(req, res)