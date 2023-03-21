from datetime import datetime
import selenium
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from bs4 import BeautifulSoup


#launch url
url = "https://iaa.gov.il"
iaaUrlArvl = "https://www.iaa.gov.il/airports/ben-gurion/flight-board/?flightType=arrivals"

airportiaUrlArvl = 'https://www.airportia.com/israel/ben-gurion-international-airport/arrivals/'
airportiaUrlDept = 'https://www.airportia.com/israel/ben-gurion-international-airport/departures/'


def getFlights():
    # create a new Edge session
    options = Options()
    options = webdriver.ChromeOptions()
    options.add_argument('--ignore-ssl-errors=yes')
    options.add_argument('--ignore-certificate-errors')
    driver = webdriver.Remote(command_executor='http://selenium:4444/wd/hub',options=options,desired_capabilities=DesiredCapabilities.CHROME)
    # driver.minimize_window()
    # Open Airportia Arivals website
    driver.get(airportiaUrlArvl)
    #seelct Date
    date = driver.find_element(by=By.ID,value='airport_arrivals_date_range_date')
    date.click()
    mydate = date.find_element(by=By.TAG_NAME,value='option')
    mydate.click()
    Fdate = date.text
    #Select from time
    fTime = driver.find_element(by=By.ID,value='airport_arrivals_date_range_from_time')
    myfTime = fTime.find_element(by=By.TAG_NAME,value='option')
    myfTime.click()
    #Select to Time
    tTime = driver.find_element(by=By.ID,value='airport_arrivals_date_range_to_time')
    tTime.click()
    tTime.send_keys('23')
    tTime.click()
    #GO
    searchBtn = driver.find_element(by=By.ID,value='airport_arrivals_go')
    searchBtn.click()
    driver.implicitly_wait(3)
    #Click to show all flights
    searchBtn = driver.find_element(by=By.XPATH,value='//div [text()="Show More Flights ⌄"]')
    searchBtn.click()
    Arivals = driver.page_source

    # -------------------------------------------------------------------------------------------------------

    # Open Airportia Depatrutes website
    driver.get(airportiaUrlDept)
    #seelct Date
    date = driver.find_element(by=By.ID,value='airport_departures_date_range_date')
    date.click()
    mydate = date.find_element(by=By.TAG_NAME,value='option')
    mydate.click()
    #Select from time
    fTime = driver.find_element(by=By.ID,value='airport_departures_date_range_from_time')
    myfTime = fTime.find_element(by=By.TAG_NAME,value='option')
    myfTime.click()
    #Select to Time
    tTime = driver.find_element(by=By.ID,value='airport_departures_date_range_to_time')
    tTime.click()
    tTime.send_keys('23')
    tTime.click()
    #GO
    searchBtn = driver.find_element(by=By.ID,value='airport_departures_go')
    searchBtn.click()
    driver.implicitly_wait(3)
    #Click to show all flights
    searchBtn = driver.find_element(by=By.XPATH,value='//div [text()="Show More Flights ⌄"]')
    searchBtn.click()
    departures = driver.page_source

    driver.quit()

    aeroCompanies = ["UX","IB","AI","IZ","B2","WZ","QS","EY","5F","3F","J2","HY","CY","A9","ET","FB","VY"]
    flights = {"flights":[]}

    counter = 0
    arvl_soup = BeautifulSoup(Arivals,features="html.parser")
    flights_parents = arvl_soup.find_all(attrs={"class": "flightsTable-parentFlight"})
    flights_stripes = arvl_soup.find_all(attrs={"class": "flightsTable--stripe"})
    res = [flights_parents,flights_stripes]
    for kind in res:
        for flight in kind:
            if flight.find(attrs={"class": "flightsTable-number"}) != None:
                for company in aeroCompanies:
                    if company in flight.find(attrs={"class": "flightsTable-number"}).a.getText():
                        number = flight.find(attrs={"class": "flightsTable-number"}).a.getText()
                        if len(flight.find_all('td')) > 2:
                            dest = flight.find_all('td')[1].a.getText()[-1:-4:-1][::-1]
                            time = flight.find_all('td')[3].getText()
                            fTime = datetime(year=int(Fdate[-1:-5:-1][::-1]),month=int(Fdate[7:9]),day=int(Fdate[4:6]),hour=int(time[:2]),minute=int(time[3:5]))
                            for i in flights["flights"]:
                                if i["flightNum"] == number:
                                    counter += 1
                            if counter == 0:
                                flights["flights"].append({"flightNum":number,"dest":dest,"stdLocal":f"{fTime.year}-{fTime.month}-{fTime.day}T{fTime.timetz()}.000000+02:00","type":"A","aircraftType":"TBA","aircraftReg":"TBA","gate":"TBA","pit":"TBA"})

    counter = 0
    dept_soup = BeautifulSoup(departures,features="html.parser")
    flights_parents = dept_soup.find_all(attrs={"class": "flightsTable-parentFlight"})
    flights_stripes = dept_soup.find_all(attrs={"class": "flightsTable--stripe"})
    res = [flights_parents,flights_stripes]
    for kind in res:
        for flight in kind:
            if flight.find(attrs={"class": "flightsTable-number"}) != None:
                for company in aeroCompanies:
                    if company in flight.find(attrs={"class": "flightsTable-number"}).a.getText():
                        number = flight.find(attrs={"class": "flightsTable-number"}).a.getText()
                        if len(flight.find_all('td')) > 2:
                            dest = flight.find_all('td')[1].a.getText()[-1:-4:-1][::-1]
                            time = flight.find_all('td')[3].getText()
                            fTime = datetime(year=int(Fdate[-1:-5:-1][::-1]),month=int(Fdate[7:9]),day=int(Fdate[4:6]),hour=int(time[:2]),minute=int(time[3:5]))
                            for i in flights["flights"]:
                                if i["flightNum"] == number:
                                    counter += 1
                            if counter == 0:
                                    flights["flights"].append({"flightNum":number,"dest":dest,"stdLocal":f"{fTime.year}-{fTime.month}-{fTime.day}T{fTime.timetz()}.000000+02:00","type":"D","aircraftType":"TBA","aircraftReg":"TBA","gate":"TBA","pit":"TBA"})
    return flights