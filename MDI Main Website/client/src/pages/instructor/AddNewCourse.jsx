import CourseCurriculum from "@/components/Instructor-view/AddNewCourse/courseCurriculum";
import CourseLanding from "@/components/Instructor-view/AddNewCourse/courseLanding";
import CourseSettings from "@/components/Instructor-view/AddNewCourse/courseSetting";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { AppContext } from "@/context/AppContext";
import { InstructorContext } from "@/context/InstructorContext";
import { addNewCourseListService, fetchInstructorCourseDetailsService, updateCourseByIdService } from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function AddNewCoursePage() {
  const { courseLandingFormData, courseCurriculumFormData, setCourseLandingFormData, setCourseCurriculumFormData, currentEditedCourseId, setCurrentEditedCourseId } = useContext(InstructorContext);
  const { userData, isLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const params = useParams();

  if (isLoading) {
    return <isLoading />;
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  }

  function validatedFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true; // found at least one free preview
      }
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: userData?._id,
      instructorName: userData?.name,
      instructorResidence: userData?.residence,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    try {
      const response = 
      currentEditedCourseId !== null ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData) :
      await addNewCourseListService(courseFinalFormData);

      if (response?.success) {
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        navigate(-1);
        toast.success(response.message);
      } else {
        toast.error("Failed to create course");
      }
    } catch (error) {
      toast.error("An error occurred while creating the course");
      console.error(error);
    }

    console.log(courseFinalFormData, "courseFinalFormData");
    
  }

  async function fetchInstructorCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);

    if (response?.success) {
      const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];
        return acc;
      }, {});
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }
  }

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchInstructorCourseDetails();
  }, [currentEditedCourseId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <Button
          disabled={!validatedFormData()}
          className="text-sm tracking-wider font-bold px-8"
          onClick={handleCreateCourse}
        >
          SUBMIT
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
