import { assets } from "@/assets/assets";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { LogOut, TvMinimalPlay } from "lucide-react";



function StudentViewHeader() {

    const navigate = useNavigate();
    const { backendUrl, setIsLoggedin, userData, setUserData } = useContext(AppContext); const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/logout');
            data.success && setIsLoggedin(false);
            data.success && setUserData(false);
            navigate('/');
            toast.success(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full flex justify-between items-center pt-6 p-4 sm:px-8 top-0">
            <div className="flex items-center gap-4">
            <Link to="/student">
                <img src={assets.logo} className="w-23 sm:w-32" />
            </Link>
                <div>
                    <Button onClick={()=> 
                        location.pathname.includes("/courses") 
                        ? null 
                        : navigate("/student/courses")} variant="ghost" className="border text-[14px] md:text-[16px] font-medium"> Explore Courses</ Button>
                </div>
                </div>


                {userData && (
                    <div className="w-10 h-10 flex justify-center items-center rounded-full bg-[#2A3571] text-white relative group">
                        {userData.name[0].toUpperCase()}
                        <div className="absolute hidden mt-1 group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                            <ul className="list-none m-0 p-1 text-nowrap bg-gray-100 text-base rounded">
                                <li onClick={()=>navigate("/student/course/mycourses")} className="py-1 px-2 flex gap-2 items-center font-medium hover:bg-gray-200 cursor-pointer">
                                    <TvMinimalPlay width={20}/> My Courses</li>
                                <li onClick={logout} className="py-1 px-2 flex gap-2 items-center font-medium hover:bg-gray-200 cursor-pointer">
                                    <LogOut width={20}/>
                                    Logout</li>
                            </ul>
                        </div>
                    </div>)}
        </div>
    );
}

export default StudentViewHeader;