import { Banknote, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "../ui/table";

function InstructorDashboard({ listOfCourses }) {
    function calculateTotalStudentAndProfit() {
        const { totalStudents, totalProfit, studentList } = listOfCourses.reduce((acc, course) => {
            const studentCount = course.students.length;
            acc.totalStudents += studentCount;
            acc.totalProfit += course.pricing * studentCount;

            course.students.forEach(student => {
                acc.studentList.push({
                    courseTitle: course.title,
                    studentName: student.studentName,
                    studentEmail: student.studentEmail,
                    studentResidence: student.studentResidence,
                });
            })
            return acc;
        }, { totalStudents: 0, totalProfit: 0, studentList: [] });
        return { totalProfit, totalStudents, studentList }
    }

    const { totalStudents, totalProfit, studentList } = calculateTotalStudentAndProfit();

    const config = [
        {
            icon: Users,
            label: 'Total Students',
            value: totalStudents,
        },
        {
            icon: Banknote,
            label: 'Total Revenue',
            value: totalProfit,
        }
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {
                    config.map((item, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {item.label}
                                </CardTitle>
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{(item.value).toLocaleString('en-NG')}</div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Student List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Name</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Student Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {calculateTotalStudentAndProfit().studentList.map((studentItem, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{studentItem.courseTitle}</TableCell>
                                        <TableCell>{studentItem.studentName}</TableCell>
                                        <TableCell>{studentItem.studentEmail}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default InstructorDashboard;
