import Lesson from "../../models/lesson";
import Course from "../../models/course";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
  console.log("get called");
  await getLessons(req, res)
});
handler.post(async (req, res) => {
  console.log("getting post");
  await postLessons(req, res)
});

handler.put(async (req, res) => {
  await updateLessons(req, res)
});
// handler.delete(async (req, res) => {
//   await deleteCategory(req, res)
// });

const getLessons = async (req, res) => {
    Lesson.find().populate({path:'courseId', model:'course'}).then(lessons => {
    res.status(200).json({ lessons })
  })
}

const postLessons = async (req, res) => {
  
  const {isActive, lessonName, courseId, detail, duration, typeid, lessonDetails, lessonVideo, image, createdBy } = req.body
  console.log(req.body);
  const lesson = await new Lesson({    
    isActive,
    lessonName,
    courseId,
    detail,
    duration,
    typeid,
    lessonDetails,    
    lessonVideo,
    image,
    createdBy,
  }).save()
  if (lesson.isActive) {
    updateCourse(courseId, true);
  }

  res.status(201).json(lesson)
}

const updateCourse = async (courseId, isIncrement) => {
  let noOfLessonIncDecCount = isIncrement ? 1 : -1;
  await Course.findByIdAndUpdate(courseId, { $inc: { noOfLessons: noOfLessonIncDecCount } });
}

const updateLessons = async (req, res) => {
  console.log("req.body updateLessons api", req.body);
  const {_id, isActive, lessonName, courseId, detail, duration, typeid, image, lessonDetails, lessonVideo, updateBy, updateDate } = req.body
  const lessonop = await Lesson.findOneAndUpdate(
    { _id: _id },
    { $set: {isActive: isActive, lessonName: lessonName,  courseId:courseId, detail:detail, duration:duration, typeid:typeid, image:image, lessonDetails:lessonDetails, lessonVideo:lessonVideo,updateBy:updateBy , updateDate:updateDate } }
  )
  if (lessonop.isActive != isActive) {
    updateCourse(courseId, isActive);
  }
  res.status(201).json(lessonop)
}

export default (req, res) => handler.run(req, res)