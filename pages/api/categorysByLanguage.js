import Categorie from "../../models/categorie";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
    await getCategorie(req, res)
});

const getCategorie = async (req, res) => {
    const { languageId } = req.query;
    Categorie.find({ 'languageId': languageId }).then(categories => {
        res.status(200).send(categories);
    })
}

export default (req, res) => handler.run(req, res);