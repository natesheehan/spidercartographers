library(sf)
library(tidyverse)
library(tmap)
library(lwgeom) # for st_make_valid (this handles invalid geometries https://github.com/r-spatial/sf/issues/870)
library(Hmisc)

# import csv with data
data <- read_csv('Data/Rural_Urban/choropleth_map_data.csv')
#import spatial data
spatial <- st_read('Data/MSOA_shp/Middle_Layer_Super_Output_Areas__December_2011__Boundaries.shp')

# merge the data
merged <- merge(data, spatial, by.x = "MSOA", by.y = "msoa11cd") 

# transform back to sf and handle invalid geometries
merged <- merged %>% st_as_sf() %>% st_make_valid()

# PLOT LONDON DATA

london <- merged %>%
  filter(TCITY15NM == "London")

# check the geometry
plot(st_geometry(london))

# ----------------- Bus Stops -----------------

# breaks argument used instead of style
breaks = c(0, 5, 10, 20, 30, 100) 

bus <- tm_shape(london) +
          tm_fill("bus_stop_per_km2",
                  #style = "quantile",    # used instead of user defined breaks
                  breaks = breaks,
                  palette = 'GnBu', # for specific colors: c('#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba', '#253494')
                  #legend.hist = TRUE,
                  title = "Bus Stops \nPer km2") +
          tm_layout(title = "Bus Stop Density",        # add a title
                    title.size = 1.7,
                    title.color = "azure4",
                    title.position = c("left", "top"),
                    inner.margins = c(0.09, 0.10, 0.10, 0.08),    # increase map margins to make space for legend
                    fontfamily = 'Georgia',
                    #bg.color = "grey95",
                    frame = TRUE) +
          tm_borders(col = "grey40", lwd = 0.1)+
          tm_legend(title.size=0.9,
                    text.size = 0.6,
                    #frame = "grey",
                    position = c("right", "bottom")) +
          tm_scale_bar(color.dark = "gray60",
                       position = c("left", "bottom")) 

bus

tmap_save(tm = bus, filename = "Plots/choropleth maps/bus_map.png")

# ----------------- Metro Stations -----------------

describe(london$metro_stations_per_km2)

breaks = c(0, 1, 2, 3, 4, 5, 6) 

metro <- tm_shape(london) +
  tm_fill("metro_stations_per_km2",
          #style = "quantile",    # used instead of user defined breaks
          breaks = breaks,
          palette = 'GnBu', # for specific colors: c('#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba', '#253494')
          #legend.hist = TRUE,
          title = "Tube Stations \nPer km2") +
  tm_layout(title = "Tube Station Density",        # add a title
            title.size = 1.7,
            title.color = "azure4",
            title.position = c("left", "top"),
            inner.margins = c(0.09, 0.10, 0.10, 0.08),    # increase map margins to make space for legend
            fontfamily = 'Georgia',
            #bg.color = "grey95",
            frame = TRUE) +
  tm_borders(col = "grey40", lwd = 0.1)+
  tm_legend(title.size=0.9,
            text.size = 0.6,
            #frame = "grey",
            position = c("right", "bottom")) +
  tm_scale_bar(color.dark = "gray60",
               position = c("left", "bottom")) 

metro

tmap_save(tm = metro, filename = "Plots/choropleth maps/tube_map.png")

# ----------------- Car Ownership  -----------------

describe(london$HH_owning_cars)

breaks = c(0, 20, 40, 60, 80, 100) 

cars <- tm_shape(london) +
  tm_fill("HH_owning_cars",
          style = "pretty",    # used instead of user defined breaks
          #breaks = breaks,
          palette = 'GnBu', # for specific colors: c('#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba', '#253494')
          #legend.hist = TRUE,
          title = "% of Households \nOwning Cars ") +
  tm_layout(title = "Car Ownership",        # add a title
            title.size = 1.7,
            title.color = "azure4",
            title.position = c("left", "top"),
            inner.margins = c(0.09, 0.10, 0.10, 0.08),    # increase map margins to make space for legend
            fontfamily = 'Georgia',
            #bg.color = "grey95",
            frame = TRUE) +
  tm_borders(col = "grey40", lwd = 0.1)+
  tm_legend(title.size=0.9,
            text.size = 0.6,
            #frame = "grey",
            position = c("right", "bottom")) +
  tm_scale_bar(color.dark = "gray60",
               position = c("left", "bottom")) 

cars

tmap_save(tm = cars, filename = "Plots/choropleth maps/car_ownership_map.png")


# ----------------- Bus Usage -----------------

describe(london$bus_perc)

breaks = c(0, 20, 40, 60, 80, 100) 

bus_commute <- tm_shape(london) +
      tm_fill("bus_perc",
              style = "pretty",    # used instead of user defined breaks
              #breaks = breaks,
              palette = 'GnBu', # for specific colors: c('#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba', '#253494')
              #legend.hist = TRUE,
              title = "Bus Mode \nShare (%)") +
      tm_layout(title = "% of Residents \nCommuting By Bus",        # add a title
                title.size = 1.7,
                title.color = "azure4",
                title.position = c("left", "top"),
                inner.margins = c(0.09, 0.10, 0.10, 0.08),    # increase map margins to make space for legend
                fontfamily = 'Georgia',
                #bg.color = "grey95",
                frame = TRUE) +
      tm_borders(col = "grey40", lwd = 0.1)+
      tm_legend(title.size=0.9,
                text.size = 0.6,
                #frame = "grey",
                position = c("right", "bottom")) +
      tm_scale_bar(color.dark = "gray60",
                   position = c("left", "bottom")) 

bus_commute

tmap_save(tm = bus_commute, filename = "Plots/choropleth maps/bus_mode_share_map.png")


# ----------------- Metro Usage -----------------


describe(london$underground_metro_perc)

breaks = c(0, 20, 40, 60, 80, 100) 

metro_commute <- tm_shape(london) +
  tm_fill("underground_metro_perc",
          style = "pretty",    # used instead of user defined breaks
          #breaks = breaks,
          palette = 'GnBu', # for specific colors: c('#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba', '#253494')
          #legend.hist = TRUE,
          title = "Metro Mode \nShare (%)") +
  tm_layout(title = "% of Residents \nCommuting By Metro",        # add a title
            title.size = 1.5,
            title.color = "azure4",
            title.position = c("left", "top"),
            inner.margins = c(0.09, 0.10, 0.10, 0.08),    # increase map margins to make space for legend
            fontfamily = 'Georgia',
            #bg.color = "grey95",
            frame = TRUE) +
  tm_borders(col = "grey40", lwd = 0.1)+
  tm_legend(title.size=0.9,
            text.size = 0.6,
            #frame = "grey",
            position = c("right", "bottom")) +
  tm_scale_bar(color.dark = "gray60",
               position = c("left", "bottom")) 

metro_commute

tmap_save(tm = metro_commute, filename = "Plots/choropleth maps/metro_mode_share_map.png")
