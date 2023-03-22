#!/bin/bash

# Start Selenium
java -Dwebdriver.chrome.driver=/usr/bin/chromedriver -jar /opt/selenium/selenium-server.jar standalone --port 4444 &
sleep 5