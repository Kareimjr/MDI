import { assets } from "@/assets/assets";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Navbar() {

    const navigate = useNavigate();
    const { backendUrl, setIsLoggedin, userData, setUserData} = useContext(AppContext);

    const logout = async  () =>{
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/auth/logout')
            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            navigate('/')
            toast.success(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    return ( 
        <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
            <img src={assets.logo} className="w-36 sm:w-40" />
            {userData ?
            <div className="w-8 h-8 flex justify-center items-center rounded-full bg-[#2A3571] text-white relative group">
                {userData.name[0].toUpperCase()}
                <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                    <ul className="list-none m-0 p-2 bg-gray-100 text-sm rounded">
                        <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Logout</li>
                    </ul>
                </div>
            </div>
            :
            <button onClick={() =>navigate('/login') }
            className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">Login
            <img src={assets.arrow_icon} />
            </button>
            }
            
        </div>
    );
}

export default Navbar;