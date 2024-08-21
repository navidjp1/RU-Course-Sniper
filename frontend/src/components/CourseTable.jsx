import DeleteCourse from "./DeleteCourse";
import EditCoursesToDrop from "./EditCoursesToDrop";
export function CourseRow({ course, status, updateRender }) {
    const statusConfig = {
        1: {
            label: "Sniping",
            bgColor: "bg-green-500/20",
            textColor: "text-green-900",
            buttonMsg: "Stop Sniping",
        },
        2: {
            label: "Inactive",
            bgColor: "bg-red-500/20",
            textColor: "text-red-900",
            buttonMsg: "Start Sniping",
        },
        3: {
            label: "Waitlisted",
            bgColor: "bg-amber-500/20",
            textColor: "text-amber-900",
            buttonMsg: "???? (TBD)",
        },
    };

    const { label, bgColor, textColor, buttonMsg } = statusConfig[status] || {};

    return (
        <tr className="max-w-2xl mx-auto mt-16 rounded-3xl ring-1 ring-gray-200">
            <td className="px-4 py-8 ">
                <div className="flex flex-col items-start gap-1">
                    <p className="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900">
                        {course.title
                            ? course.title.split(": ")[1]
                            : "NO COURSE TITLE FOUND"}
                    </p>
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 opacity-70">
                        {course.title
                            ? course.title.split(": ")[0]
                            : "No Course Number Found"}
                    </p>
                    {/* <EditCoursesToDrop
                        currentDropIDs={course.dropIDs}
                    ></EditCoursesToDrop> */}

                    <EditCoursesToDrop
                        courseID={course.id}
                        currentDropIDs={course.dropIDs}
                    ></EditCoursesToDrop>

                    {/* <p className="block font-sans text-xs antialiased font-normal leading-normal text-blue-gray-900 opacity-70">
                        {course.dropIDs
                            ? `Courses to Drop: ${course.dropIDs}`
                            : "Courses to Drop: N/A"}
                    </p> */}
                </div>
            </td>
            <td className="px-4 py-8">
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-center text-blue-gray-900">
                    {course.id}
                </p>
            </td>
            <td className="px-4 py-8">
                <p className="block font-sans text-sm antialiased font-normal leading-normal text-center text-blue-gray-900">
                    {course.section ? course.section : "N/A"}
                </p>
            </td>
            <td className="px-4 py-8">
                <div className="w-full">
                    <div
                        className={`text-center relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none ${bgColor} ${textColor} py-1 px-2 text-xs rounded-md`}
                        style={{ opacity: "1" }}
                    >
                        <span className="">{label}</span>
                    </div>
                </div>
            </td>
            <td className="px-4 py-8">
                <div className="flex items-center gap-3">
                    <button className="w-full p-1 font-sans text-sm text-center text-white bg-blue-500 border rounded-md hover:bg-blue-800 h-9 flex-center border-blue-gray-50">
                        {buttonMsg}
                    </button>
                </div>
            </td>

            <td className="py-8 pl-2 pr-4">
                <DeleteCourse updateRender={updateRender} courseID={course} />
            </td>
        </tr>
    );
}

export function CourseTitle({ title, thStyles, pStyles }) {
    return (
        <th
            className={`${thStyles} px-4 py-4 border-y border-blue-gray-100 bg-blue-gray-50/50`}
        >
            <p
                className={` ${pStyles} block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70`}
            >
                {title}
            </p>
        </th>
    );
}
