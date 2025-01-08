import { Delete, Edit } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { InstructorContext } from "@/context/InstructorContext";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";

function InstructorCourses({ listOfCourses }) {
    const navigate = useNavigate();
    const { setCurrentEditedCourseId, setCourseLandingFormData, setCourseCurriculumFormData } = useContext(InstructorContext);

    const handleCreateNewCourse = () => {
        setCurrentEditedCourseId(null);
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        navigate("/instructor/create");
    };

    return (
        <div>
            <Card>
                <CardHeader className="flex justify-between flex-row items-center">
                    <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
                    <Button onClick={handleCreateNewCourse} className="p-6">
                        Create New Course
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Courses</TableHead>
                                    <TableHead>No. of Students</TableHead>
                                    <TableHead>Revenue</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listOfCourses && listOfCourses.length > 0 ? 
                                    listOfCourses.map(course => (
                                        <TableRow key={course._id}>
                                            <TableCell className="font-medium">{course.title}</TableCell>
                                            <TableCell>{course?.students?.length}</TableCell>
                                            <TableCell>₦{(course?.students?.length * course.pricing).toLocaleString('en-NG')}</TableCell>
                                            <TableCell className="text-right">
                                                <Button onClick={() => {
                                                    navigate(`/instructor/edit-course/${course._id}`);
                                                }} variant="ghost" size="sm">
                                                    <Edit className="h-6 w-6" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Delete className="h-6 w-6" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : 
                                    <TableRow>
                                        <TableCell colSpan="4" className="text-center">No courses found.</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default InstructorCourses;
