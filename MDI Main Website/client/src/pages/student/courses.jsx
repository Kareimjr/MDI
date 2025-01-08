import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { filterOptions, sortOptions } from "@/config";
import { StudentContext } from "@/context/StudentContext";
import { fetchStudentViewCourseListService } from "@/services";
import { ArrowUpDown, Check } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function StudentViewCoursesPage() {
    const [sort, setSort] = useState('');
    const navigate = useNavigate();
    const [filter, setFilter] = useState({});
    const [searchParam, setSearchParam] = useSearchParams();
    const { studentViewCoursesList, setStudentViewCoursesList, isLoading, setIsLoading } = useContext(StudentContext);

    function handleFilterOnChange(getSectionId, getCurrentOption) {
        let cpyFilter = { ...filter };
        const indexOfcurrentSection = Object.keys(cpyFilter).indexOf(getSectionId);
        if (indexOfcurrentSection === -1) {
            cpyFilter = {
                ...cpyFilter,
                [getSectionId]: [getCurrentOption.id]
            }
        } else {
            const indexOfCurrentOption = cpyFilter[getSectionId].indexOf(getCurrentOption.id);
            if (indexOfCurrentOption === -1) {
                cpyFilter[getSectionId].push(getCurrentOption.id);
            } else {
                cpyFilter[getSectionId].splice(indexOfCurrentOption, 1);
            }
        }
        setFilter(cpyFilter);
        sessionStorage.setItem('filter', JSON.stringify(cpyFilter));
    }

    function createSearchParamsHelper(filterParams) {
        const queryParams = [];
        for (const [key, value] of Object.entries(filterParams)) {
            if (Array.isArray(value) && value.length > 0) {
                const paramValue = value.join(',');
                queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
            }
        }
        return queryParams.join('&');
    }

    async function fetchAllStudentViewCourses(filter, sort) {
        const query = new URLSearchParams({
            ...filter,
            sortBy: sort
        }).toString();
        const response = await fetchStudentViewCourseListService(query);
        if (response?.success) {
                setStudentViewCoursesList(response.data);
                setIsLoading(false);
            };
    }

    useEffect(() => {
        const buildQueryStringForFilters = createSearchParamsHelper(filter);
        setSearchParam(new URLSearchParams(buildQueryStringForFilters));
    }, [filter]);

    useEffect(() => {
        setSort('')
        setFilter(JSON.parse(sessionStorage.getItem('filter')) || {});
    },[])

    useEffect(() => {
        if (filter !== null && sort !== null) {
            fetchAllStudentViewCourses(filter, sort);
        }
    }, [filter, sort]);

    useEffect(() => { 
        return () => {
            sessionStorage.removeItem('filter');
        }
      },[])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">All Courses</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <aside className="w-full md:w-64 space-y-4">
                    <div className="space-y-2">
                        {
                            Object.keys(filterOptions).map(keyItem => (
                                <div className="p-1" key={keyItem}>
                                    <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                                    <div className="grid gap-2 mt-2">
                                        {
                                            filterOptions[keyItem].map(option => (
                                                <Label className="flex font-medium items-center gap-3" key={option.id}>
                                                    <Checkbox
                                                        checked={
                                                            filter &&
                                                            Object.keys(filter).length > 0 && filter[keyItem] &&
                                                            filter[keyItem].indexOf(option.id) > -1
                                                        }
                                                        onCheckedChange={() => handleFilterOnChange(keyItem, option)}
                                                    />
                                                    {option.label}
                                                </Label>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </aside>
                <main className="flex-1">
                    <div className="flex justify-end items-center mb-4 gap-5">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2 p-4">
                                    <ArrowUpDown className="h-4 w-4" />
                                    <span className="text-[16px] font-medium">Sort By</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                                    {
                                        sortOptions.map(sortItem =>
                                            <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                                                {sortItem.label}
                                            </DropdownMenuRadioItem>)
                                    }

                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="text-sm text-black font-bold">{studentViewCoursesList.length} Results</span>
                    </div>
                    <div className="space-y-4">
                        {
                            isLoading && <Loading/>
                        }
                        {
                            studentViewCoursesList && studentViewCoursesList.length > 0 ? studentViewCoursesList.map(courseItem => (
                                <Card onClick={()=>navigate(`/student/course/details/${courseItem?._id}`)} className="cursor-pointer bg-transparent hover:scale-105 transition-transform duration-300 ease-in-out" key={courseItem?._id}>
                                    <CardContent className="flex gap-4 p-4">
                                        <div className="w-48 h-32 flex-shrink-0">
                                            <img src={courseItem?.image} className="w-full h-full object-cover rounded-sm" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-2">{courseItem?.title}</CardTitle>
                                            <p className='text-sm text-gray-500 mb-1'>Created By <span className="font-bold">{courseItem?.instructorName}</span></p>
                                            <p className="text-[15px] text-gray-500 mt-3 mb-2">
                                                {
                                                    `${courseItem?.curriculum?.length} 
                                                    ${courseItem?.curriculum?.length <= 1 ? 'Lecture' : "Lectures"} - ${courseItem.level.toUpperCase()} `
                                                }
                                            </p>
                                            <p className='font-bold text-lg'>₦ {(courseItem?.pricing).toLocaleString('en-NG')}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : <h1 className="font-extrabold text-4xl">No Courses Found</h1>
                        }
                    </div>
                </main>
            </div>
        </div>
    );
}

export default StudentViewCoursesPage;
