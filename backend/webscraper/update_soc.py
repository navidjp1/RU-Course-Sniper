import pandas as pd
import certifi
import os
from pymongo import MongoClient
from dotenv import load_dotenv 
from scraper import runScraper


'''
To Run:
Move to webscraper directory

In terminal:
source webscraperVenv/bin/activate 
python3 update_soc.py

To Exit: 

In terminal:
deactivate
'''

load_dotenv()

# todo: scrape website to get full list of school codes for that semester
codes = ['01', '03', '04', '05', '07', '09', '10', '11', '13', '14', '19', '30', '33', '37', '77']
all_data = []

for code in codes:
    values = runScraper(code)

    for row in values:
        all_data.append(row)  

    print(f"School code {code} scraped...")


columns = ["index", "section", "name"]

df = pd.DataFrame(all_data, columns=columns)

df = df.astype(str)


MONGO_URI = os.getenv('MONGO_URI')
DATABASE_NAME = 'main'
COLLECTION_NAME = 'Spring-2025' # change based on desired semester


try:
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]
    
    collection.insert_many(df.to_dict("records"))
    print(f"Data successfully uploaded to MongoDB collection '{COLLECTION_NAME}'.")

    client.close()

except Exception as e:
    print(f"An error occurred: {e}")

print("Program terminated")
