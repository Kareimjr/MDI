import { createContext, useState } from "react";


export const StudentContext = createContext(null);

export default function StudentProvider({children}) {

    const [studentViewCoursesList, setStudentViewCoursesList] =useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [studentViewCourseDetails, setStudentViewCourseDetails] = useState(null);
    const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
    const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);

    const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState({});


    return (
        <StudentContext.Provider value={{ studentViewCoursesList, setStudentViewCoursesList, isLoading, setIsLoading, studentViewCourseDetails, setStudentViewCourseDetails, currentCourseDetailsId, setCurrentCourseDetailsId, studentBoughtCoursesList, setStudentBoughtCoursesList, studentCurrentCourseProgress,
            setStudentCurrentCourseProgress }}>
            {children}
        </StudentContext.Provider>
    )
}