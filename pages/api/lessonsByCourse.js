import Lesson from "../../models/lesson";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
    await getLessons(req, res)
});

const getLessons = async (req, res) => {
    const { courseId } = req.query;
    Lesson.find({ 'courseId': courseId }).then(lessons => {
        res.status(200).send(lessons);
    })
}

export default (req, res) => handler.run(req, res);