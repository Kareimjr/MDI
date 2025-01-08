const Course = require('../../models/course');
const StudentCourses = require('../../models/studentCourses')

const getAllStudentViewCourses = async (req, res) => {
    try {
        const { category = [], level = [], primaryLanguage = [], sortBy = "" } = req.query;

        let filters = {};
        if (category.length) {
            filters.category = { $in: category.split(',') };
        }
        if (level.length) {
            filters.level = { $in: level.split(',') };
        }
        if (primaryLanguage.length) {
            filters.primaryLanguage = { $in: primaryLanguage.split(',') };
        }


        let sortParam = {};
        switch (sortBy) {
            case 'price-lowtohigh':
                sortParam.pricing = 1;
                break;
            case 'price-hightolow':
                sortParam.pricing = -1;
                break;
            case 'title-atoz':
                sortParam.title = 1;
                break;
            case 'title-ztoa':
                sortParam.title = -1;
                break;
            default:
                break;
        }


        const coursesList = await Course.find(filters).sort(sortParam);

        res.status(200).json({
            success: true,
            data: coursesList
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const getStudentViewCourseDetails = async (req, res) => {
    try {
        const { id, studentId } = req.params;
        const courseDetails = await Course.findById(id);

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course details not found",
                data: null,
            });
        }

        //Check if the current student purchased this course 
        const studentCourses = await StudentCourses.findOne({
            userId: studentId
        })

        // console.log("studentId:", studentId);
        // console.log("courseId:", id);
        // console.log("studentCourses:", studentCourses);
        // console.log("studentCourses.courses:", studentCourses.courses);

        const ifStudentAlreadyBoughtCurrentCourse = studentCourses && studentCourses.courses
            ? studentCourses.courses.findIndex(item => item.courseId.toString() === id) > -1  
            : false;



        res.status(200).json({
            success: true,
            data: courseDetails,
            coursePurchasedId : ifStudentAlreadyBoughtCurrentCourse ? id : null,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { getAllStudentViewCourses, getStudentViewCourseDetails };
