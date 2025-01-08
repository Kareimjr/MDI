import { Button } from "@/components/ui/button";
import InstructorCourses from "../../components/Instructor-view/courses";
import InstructorDashboard from "../../components/Instructor-view/InstructorDashboard";
import { BarChart, Book, LogOut } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import axios from 'axios';
import { toast } from 'react-toastify';
import { InstructorContext } from "@/context/InstructorContext";
import { fetchInstructorCourseListService } from "@/services";

function InstructorDashboardPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();
    const { backendUrl, setIsLoggedin, userData, setUserData } = useContext(AppContext);
    const { instructorCoursesList, setInstructorCoursesList } = useContext(InstructorContext);

    async function fetchAllCourses() {
        try {
            const response = await fetchInstructorCourseListService();
            console.log('Fetched Courses Response:', response); // Log response
    
            if (response.success) {
                setInstructorCoursesList(response.data);
                console.log('Instructor Courses List:', response.data); // Log set data
            } else {
                toast.error("Failed to fetch courses");
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            toast.error("An error occurred while fetching courses");
        }
    }
    

    useEffect(() => {
        fetchAllCourses();
    }, []);

    console.log(instructorCoursesList, 'instructorCoursesList');
    

    const menuItems = [
        {
            icon: BarChart,
            label: 'Dashboard',
            value: 'dashboard',
            component: <InstructorDashboard  listOfCourses={instructorCoursesList}/>
        },
        {
            icon: Book,
            label: 'Courses',
            value: 'courses',
            component: <InstructorCourses listOfCourses={instructorCoursesList} />
        },
        {
            icon: LogOut,
            label: 'Logout',
            value: 'logout',
            component: null
        }
    ];

    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
            if (data.success) {
                setIsLoggedin(false);
                setUserData(null);
                navigate('/');
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex h-full min-h-screen">
            <aside className="w-64 bg-indigo-50 shadow-md hidden md:block">
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
                    <nav>
                        {menuItems.map(menuItem => (
                            <Button
                                className="w-full justify-start mb-2"
                                key={menuItem.value}
                                variant={activeTab === menuItem.value ? 'secondary' : 'ghost'}
                                onClick={menuItem.value === 'logout' ?
                                    handleLogout : () => setActiveTab(menuItem.value)
                                }
                            >
                                <menuItem.icon className="mr-2 h-4 w-4" />
                                {menuItem.label}
                            </Button>
                        ))}
                    </nav>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        {menuItems.map(menuItem => (
                            <TabsContent key={menuItem.value} value={menuItem.value}>
                                {activeTab === menuItem.value && menuItem.component}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

export default InstructorDashboardPage;
