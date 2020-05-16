# Load the package
library(opentripplanner)
library(sf)
library(ggplot2)
library(tidyverse)

# OTP expects its data to be stored in a specific structure
# I create a new folder called Open-Trip-Planner in my wd
#dir.create() creates a subfolder called "OTP-Cairo-All"
path_data <- file.path("Open-Trip-Planner", "OTP-Cairo-All")
dir.create(path_data) 

# otp_dl_jar function will download the OTP and save it in the folder we created
# The function returns the path to the OTP jar file.
path_otp <- otp_dl_jar(path_data)

# The next step is to add the GTFS and OSM files to the creater folder. 
# Create a subfolder in OTP-Cairo-All called graphs then create a subfolder in graphs called default
# Add the OSM and GTFS inside 'default'
# I followed this structure:
# / OTP-Cairo-All             # Created Above
#   /graphs                     
#     /default            # Subfolder with the name of the router
#       osm.pbf              # Required OSM road map   - ADDED
#       router-config.json   # Optional config file    - NOT ADDED
#       build-config.json    # Optional config file    - NOT ADDED
#       gtfs.zip             # Optional GTFS data      - ADDED
#       dem.tif              # Optional Elevation data - NOT ADDED

# Building an OTP Graph
# This code will create a new file Graph.obj that will be saved in the location defined by path_data.
# log <- otp_build_graph(otp = path_otp, dir = path_data, analyst = TRUE) 
log <- otp_build_graph(otp = path_otp, dir = path_data, memory = 6000, analyst = TRUE)  
# to assign 6GB of memory to building graph. R assigns 2GB by default

# Launch OTP and load the graph
otp_setup(otp = path_otp, dir = path_data)

# connect r to otp
otpcon <- otp_connect()

# run 'importing H3 layer' r script to load data for next part. Scripts must be in the same folder
source("importing H3 layer.R")

# banned agencies as well as other arguments

routingOptions <- otp_routing_options()
routingOptions$bannedAgencies <- "CTA,NAT,CTA_M,P_O_14"
routingOptions <- otp_validate_routing_options(routingOptions)

#with routeOptions
test_iso  <- otp_isochrone(otpcon = otpcon,
                                fromPlace = c(h3_centroids$lon[568], h3_centroids$lat[568]),
                                mode = c("WALK", "TRANSIT"),
                                routingOptions = routingOptions,
                                maxWalkDistance = 700,
                                date_time = as.POSIXct(strptime("2019-08-05 09:00", "%Y-%m-%d %H:%M")),
                                cutoffSec = 3600)
      
#plot the isochrone
library(tmap)                       

# Build the map
map <- tm_shape(test_iso[1,4]) +         #row then column
            tm_borders() +
            tm_fill(col = "antiquewhite2")

# plot
map                               



#without routeOptions
test_iso_all  <- otp_isochrone(otpcon = otpcon,
                               fromPlace = c(h3_centroids$lon[550], h3_centroids$lat[550]),
                               mode = c("WALK", "TRANSIT"),
                               maxWalkDistance = 700,
                               date_time = as.POSIXct(strptime("2019-08-05 09:00", "%Y-%m-%d %H:%M")),
                               cutoffSec = 3600)



#plot the isochrone
library(tmap)                       
                
# Build the map
map <- tm_shape(test_iso_all[1,4]) +         #row then column
            tm_borders() +
            tm_fill(col = "antiquewhite2")
  
# plot
map                                



# LOOPING FUNCTION TO GET REACH ISOCHRONE OF EACH HEXAGON CENTROID

# variable with number of hexagons (for looping function)
nrows <- nrow(h3_centroids)

# empty list to store output
reachPolygons<-list()

