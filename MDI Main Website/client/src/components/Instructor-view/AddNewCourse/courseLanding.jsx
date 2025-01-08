import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/InstructorContext";
import { useContext, useEffect } from "react";

function CourseLanding() {
    const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext);

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Course Landing Page</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormControls
                        formControls={courseLandingPageFormControls}
                        formData={courseLandingFormData}
                        setFormData={setCourseLandingFormData}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default CourseLanding;
