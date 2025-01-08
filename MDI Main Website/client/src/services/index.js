import axiosInstance from "@/api/axiosInstance";

export async function mediaUploadServices(formData, onProgressCallback) {
    const { data } = await axiosInstance.post("/media/upload", formData, {
        onUploadProgress: (ProgressEvent => {
            const percentCompleted = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total);
            onProgressCallback(percentCompleted);
        })
    });
    return data;
}

export async function mediaDeleteServices(id) {
    const { data } = await axiosInstance.delete(`/media/delete/${id}`);
    return data;
}

export async function fetchInstructorCourseListService() {
    const { data } = await axiosInstance.get(`/instructor/course/get`);
    return data;
}

export async function addNewCourseListService(formData) {
    const { data } = await axiosInstance.post(`/instructor/course/add`, formData);
    return data;
}

export async function fetchInstructorCourseDetailsService(id) {
    const { data } = await axiosInstance.get(`/instructor/course/get/details/${id}`);
    return data;
}

export async function updateCourseByIdService(id, formData) {
    const { data } = await axiosInstance.put(`/instructor/course/update/${id}`, formData);
    return data;
}

export async function mediaBulkUploadServices(formData, onProgressCallback) {
    const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
        onUploadProgress: (ProgressEvent => {
            const percentCompleted = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total);
            onProgressCallback(percentCompleted);
        })
    });
    return data;
}

export async function fetchStudentViewCourseListService(query) {
    const { data } = await axiosInstance.get(`/student/course/get?${query}`);
    return data;
}

export async function fetchStudentViewCourseDetailsService(courseId, studentId) {
    const { data } = await axiosInstance.get(`/student/course/get/details/${courseId}/${studentId}`);
    return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
    const { data } = await axiosInstance.get(`/student/courses-bought/get/${studentId}`);
    return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
    const { data } = await axiosInstance.get(
      `/student/course-progress/get/${userId}/${courseId}`
    );
  
    return data;
  }

  export async function markLectureAsViewedService(userId, courseId, lectureId) {
    const { data } = await axiosInstance.post(
      `/student/course-progress/mark-lecture-viewed`,
      {
        userId,
        courseId,
        lectureId,
      }
    );
  
    return data;
  }
  
  export async function resetCourseProgressService(userId, courseId) {
    const { data } = await axiosInstance.post(
      `/student/course-progress/reset-progress`,
      {
        userId,
        courseId,
      }
    );
  
    return data;
  }