# get reach polygon for each centroid and store in reachPolygons list
for (i in 1:nrows){
  reachPolygons[[i]] <- otp_isochrone(otpcon = otpcon,
                                      fromPlace = c(h3_centroids$lon[i], h3_centroids$lat[i]),
                                      mode = c("WALK", "TRANSIT"),
                                      maxWalkDistance = 1000,
                                      date_time = as.POSIXct(strptime("2019-08-05 09:00", "%Y-%m-%d %H:%M")),
                                      cutoffSec = 3600) # Cut offs in seconds
}

# Out of 1507 centroids, otp failed to get isochrones for 21

# plot(reachPolygons[[i]]) to check if polygon is created

# To close Java: 
# otp_stop()

# INTERSECTIONS
  # 1. Get the intersection geometry between each isochrone and each hexagon
  # 2. Get the total no. of jobs inside that intersection area

# empty list to store output
totalJobs <-list()

library(lwgeom) # for st_make_valid (this handles invalid geometries https://github.com/r-spatial/sf/issues/870)


# check reachPolygons[[272,273,274, 1225-1231]]
for (i in 1:nrows){
  totalJobs[[i]] <- 0    # there are some points that OTP couldn't route from. try() used to assign 0 value to these points
  try({
    totalJobs[[i]] <- reachPolygons[[i]] %>% 
      st_make_valid() %>%   # some geometries are invlid (this prevents an error)
      st_intersection(cairo_hexagons) %>%          # intersect reachPolygon with cairo_hexagons
      mutate(int_area = (st_area(.)/1000000) %>% as.numeric()) %>% # add column with intersection area with each hexagon
      mutate(int_jobs = (int_area/area)*jobsLFScou) %>% # int_jobs is the jobs intersected 
      summarise(total_jobs = sum(int_jobs))  # gets one value for jobs intersected by reachPolygon
  })
}

# this works but stops at reachPolgons[[40]]: try prevents it from stopping()
    # reachPolygons[[40]]: no applicable method for 'st_make_valid' applied to an object of class "character"
    # looked at reachPolygons[[40]]: org.opentripplanner.routing.error.VertexNotFoundException: vertices not found: [from] vertices not found: [from]
    # looks like otp can't route from that point -> MAYBE I NEED TO REVISIT OSM DATA BOUNDIX BOX


# get sum of greater cairo Region (GCR) jobs (sum of 'jobsLFScou' column in cairo_hexagons)
totalGCRjobs <- cairo_hexagons %>%
                summarize(sum(jobsLFScou))

# add two columns to cairo_hexagons layer
    # 1 - jobs_60_all = number of jobs reachable from hexagon within 60 minutes
            # # to access the jobs value totalJobs[[i]][[1]]
    # 2 - access_per_60_all = percentage of toal GCR jobs accessible from hexagon 
for (i in 1:nrows){
  cairo_hexagons$jobs_60_all[i] <- 0    #set default value = O: will be given to bad geometries
  try({
  cairo_hexagons$jobs_60_all[i] = totalJobs[[i]][[1]] # add totalJobs to new column in cairo_hexagons called jobs_60_all
  })
}

# percentage of jobs accessible from each hexagon
cairo_hexagons$access_per_60_all = ((cairo_hexagons$jobs_60_all/ sum(cairo_hexagons$jobsLFScou))*100)

# The analysis has been run twice: 1) All Public Transit modes and 2) Only formal Public Transit Modes

# Add a column showing the difference in job reach (i.e how much informal transit extends job reach)
cairo_hexagons$jobs_60_inf = cairo_hexagons$jobs_60_all - cairo_hexagons$jobs_60_formal

# the above gives negative values for 12 hexagons. These values are all close to 0. This is an otp issue since it does not
# make sense for isochrones to shrink when more transit options are available. To avoid negative values, I use a for 
# loop to replace them with zeros


for (i in 1:nrows){
  if (cairo_hexagons$jobs_60_all[i] < cairo_hexagons$jobs_60_formal[i]){
    cairo_hexagons$jobs_60_inf[i] = 0
  }
  else{
    cairo_hexagons$jobs_60_inf[i] = cairo_hexagons$jobs_60_all[i] - cairo_hexagons$jobs_60_formal[i]
  }
}

