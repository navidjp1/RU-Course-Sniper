// const SEMESTER = "Spring-2026";
// const SEMESTER_SELECTION = "#semesterSelection4";
const URL = "https://sims.rutgers.edu/webreg/pacLogin.htm";

const getSemesterSelector = async (page) => {
    const SEMESTER_NAME = "spring 2026"; // change depending on semester
    const selector = await page.evaluate((semester) => {
        const labels = document.querySelectorAll('label[for^="semesterSelection"]');

        for (const label of labels) {
            const labelText = label.textContent.trim().toLowerCase();
            if (labelText.includes(semester.toLowerCase())) {
                return `#${label.getAttribute("for")}`;
            }
        }

        return null;
    }, SEMESTER_NAME);

    if (!selector) {
        throw new Error(`Could not find semester selector for: ${SEMESTER_NAME}`);
    }

    return selector;
};

export { URL, getSemesterSelector };
