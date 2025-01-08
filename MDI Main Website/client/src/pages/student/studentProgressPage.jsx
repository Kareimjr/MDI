import { Button } from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/VideoPlayer";
import { AppContext } from "@/context/AppContext";
import { StudentContext } from "@/context/StudentContext";
import {
    getCurrentCourseProgressService,
    markLectureAsViewedService,
    resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentProgressPage() {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);
    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
        useContext(StudentContext);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
        useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSidebarOpen, setIsSideBarOpen] = useState(true);
    const [lockCourse, setLockCourse] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        let isMounted = true; // Initialize isMounted flag

        const fetchProgress = async () => {
            const response = await getCurrentCourseProgressService(
                userData?._id,
                id
            );
            console.log(response);

            if (isMounted && response?.success) {
                // ... (rest of your response handling logic - same as before) ...
            }
        };

        if (id) {
            fetchProgress();
        }

        return () => {
            isMounted = false; // Set isMounted to false on unmount
        };
    }, [id]);

    async function updateCourseProgress() {
        let isMounted = true; // Initialize isMounted flag

        if (currentLecture) {
            const response = await markLectureAsViewedService(
                userData?._id,
                studentCurrentCourseProgress?.courseDetails?._id,
                currentLecture?._id
            );

            if (isMounted && response?.success) {
                fetchCurrentCourseProgress();
            }
        }

        return () => {
            isMounted = false; // Set isMounted to false on unmount
        };
    }

    async function handleRewatchCourse() {
        let isMounted = true; // Initialize isMounted flag

        const response = await resetCourseProgressService(
            userData?._id,
            studentCurrentCourseProgress?.courseDetails?._id
        );

        if (isMounted && response?.success) {
            setCurrentLecture(null);
            setShowConfetti(false);
            setShowCourseCompleteDialog(false);
            fetchCurrentCourseProgress();
        }

        return () => {
            isMounted = false; // Set isMounted to false on unmount
        };
    }

    useEffect(() => {
        if (currentLecture?.progressValue === 1) updateCourseProgress();
    }, [currentLecture]);

    useEffect(() => {
        if (showConfetti) setTimeout(() => setShowConfetti(false), 30000);
    }, [showConfetti]);


return (
        <div className="flex flex-col h-screen bg-[#111b4b] text-white">
            {showConfetti && <ReactConfetti />}
            <div className="flex items-center justify-between p-4 bg-transparent border-b border-gray-500">
                <div className="flex items-center space-x-4">
                    <Button onClick={() => navigate('/student/course/mycourses')} className="text-white" variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to My Course Page
                    </Button>
                    <h1 className="text-lg font-bold hidden md:block">
                        {studentCurrentCourseProgress?.courseDetails?.title}
                    </h1>
                </div>
                <Button onClick={() => setIsSideBarOpen(!isSidebarOpen)} className="bg-[#0c1336] hover:bg-[#182669]">
                    {isSidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className={`flex-1 ${isSidebarOpen ? "mr-[400px]" : ''} transition-all duration-300`}>
                    <VideoPlayer
                        width="100%"
                        height="500px"
                        url={currentLecture?.videoUrl}
                        onProgressUpdate={setCurrentLecture}
                        progressData={currentLecture}
                    />
                    <div className="p-6 bg-[#111b4b]">
                        <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
                    </div>
                </div>
                <div className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#111b4b] border-l border-gray-700 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <Tabs defaultValue="content" className="h-full flex flex-col">
                        <TabsList className="grid bg-[#111b4b] w-full grid-cols-2 p-0 h-14">
                            <TabsTrigger value="content" className="text-white rounded-none h-full">Course Content</TabsTrigger>
                            <TabsTrigger value="overview" className="text-white rounded-none h-full">Overview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="content">
                            <ScrollArea className="h-full">
                                <div className="p-4 space-y-4">
                                    {studentCurrentCourseProgress?.courseDetails?.curriculum.map(item => (
                                        <div
                                            className={`flex items-center space-x-2 text-sm font-bold cursor-pointer ${currentLecture?._id === item._id ? 'text-green-500' : 'text-white'}`}
                                            key={item._id}
                                            onClick={() => setCurrentLecture(item)}
                                        >
                                            {studentCurrentCourseProgress?.progress?.find(progressItem => progressItem.lectureId === item._id)?.viewed ? <Check className="h-4 w-4 text-green-500" /> : <Play className="h-4 w-4" />}
                                            <span>{item?.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="overview" className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-4">About this course</h2>
                                    <p className="text-gray-400">{studentCurrentCourseProgress?.courseDetails?.description}</p>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <Dialog open={lockCourse}>
                <DialogContent className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>You can't view this page</DialogTitle>
                        <DialogDescription>Please purchase this course to get access</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={showCourseCompleteDialog}>
                <DialogContent showOverlay={false} className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Congratulations on your completion of this course</DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            <Label>You have successfully completed the course</Label>
                            <div className="flex flex-row gap-3">
                                <Button onClick={() => navigate('/student/course/mycourses')}>My Courses Page</Button>
                                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default StudentProgressPage;
