async function getUserCurrentCourses(page) {
    const indexStrings = await page.evaluate(() => {
        const courseElements = document.querySelectorAll(".courses dt span");

        console.log(courseElements);

        return Array.from(courseElements).map((courseElement) => {
            const courseText = courseElement.innerText.split("\n");

            const indexString = courseText.find(
                (line) => line.includes("[") && line.includes("]")
            );

            const index = indexString.match(/\[(.*?)\]/)[1];

            return index;
        });
    });

    return indexStrings;
}

module.exports = {
    getUserCurrentCourses,
};
