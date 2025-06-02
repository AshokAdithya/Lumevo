import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from fastapi import FastAPI
from pydantic import BaseModel

app=FastAPI()

class Item(BaseModel):
    country_name:str | None=None
    course: str | None=None

@app.get("/get-countries-courses")
async def get_countries_course():
    options=Options()
    options.add_argument('--headless')
    options.add_argument("--ignore-certificate-error")
    options.add_argument("--ignore-ssl-errors")
    driver=webdriver.Chrome(options=options)

    url="https://www.timeshighereducation.com/world-university-rankings/latest/world-ranking"
    driver.get(url)

    country=driver.find_element(By.XPATH,'//*[@id="location_chosen"]/ul/li/input')
    country.click()

    countries_ul=driver.find_element(By.XPATH,'//*[@id="location_chosen"]/div/ul')
    countries_li=countries_ul.find_elements(By.TAG_NAME,"li")
    countries_list=[]
    course_list=[]

    for option in countries_li:
        countries_list.append(option.text)

    course_dropdown = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="subjects_chosen"]/a'))
        )
    course_dropdown.click()  
        
    course_ul=driver.find_element(By.XPATH,'//*[@id="subjects_chosen"]/div/ul')

    course_li=course_ul.find_elements(By.TAG_NAME,"li")

    for option in course_li:
        course_list.append(option.text)

    driver.quit()
    
    return {"countries_list":countries_list,"course_list":course_list}


@app.post("/")
async def get_results_input(item:Item):
    print(item.country_name,item.course)
    options=Options()
    options.add_argument("--ignore-certificate-error")
    options.add_argument("--ignore-ssl-errors")
    options.add_argument('--headless')
    driver=webdriver.Chrome(options=options)

    url="https://www.timeshighereducation.com/world-university-rankings/latest/world-ranking"
    driver.get(url)

    if(item.country_name!=""):
        country=driver.find_element(By.XPATH,'//*[@id="location_chosen"]/ul/li/input')
        country.click()
        country.send_keys(item.country_name)
        country.send_keys(Keys.ENTER)

    if (item.course!=""):
        course_dropdown = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="subjects_chosen"]/a'))
        )
        course_dropdown.click()  
        
        course_input = driver.find_element(By.XPATH, '//*[@id="subjects_chosen"]/div/div/input')
        course_input.send_keys(item.course)  
        course_input.send_keys(Keys.ENTER) 

    wait = WebDriverWait(driver, 10)
    university_list=[]

    # Getting Scores
    table = wait.until(EC.presence_of_element_located((By.ID, 'datatable-1')))
    
    headers = []
    header_row = table.find_element(By.TAG_NAME, "thead").find_elements(By.TAG_NAME, "th")
    for header in header_row:
        headers.append(header.text.strip())
    
    table=driver.find_element(By.ID,'datatable-1')
    
    rows=table.find_elements(By.TAG_NAME,"tr")
    
    for row in rows:
        cells=row.find_elements(By.TAG_NAME,"td")
        dicty={}
        for i,cell in enumerate(cells):
            if i==1:
                name_country = cell.find_element(By.TAG_NAME, "a")
                name = name_country.text.strip()
                link = name_country.get_attribute("href")  
                name1=headers[i].split("\n")[0]
                name2=headers[i].split("\n")[1]
                dicty["link"]=link
                dicty[name1]=cell.text.split("\n")[0]
                dicty[name2]=cell.text.split("\n")[1]
            else:
                dicty[headers[i]]=cell.text
        university_list.append(dicty)
    
    #Getting Stats
    stats_button=driver.find_element(By.XPATH,'//*[@id="block-system-main"]/div/div[3]/div/div[1]/div[1]/div/div[1]/ul/li[2]/label/span')
    driver.execute_script("arguments[0].click();", stats_button)
    
    table = WebDriverWait(driver, 1).until(
        EC.presence_of_element_located((By.ID, 'datatable-1')) 
    )
    headers = []
    header_row = table.find_element(By.TAG_NAME, "thead").find_elements(By.TAG_NAME, "th")
    
    for header in header_row:
        headers.append(header.text.strip())
    
    rows=table.find_elements(By.TAG_NAME,"tr")
    
    for j,row in enumerate(rows):
        cells=row.find_elements(By.TAG_NAME,"td")
        for i,cell in enumerate(cells):
            if(i==0 or i==1):continue
            else:
                university_list[j][headers[i]]=cell.text

    driver.quit()

    return {"list":university_list[1:]}
    