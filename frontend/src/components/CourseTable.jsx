import DeleteCourse from "./DeleteCourse";
import EditCoursesToDrop from "./EditCoursesToDrop";
export function CourseRow({ course, updateRender, isSniperRunning }) {
    const statusConfig = (status) => {
        var bgColor = "";
        var textColor = "";

        switch (status) {
            case "INACTIVE":
                bgColor = "bg-red-200";
                textColor = "text-red-800";
                break;
            case "SNIPING":
                bgColor = "bg-green-200";
                textColor = "text-green-900";
                break;
            case "WAITLISTED":
                bgColor = "bg-amber-200";
                textColor = "text-amber-900";
                break;
            case "REGISTERED":
                bgColor = "bg-green-200";
                textColor = "text-green-900";
                break;
            default:
                bgColor = "bg-gray-200";
                textColor = "text-gray-900";
        }

        return { bgColor, textColor };
    };

    const { bgColor, textColor } = statusConfig(course.status);

    return (
        <tr className="max-w-2xl mx-auto mt-16">
            <td className="px-4 py-8 ">
                <div className="flex flex-col items-start gap-1">
                    <p className="block text-sm antialiased font-bold leading-normal text-blue-gray-900">
                        {course.title
                            ? course.title.split(": ")[1]
                            : "NO COURSE TITLE FOUND"}
                    </p>
                    <p className="block text-sm antialiased font-normal leading-normal text-blue-gray-900 opacity-70">
                        {course.title
                            ? course.title.split(": ")[0]
                            : "No Course Number Found"}
                    </p>

                    <EditCoursesToDrop
                        courseID={course.id}
                        currentDropIDs={course.dropIDs}
                        isSniperRunning={isSniperRunning}
                    ></EditCoursesToDrop>
                </div>
            </td>
            <td className="px-4 py-8">
                <p className="block text-sm antialiased font-normal leading-normal text-center text-blue-gray-900">
                    {course.id}
                </p>
            </td>
            <td className="px-4 py-8">
                <p className="block text-sm antialiased font-normal leading-normal text-center text-blue-gray-900">
                    {course.section ? course.section : "N/A"}
                </p>
            </td>
            <td className="px-4 py-8">
                <div className="w-full">
                    <div
                        className={`text-center relative grid items-center  font-bold uppercase whitespace-nowrap select-none ${bgColor} ${textColor} py-1 px-2 text-xs rounded-md`}
                        style={{ opacity: "1" }}
                    >
                        <span className="">{course.status}</span>
                    </div>
                </div>
            </td>

            <td className="py-8 pl-2 pr-4">
                <DeleteCourse
                    updateRender={updateRender}
                    course={course}
                    isSniperRunning={isSniperRunning}
                />
            </td>
        </tr>
    );
}

export function CourseTitle({ title, thStyles, pStyles }) {
    return (
        <th
            className={`${thStyles} px-4 py-4 border-y border-rich-black bg-blue-gray-50/50 `}
        >
            <p
                className={` ${pStyles} block  text-sm antialiased leading-none font-semibold text-rich-black`}
            >
                {title}
            </p>
        </th>
    );
}
