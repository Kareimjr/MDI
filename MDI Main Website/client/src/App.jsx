import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import { AppContext } from "./context/AppContext";
import StudentViewCommonLayout from "./components/student-view/commonLayout";
import StudentHomePage from "./pages/student/studentHome";
import Loading from "./components/Loading";
import PageNotFound from "./pages/404";
import InstructorDashboardPage from "./pages/instructor";
import AddNewCoursePage from "./pages/instructor/addNewCourse";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailsPage from "./pages/student/courseDetails";
import PaymentSuccessPage from "./pages/student/paymentVerification";
import StudentCoursesPage from "./pages/student/studentCoursesPage";
import StudentProgressPage from "./pages/student/studentProgressPage";

const App = () => {
  const { isLoggedin, userData, isLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading || userData === undefined) return; // Wait for auth state to load completely

    const pathname = location.pathname;

    // Add console logs for debugging
    console.log('isLoggedin:', isLoggedin);
    console.log('userData:', userData);
    console.log('pathname:', pathname);

    if (!isLoggedin) {
      // Redirect unauthenticated users, allow access to home and reset password page
      if (pathname !== "/" && pathname !== "/login" && pathname !== "/reset-password") {
        navigate("/login");
      }
    } else {
      if (userData) {
        // Redirect authenticated users away from login page
        if (pathname === "/login") {
          navigate(userData.role === "instructor" ? "/instructor" : "/student");
        }

        // Redirect non-instructors away from instructor routes
        if (userData.role !== "instructor" && pathname.startsWith("/instructor")) {
          navigate("/student");
        }

        // Redirect instructors away from student routes
        if (userData.role === "instructor" && pathname.startsWith("/student")) {
          navigate("/instructor");
        }
      }
    }
  }, [isLoggedin, userData, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return <Loading />; // Show loading spinner while loading
  }

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/instructor/" element={<InstructorDashboardPage />} />
        <Route path="/instructor/create" element={<AddNewCoursePage />} />
        <Route path="/instructor/edit-course/:courseId" element={<AddNewCoursePage />} />
        {/* Add more  Instructor routes as needed */}

        <Route path="/student" element={<StudentViewCommonLayout />}>
          <Route path="" element={<StudentHomePage />} />
          <Route path="home" element={<StudentHomePage />} />
          <Route path="courses" element={<StudentViewCoursesPage />} />
          <Route path="course/details/:id" element={<StudentViewCourseDetailsPage />} />
          <Route path="course/mycourses" element={<StudentCoursesPage />} />
          <Route path="course/progress/:id" element={<StudentProgressPage />} />
          {/* Add more  student routes as needed */}
        </Route>
        <Route path="payment-success" element={<PaymentSuccessPage/>}/>
        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </div>
  );
}

export default App;
