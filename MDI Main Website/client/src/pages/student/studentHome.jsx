import { courseCategories } from '@/config';
import banner from '../../../public/banner-img.png';
import { Button } from '@/components/ui/button';
import { useContext, useEffect } from 'react';
import { StudentContext } from '@/context/StudentContext';
import { fetchStudentViewCourseListService } from '@/services';
import { useNavigate } from 'react-router-dom';

function studentHomePage() {
    const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
    const navigate = useNavigate()

    function handleNavigateToCoursesPage(getCurrentId){
        console.log(getCurrentId, 'currentID');
        sessionStorage.removeItem('filters');
        const currentFilter = {
            category : [getCurrentId]
        }
        sessionStorage.setItem('filter', JSON.stringify(currentFilter));
        navigate('/student/courses')
    }

    // Fetch all courses and update state
    async function fetchAllStudentViewCourses() {
        const response = await fetchStudentViewCourseListService();
        if (response?.success) {
            setStudentViewCoursesList(response.data);
        } else {
            console.error("Failed to fetch courses", response);
        }
    }

    // Log the course list to debug the structure
    useEffect(() => {
        fetchAllStudentViewCourses();
    }, []);

    useEffect(() => {
    }, [studentViewCoursesList]);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="flex flex-col lg:flex-row items-center justify-between py-4 px-4 lg:px-8">
                <div className="lg:w-1/2 lg:pr-12">
                    <h1 className="text-4xl font-bold mb-4">Learning that gets you</h1>
                    <p className="text-lg">Skills for your present and future. Get Started with Us</p>
                </div>
                <div className="lg:w-full mb-8 lg:mb-0">
                    <img
                        src={banner}
                        width={600}
                        height={400}
                        className="w-full h-auto shadow-lg rounded-lg"
                        alt="Banner"
                    />
                </div>
            </section>

            {/* Course Categories Section */}
            <section className="py-8 px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {courseCategories.map((categoryItem, index) => (
                        <Button
                            className="justify-start"
                            variant="outline"
                            key={categoryItem.id || `category-${index}`}
                            onClick={()=> handleNavigateToCoursesPage(categoryItem.id)}
                        >
                            {categoryItem.label}
                        </Button>
                    ))}
                </div>
            </section>

            {/* Featured Courses Section */}
            <section className="py-12 px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                        studentViewCoursesList.map((courseItem, index) => (
                            <div onClick={() => navigate(`/student/course/details/${courseItem?._id}`)}
                                key={courseItem.id || `course-${index}`} // Fallback key for missing IDs
                                className="border rounded-lg overflow-hidden shadow cursor-pointer bg-transparent hover:scale-105 transition-transform duration-300 ease-in-out"
                            >
                                <img
                                    src={courseItem?.image}
                                    width={300}
                                    height={150}
                                    className="w-full h-40 object-cover"
                                    alt={courseItem?.title || "Course Image"}
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-bold mb-1">{courseItem?.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        Created By <span className="font-bold">{courseItem?.instructorName}</span>
                                    </p>
                                    <p className="text-[15px] text-gray-500 mb-1">
                                        {`${courseItem?.curriculum?.length} ${courseItem?.curriculum?.length <= 1 ? "Lecture" : "Lectures"
                                            } - ${courseItem.level?.toUpperCase()}`}
                                    </p>
                                    <p className="font-bold text-lg">₦ {(courseItem?.pricing).toLocaleString('en-NG')}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h1>No Courses Found</h1>
                    )}
                </div>
            </section>
        </div>
    );
}

export default studentHomePage;
