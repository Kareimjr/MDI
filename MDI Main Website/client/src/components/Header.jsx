import { assets } from "@/assets/assets";
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const { isLoggedin, userData } = useContext(AppContext);
  const navigate = useNavigate();

  // Logic for button click
  const handleGetStarted = () => {
    if (!isLoggedin) {
      // If user is not logged in, navigate to login page
      navigate("/login");
    } else if (userData?.role !== "instructor") {
      // If user is logged in but not an instructor, navigate to student page
      navigate("/student");
    } else if (userData?.role === "instructor") {
      // If user is logged in and is an instructor, navigate to instructor page
      navigate("/instructor");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center">
      <img src={assets.header_img} className="w-36 h-36 rounded-full mb-6" />

      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.name : "developer"}!{" "}
        <img src={assets.hand_wave} className="w-8 aspect-square" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to MDI Hub Learning platform
      </h2>

      <p className="mb-8 max-w-md">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </p>

      <button
        onClick={handleGetStarted}
        className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all"
      >
        Get Started
      </button>
    </div>
  );
}
export default Header;
