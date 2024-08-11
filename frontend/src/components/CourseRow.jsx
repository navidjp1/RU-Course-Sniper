import DeleteCourse from "./DeleteCourse";
function CourseRow({ course, status, updateRender }) {
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
        <tr className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200">
            <td className="px-4 py-8 ">
                <div className="flex flex-col items-start gap-1">
                    <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                        {course.title.split(": ")[1]}
                    </p>
                    <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal opacity-70">
                        {course.title.split(": ")[0]}
                    </p>
                </div>
            </td>
            <td className="px-4 py-8">
                <p className="block antialiased font-sans text-sm text-center leading-normal text-blue-gray-900 font-normal">
                    {course.id}
                </p>
            </td>
            <td className="px-4 py-8">
                <p className="block antialiased text-center font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                    {course.section}
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
                    <button className="h-9 w-full bg-blue-500			 rounded-md border text-center flex-center text-sm font-sans text-white border-blue-gray-50 p-1">
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

export default CourseRow;
