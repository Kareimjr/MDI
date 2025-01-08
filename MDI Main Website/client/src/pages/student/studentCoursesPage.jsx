import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AppContext } from "@/context/AppContext";
import { StudentContext } from "@/context/StudentContext";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function StudentCoursesPage() {

    const {userData} = useContext(AppContext)
    const {studentBoughtCoursesList, setStudentBoughtCoursesList} = useContext(StudentContext);
    const navigate = useNavigate()

    async function fetchStudentBoughtCourses() {
        const response = await fetchStudentBoughtCoursesService(userData?._id);
        if(response?.success){
            setStudentBoughtCoursesList(response?.data);
        }
        console.log(response);
    }
        
        
    useEffect(()=>{
        fetchStudentBoughtCourses()
    },[])

    return ( 
        <div className="px-8 py-4">
            <h1 className="text-3xl font-bold mb-8">My Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {
                    setStudentBoughtCoursesList && studentBoughtCoursesList.length > 0 ?
                    studentBoughtCoursesList.map(course=>
                        <Card key={course.id} className="flex flex-col bg-transparent ">
                            <CardContent className="p-4 flex-grow">
                                <img src={course?.courseImage}
                                alt={course?.title}
                                className="h-52 w-full object-cover rounded-md mb-4"
                                 />
                                 <h3 className="font-bold mb-1">{course?.title}</h3>
                                 <p className='text-sm text-gray-500 mb-2 font-bold'>{course?.instructorName}</p>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={()=>navigate(`/student/course/progress/${course?.courseId}`)} className="flex-1 bg-[#2A3571] hover:bg-[#4a57a0]">
                                    <Watch className="mr-2 h-4 w-4"/>
                                    Start Watching
                                </Button>
                            </CardFooter>
                        </Card>


                    )
                    : <h1 className="text-3xl font-bold">No Courses Found</h1>
                }
            </div>
        </div>
     );
}

export default StudentCoursesPage;