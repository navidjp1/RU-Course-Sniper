from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import os


PATH =  os.getcwd() + '/chromedriver'

def runScraper(code):

    service = Service(executable_path=PATH)
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    driver = webdriver.Chrome(service=service, options=chrome_options)

    semester = '12025'
    campus = 'NB'
    level = 'U'
    # update above values based on desired attributes


    url = f'https://classes.rutgers.edu/soc/#school?code={code}&semester={semester}&campus={campus}&level={level}'

    driver.get(url)
    time.sleep(5)


    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")

    courses = soup.find_all(class_='subject')
    values = []
    for course in courses:
        idsAndNames = course.find_all(class_='highlighttext')
        courseID = idsAndNames[0].text
        courseName = idsAndNames[1].text

        sectionData = course.find_all(class_='sectionData')
        
        for section in sectionData:
            index = section.find(class_='sectionIndexNumber').text
            sectionNum = section.find(class_='sectionDataNumber').text
            courseData = []
            courseData.append(index)
            courseData.append(sectionNum)
            courseData.append(f'{courseID}: {courseName}')
            values.append(courseData)

        

    time.sleep(5)
    driver.quit()

    return values






    




