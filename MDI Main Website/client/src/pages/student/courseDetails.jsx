import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VideoPlayer from "@/components/VideoPlayer";
import { AppContext } from "@/context/AppContext";
import { StudentContext } from "@/context/StudentContext";
import { fetchStudentViewCourseDetailsService } from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const { studentViewCourseDetails, setStudentViewCourseDetails } = useContext(StudentContext);
  const { userData } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false); // Track Buy Now loading state
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [coursePurchasedId, setCoursePurchasedId] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setIsLoading(true);
      const response = await fetchStudentViewCourseDetailsService(id, userData?._id);
      console.log("API Response:", response);

      if (isMounted && response?.success) {
        console.log("Fetched Data:", response?.data);
        setStudentViewCourseDetails(response?.data);
        setCoursePurchasedId(response?.coursePurchasedId);
      }
      setIsLoading(false);
    };

    if (id) {
      fetchDetails();
    }

    return () => {
      isMounted = false;
      setStudentViewCourseDetails(null);
    };
  }, [id, userData?._id]);

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) {
      setShowFreePreviewDialog(true);
    }
  }, [displayCurrentVideoFreePreview]);

  if (isLoading) {
    return <Loading />;
  }

  if (coursePurchasedId) {
    navigate(`/student/course/progress/${coursePurchasedId}`, { replace: true });
    return null;
  }

  const getIndexOfFreePreviewUrl = studentViewCourseDetails !== null
    ? studentViewCourseDetails?.curriculum.findIndex(item => item.freePreview)
    : -1;

  async function handleBuyNow(
    courseId,
    amount,
    email,
    courseTitle,
    instructorId,
    instructorName,
    studentResidence,
    courseImage
  ) {
    setIsBuyNowLoading(true); // Activate loading state
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount,
          courseId,
          courseTitle,
          instructorId,
          instructorName,
          studentId: userData._id,
          studentResidence,
          userName: userData.name,
          courseImage,
        }),
      });

      const { data } = await response.json();

      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
    } finally {
      setIsBuyNowLoading(false); // Deactivate loading state
    }
  }

  return (
    <div className="mx-auto px-6 mt-4">
      <div className="bg-[#2A3571] text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">{studentViewCourseDetails?.title}</h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created by {studentViewCourseDetails?.instructorName}</span>
          <span>Created on {studentViewCourseDetails?.date.split("T")[0]}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
        </div>
        <p className="text-xl mt-2">{studentViewCourseDetails?.description}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-4">
        <main className="flex-grow">
          <Card className="mb-4 bg-transparent">
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives.split(",").map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    {objective}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-4 bg-transparent">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {studentViewCourseDetails?.curriculum?.map((curriculumItem, index) => (
                  <li
                    key={index}
                    className={`${
                      curriculumItem?.freePreview ? "cursor-pointer" : "cursor-not-allowed"
                    } flex items-center mb-3`}
                    onClick={curriculumItem?.freePreview ? () => handleSetFreePreview(curriculumItem) : null}
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent>
              <div className="aspect-video mb-2 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl
                      : ""
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">₦ {studentViewCourseDetails?.pricing?.toLocaleString('en-NG')}</span>
              </div>
              <Button
                className={`w-full bg-[#2A3571] hover:bg-[#4a57a0] ${
                  isBuyNowLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  handleBuyNow(
                    studentViewCourseDetails?._id,
                    studentViewCourseDetails?.pricing,
                    userData.email,
                    studentViewCourseDetails?.title,
                    studentViewCourseDetails?.instructorId,
                    studentViewCourseDetails?.instructorName,
                    userData.residence,
                    studentViewCourseDetails?.image
                  )
                }
                disabled={isBuyNowLoading}
              >
                {isBuyNowLoading ? "Processing..." : "Buy Now"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[600px]">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer url={displayCurrentVideoFreePreview} width="450px" height="200px" />
          </div>
          <div className="flex flex-col gap-2">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, index) => (
                <p
                  key={index}
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="cursor-pointer text-[16px] font-medium"
                >
                  {filteredItem.title}
                </p>
              ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