# sum(cairo_hexagons$jobs_60_inf == 0)
# use this to see if for loop works. Columns with zero values should have increase by 12. True


# Get additional % of jobs reached. 
cairo_hexagons$access_per_60_inf = cairo_hexagons$access_per_60_all - cairo_hexagons$access_per_60_formal
# The above will also give 12 negative values (same issue as jobs_60_inf). For loop used:
for (i in 1:nrows){
  if (cairo_hexagons$access_per_60_all[i] < cairo_hexagons$access_per_60_formal[i]){
    cairo_hexagons$access_per_60_inf[i] = 0
  }
  else{
    cairo_hexagons$access_per_60_inf[i] = cairo_hexagons$access_per_60_all[i] - cairo_hexagons$access_per_60_formal[i]
  }
}

# Calculate Accessibility Score for the entire Greater Cairo Region

# 1- weigh each hexagons accessibility score by its population (multiply them)
# 2- divide the sum by the total population of the GCR
# as.numeric used to return a number instead of a matrix

# Accessibility Using all Modes:
access_score_all <- as.numeric((cairo_hexagons$access_per_60_all %*% cairo_hexagons$pop2018cap) / sum(cairo_hexagons$pop2018cap))
jobs_reach_all <- as.numeric((cairo_hexagons$jobs_60_all %*% cairo_hexagons$pop2018cap) / sum(cairo_hexagons$pop2018cap))
# Accessibility Using Formal Modes Only
access_score_formal <- as.numeric((cairo_hexagons$access_per_60_formal %*% cairo_hexagons$pop2018cap) / sum(cairo_hexagons$pop2018cap))
jobs_reach_formal <- as.numeric((cairo_hexagons$jobs_60_formal %*% cairo_hexagons$pop2018cap) / sum(cairo_hexagons$pop2018cap))
# show all the values together
c(jobs_reach_formal, access_score_formal, jobs_reach_all, access_score_all)

# To test the above calculation  >> ALL GOOD 
#testHex <- cairo_hexagons
#weighted_access (% access score weighted by population) = access_score * percentage of population
#cairo_hexagons$weighted_access<- cairo_hexagons$access_per_60_all * (cairo_hexagons$pop2018cap/sum(cairo_hexagons$pop2018cap))
#access_score_all <- sum(cairo_hexagons$weighted_access)   # 4.7%


# GET THE SCORES AT THE REGIONAL LEVEL: CENTRAL INNER OUTER
library(dplyr)

cairo_df <- as.data.frame(cairo_hexagons) 
cairo_df %>% group_by(znng_t_) %>% 
  summarise(score_formal = (access_per_60_formal %*% pop2018cap) / sum(pop2018cap), # Regional score: formal transit modes
            score_all    = (access_per_60_all %*% pop2018cap) / sum(pop2018cap), # Regional score: all transit modes
            jobs_all     = (jobs_60_all %*% pop2018cap) / sum(pop2018cap),
            jobs_formal  = (jobs_60_formal %*% pop2018cap) / sum(pop2018cap),
            inc_abs      = (score_all - score_formal),   # accessibility increase
            inc_rel      = ((score_all - score_formal)/ score_formal)*100,   # % increase FROM formal modes TO all modes
            inc_factor   = (score_all/score_formal)) %>%    # increase as a multiple
   write.csv('regional scores.csv', row.names = F)  # save output as a csv # ADD %>% to row above

# POPULATION AND JOB REGIONAL LEVEL STATISTICS
cairo_df %>% group_by(znng_t_) %>% 
  summarise(area = sum(area),
            population = sum(pop2018cap),
            jobs = sum(jobsLFScou)) %>% 
  write.csv('regional statistics.csv', row.names = F)
            
            
