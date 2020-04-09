library(sp)
library(rgdal)
library(maps)
library(dplyr)
library(sf)
library(tmap)
library(leafpop)
library(leaflet)
library(tmaptools)
library(tidyverse)
library(plyr)
library(classInt)
library(RColorBrewer)
library(geojsonio)
library(knitr)

#et the working directory
getwd()
#set it up locally
setwd("C:/Users/cex/Documents/Smart Cities and Urban Analytics/Term 2/SDC/Assessment")

#read in the points csv
points <- read.csv(file = 'Data/stops.csv')

#take out the metro stations
metro <- points[points$StopType == "MET",]
#take out the railway stations
rail <- points[points$StopType == "RLY", ]
#take out the bus stations
bus <- points[points$StopType == "BCT", ]
#take out the marked stations
bus1 <- bus[bus$BusStopType == "MKD", ] 
#get the msoa geojson
msoa <-  geojson_read("https://opendata.arcgis.com/datasets/29fdaa2efced40378ce8173b411aeb0e_2.geojson", what = "sp")
#check the projects
msoa@proj4string

#set the coordinates for rail as given by lat and long
coordinates(rail) <- c("Longitude", "Latitude") 
#set the proj string
proj4string(rail) <- CRS("+proj=longlat +datum=WGS84")
proj4string(rail) <- proj4string(msoa)

#plot mso file and rail on top
plot(msoa)
plot(rail, col = "red", add=TRUE)

#count rail in each msoa
rail_in <- over(rail, msoa)
#get the count as a table
rain_no <- table(rail_in$msoa11cd)

#repeat for metro and bus
coordinates(metro) <- c("Longitude", "Latitude") 

proj4string(metro) <- CRS("+proj=longlat +datum=WGS84")
proj4string(metro) <- proj4string(msoa)

plot(msoa)
plot(metro, col = "red", add=TRUE)

metro_in <- over(metro, msoa)

metro_no <- table(metro_in$msoa11cd)

coordinates(bus) <- c("Longitude", "Latitude") 

proj4string(bus) <- CRS("+proj=longlat +datum=WGS84")
proj4string(bus) <- proj4string(msoa)

plot(msoa)
plot(bus, col = "red", add=TRUE)

bus_in <- over(bus1, msoa)

bus_no <- table(bus1_in$msoa11cd)

#ste tables to dataframes
bus_df <- as.data.frame(bus_no)

metro_df <- as.data.frame(metro_no)

train_df <- as.data.frame(rain_no)

#export as csvs
write.csv(train_df, "Train locations.csv", row.names = FALSE)

write.csv(bus_df, "Data/Bus_locations.csv", row.names = FALSE)

write.csv(metro_df, "Data/Metro_locations.csv", row.names = FALSE)
