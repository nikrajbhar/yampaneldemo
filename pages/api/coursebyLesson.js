import Lesson from "../../models/lesson";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
    await getLessons(req, res)
});

const getLessons = async (req, res) => {
    const { Id } = req.query;
    Lesson.findOne({ _id: Id }).then(lessons => {
        res.status(200).send(lessons);
    })
}

export default (req, res) => handler.run(req, res);