import MediaProgressBar from "@/components/mediaProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/VideoPlayer";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/InstructorContext";
import { mediaBulkUploadServices, mediaDeleteServices, mediaUploadServices } from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";


function CourseCurriculum() {

    const { courseCurriculumFormData, setCourseCurriculumFormData, mediaUploadProgress, setMediaUploadProgress, mediaUploadProgressPercentage, setMediaUploadProgressPercentage } = useContext(InstructorContext);

    const bulkUploadInputRef =useRef(null);


    function handleNewLecture() {
        setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            {
                ...courseCurriculumInitialFormData[0]
            }])
    }

    function handleCourseTitleChange(event, currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            title: event.target.value
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }


    function handleFreePreviewChange(checked, currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            freePreview: checked,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    async function handleSingleLectureUpload(event, currentIndex) {
        console.log(event.target.files);
        const selectedFile = event.target.files[0]
        if (selectedFile) {
            const videoFormData = new FormData();
            videoFormData.append('file', selectedFile);
    
            try {
                setMediaUploadProgress(true);
                const response = await mediaUploadServices(videoFormData, setMediaUploadProgressPercentage)
                if (response.success) {
                    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
                    cpyCourseCurriculumFormData[currentIndex] = {
                        ...cpyCourseCurriculumFormData[currentIndex],
                        videoUrl: response?.data?.url,
                        public_id: response?.data?.public_id
                    }
                    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
                    setMediaUploadProgress(false)
                } else {
                    console.error("Upload failed:", response.message);
                    setMediaUploadProgress(false);
                }
            } catch (error) {
                console.error("Error during upload:", error);
                setMediaUploadProgress(false);
            }
        }
    }
    
    function isCourseCurriculumFormDataValid () {
        return courseCurriculumFormData.every(item=> {
            return (item && typeof item === 'object' && 
            item.title.trim() !== "" &&
            item.videoUrl.trim() !== ""
        )})
    }

    async function handleReplaceVideo(currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const getCurrentVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id;

        const deleteCurrentMediaResponse = await mediaDeleteServices(getCurrentVideoPublicId)

        console.log(deleteCurrentMediaResponse);
        
        if(deleteCurrentMediaResponse?.success){
            cpyCourseCurriculumFormData[currentIndex]={
                ...cpyCourseCurriculumFormData[currentIndex],
                videoUrl : "",
                public_id: "",
            }

            setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        }
    }

    function handleOpenBulkUploadDialog(){
        bulkUploadInputRef.current?.click();
    }

    function areAllCourseCurriculumFormDataObjectsEmpty (arr){

        return arr.every((obj)=>{
            return Object.entries(obj).every(([key, value])=>{
                if(typeof value === 'boolean'){
                    return true
                }
                return value === ''
            })
        })
    }

    async function handleMediaBulkUpload(event) {
        const selectedFiles = Array.from(event.target.files);
        const bulkFormData = new FormData()

        selectedFiles.forEach(fileItem => bulkFormData.append('files',fileItem));

        try {
            setMediaUploadProgress(true);
            const response = await mediaBulkUploadServices(bulkFormData, setMediaUploadProgressPercentage)

            console.log(response, "Bulk");
            if(response?.success){
                let cpyCourseCurriculumFormData = areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData) ? [] : [...courseCurriculumFormData];

                 cpyCourseCurriculumFormData = [...cpyCourseCurriculumFormData,
                    ...response?.data.map((item, index)=>({
                        videoUrl : item?.url,
                        public_id : item?.public_id,
                        title :`Lecture ${cpyCourseCurriculumFormData.length + (index+1)}`,
                        freePreview : false
                    }))
                 ]
                 setCourseCurriculumFormData(cpyCourseCurriculumFormData)
                 setMediaUploadProgress(false);
            }
            
        } catch (error) {
            console.log(error)
        }
        console.log(selectedFiles);
        
    }

    async function handleDeleteLecture(currentIndex) {
        let cpyCourseCurriculumFormData  = [...courseCurriculumFormData];
        const getCurrentSelectedVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id

        const response =await mediaDeleteServices(getCurrentSelectedVideoPublicId);

        if(response?.success){
            cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter((_,index)=> index !== currentIndex);
            setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        }
        
    }

    return (
        <div>
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle>Create course Curriculum</CardTitle>
                    <div>
                        <input type="file"
                        ref={bulkUploadInputRef}
                        accept="video/*"
                        multiple
                        className="hidden"
                        id="bulk-media-upload"
                        onChange={handleMediaBulkUpload}
                        />
                        <Button 
                        as="label"
                        htmlFor="bulk-media-upload"
                        varient ="outline"
                        className="cursor-pointer"
                        onClick={handleOpenBulkUploadDialog}
                        >
                            <Upload className=" w-4 h-5 mr-2"/>
                            Bulk Upload
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress} onClick={handleNewLecture}>Add Lecture</Button>
                    {
                        mediaUploadProgress ? 
                        <MediaProgressBar isMediaUploading={mediaUploadProgress} progress={mediaUploadProgressPercentage}/> : null
                    }
                    <div className="mt-4 space-y-4">
                        {
                            courseCurriculumFormData.map((curriculumItem, Index) => (
                                <div className="border p-5 rounded-md" key={Index}>
                                    <div className="flex gap-5 items-center">
                                        <h3 className="font-semibold">Lecture {Index + 1}</h3>
                                        <Input
                                            name="title"
                                            placeholder="Enter lecture title"
                                            className="max-w-96"
                                            onChange={(event) => handleCourseTitleChange(event, Index)}
                                            value={courseCurriculumFormData[Index]?.title}
                                        />
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                onCheckedChange={(value) => handleFreePreviewChange(value, Index)}
                                                checked={courseCurriculumFormData[Index]?.freePreview}
                                                id={`freePreview-${Index + 1}`}
                                            />
                                            <Label htmlFor="freePreview">Free Preview</Label>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        {
                                            courseCurriculumFormData[Index]?.videoUrl ? 
                                            <div className=" flex gap-3">
                                                    <VideoPlayer url={courseCurriculumFormData[Index]?.videoUrl}
                                                    width="450px"
                                                    height="200px"
                                                    />
                                                    <Button onClick={()=>handleReplaceVideo(Index)}>Replace Video</Button>
                                                    <Button
                                                    onClick={()=>handleDeleteLecture(Index)}
                                                    className=" bg-red-900">Delete Lecture</Button>
                                            </div> :
                                            <Card>
                                            <Input type="file" accept="video/*"
                                                onChange={(event) => handleSingleLectureUpload(event, Index)}
                                            />
                                        </Card>
                                        }
                                        
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default CourseCurriculum;
