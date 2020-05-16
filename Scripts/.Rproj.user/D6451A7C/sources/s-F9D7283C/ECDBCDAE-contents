# PLOTTING
# RUN open-trip-planner.R to add accessibility columns to h3 hexagons layer 

# import shapefiles for visuals 
library(sf)
# to plot metro as line
cairo_metro <- st_read("Cairo Shapefiles/Metro_Trips_TfC.shp")
# to add text labels for the new towns on the outskirts
cairo_new_towns <- st_read("Cairo Shapefiles/Central-Inner_Shiyakha_NDC_CAPMAS.shp") %>% 
                        filter(zoning_tfc == "Outer")
# Remove 10th of Ramadan City and Giza_Outer Labels)
cairo_new_towns <- cairo_new_towns[!duplicated(cairo_new_towns$name_citya),] %>% 
  filter(!grepl('Giza_Outer|10th of Ramdan', name_citya))


# to add a basemap - these are used later in tm_shape
#bb = c(30.801369, 29.705080, 31.874483, 30.390664)
#c_osm <- tmaptools::read_osm(bb, ext = 1.05, type = "stamen-toner")  # apple-iphoto, esri-topo, 

# breaks argument used instead of style
breaks = c(0, 10000, 20000, 100000, 500000, 1000000, 2500000)  

map_60_all <-
  #tm_shape(c_osm) +
    #tm_rgb() +
  tm_shape(cairo_hexagons) +
      tm_fill("jobs_60_all",
              #style = "jenks",    # used instead of user defined breaks
              breaks = breaks,
              palette = 'GnBu',        # for specific colors: c('#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba', '#253494')
              #legend.hist = TRUE,
              title = "Jobs Within 60 min \n(Public Transit, AM Peak)") +
      tm_layout(title = "Accessibility Across the GCR",        # add a title
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
                   position = c("left", "bottom")) +
      tm_compass(type = "arrow", position = c("right", "top"), size = 1.5) +
  tm_shape(cairo_metro) + 
      tm_lines(col = 'firebrick4', lwd = 1.5, alpha = 0.8) +
  tm_add_legend(type = "line", labels = 'Cairo Metro', col = 'firebrick4', lwd = 1.5) + 
  tm_shape(cairo_new_towns) + 
      tm_text(text = "name_citya", col = 'black', size = 0.7, 
              alpha = 0.7, bg.color = "white", bg.alpha = 0.5)

map_60_all  
tmap_save(tm = map_60_all, filename = "Visuals/access_60_all.png")


# FACET MAP
map_60_both <-
  #tm_shape(c_osm) +
  #tm_rgb() +
  tm_shape(cairo_hexagons) +
      tm_fill(c("jobs_60_all", "jobs_60_formal"),
              #style = "jenks",    # used instead of user defined breaks
              breaks = breaks,
              palette = "GnBu",
              #legend.hist = TRUE,
              title = "Jobs Reachable \nin 60 min (AM Peak)") +
      tm_layout(title = c("All Public Transit", "Formal Public Transit"),        # add a title
                title.size = 1.2,
                title.position = c("left", "top"),
                title.color = "azure4",
                inner.margins = c(0.09, 0.10, 0.10, 0.08),    # increase map margins to make space for legend
                fontfamily = 'Georgia',
                #bg.color = "antiquewhite",
                frame = TRUE) +
      tm_borders(col = "grey40", lwd = 0.1)+
      tm_legend(title.size=0.7,
                text.size = 0.5,
                #frame = "grey",
                position = c("right", "bottom")) +
      tm_scale_bar(color.dark = "gray60",
                   position = c("left", "bottom")) +
      tm_compass(type = "arrow", position = c("right", "top"), size = 1.5) +
  tm_shape(cairo_metro) + 
      tm_lines(col = 'firebrick4', lwd = 1, alpha = 0.8) +
  # add legend for the metro
  tm_add_legend(type = "line", labels = 'Cairo Metro', col = 'firebrick4', lwd = 1) +
  # two plots together on one row
  tm_facets(ncol = 1)

map_60_both 
tmap_save(tm = map_60_both, filename = "Visuals/access_60_both.png")


# MAP SHOWING THE DIFFERENCE 
breaks_diff = c(0, 100, 20000, 100000, 500000, 1000000)  

map_60_diff <-
  #tm_shape(c_osm) +
  #tm_rgb() +
  tm_shape(cairo_hexagons) +
      tm_fill("jobs_60_inf",
              #style = "pretty",    # used instead of user defined breaks
              breaks = breaks_diff,
              palette = "OrRd",
              #legend.hist = TRUE,
              title = "Additional Jobs Reached \nWhen Using Informal Transit") +
      tm_layout(title = "Effect of Informal Transit on Accessibility",        # add a title
                title.size = 1.2,
                title.color = "azure4",
                title.position = c("left", "top"),
                inner.margins = c(0.09, 0.10, 0.10, 0.08),    # increase map margins to make space for legend
                fontfamily = 'Georgia',
                #bg.color = "grey95",
                frame = FALSE) +
      tm_borders(col = "grey40", lwd = 0.1)+
      tm_legend(title.size=0.9,
                text.size = 0.6,
                #frame = "grey",
                position = c("right", "bottom")) +
      tm_scale_bar(color.dark = "gray60",
                   position = c("left", "bottom")) +
      tm_compass(type = "arrow", position = c("right", "top"), size = 1.5) +
  tm_shape(cairo_metro) + 
      tm_lines(col = 'gray23', lwd = 1.5, alpha = 0.8) +
  # add legend for the metro
  tm_add_legend(type = "line", labels = 'Cairo Metro', col = 'gray23', lwd = 1.5)

map_60_diff 
tmap_save(tm = map_60_diff, filename = "Visuals/access_60_diff.png")


# TRYING RAYSHADER

popPlot <- cairo_hexagons %>%
              ggplot(aes(fill=pop2018cap)) +
              geom_sf() +
              scale_fill_viridis_c(option = "A") +
              theme_minimal() 
popPlot

PlotThree <- plot_gg(popPlot)

render_snapshot(filename = "Visuals/testPlot.png")

#attempt two have 2D plot with 3D plot
#plot_gg(popPlot, width = 5, height = 4, scale = 300, raytrace = FALSE, preview = TRUE)
plot_gg(popPlot, width = 5, height = 4, scale = 300, multicore = TRUE)
#render_camera(fov = 70, zoom = 0.5, theta = 130, phi = 35)
Sys.sleep(0.2)
render_snapshot(filename = "Visuals/testPlot.png", clear = TRUE)




# TEST %   DELETE THIS LATER

# calculate self potential
cairo_hexagons$self_potential = cairo_hexagons$jobsLFScou / cairo_hexagons$jobs_60_all
cairo_hexagons$self_potential_formal = cairo_hexagons$jobsLFScou / cairo_hexagons$jobs_60_formal
cairo_hexagons$self_potential_diff = cairo_hexagons$self_potential_formal - cairo_hexagons$self_potential 

breaksTEST = c(0, 0.1, 1, 3, 10, 20, 100)

map_60_all_per <-
  #tm_shape(c_osm) +
  #tm_rgb() +
  tm_shape(cairo_hexagons) +
      tm_fill("self_potential_diff",
              #style = "jenks",    # used instead of user defined breaks
              breaks = breaksTEST,
              palette = "GnBu",
              #legend.hist = TRUE,
              colorNA = '#e0f3db',
              title = "% Decrease in Self Potential\n When Microbuses Are Considered") +
      tm_layout(title = "Self Potential",        # add a title
                title.size = 1.5,
                title.position = c("left", "top"),
                inner.margins = c(0.09, 0.10, 0.10, 0.08),    # increase map margins to make space for legend
                fontfamily = 'Georgia',
                #bg.color = "grey95",
                frame = FALSE) +
      tm_borders(col = "grey40", lwd = 0.1)+
      tm_legend(title.size=0.9,
                text.size = 0.6,
                #frame = "grey",
                position = c("right", "bottom")) +
      tm_scale_bar(color.dark = "gray60",
                   position = c("left", "bottom")) 

map_60_all_per  
tmap_save(tm = map_60_all_per, filename = "Visuals/self_potential_diff.png")

# PLOTTING THE CAIRO ZONES
# tmap
zones <-
  tm_shape(cairo_hexagons) +
    tm_fill("znng_t_",
            palette = "-Greys",
            title = "Regions") +
    tm_legend(title.size=2,
              text.size = 1.2) +
  tm_shape(cairo_new_towns) + 
      tm_text(text = "name_citya", col = 'black', size = 0.7, 
            alpha = 0.7, bg.color = "white", bg.alpha = 0.2)
  
tmap_save(tm = zones, filename = "Visuals/regions.png")


# Jobs and Pop
breaks_pop <- c(0, 5000, 20000, 40000, 70000, 130000)
breaks_job <- c(0, 1000, 10000, 30000, 50000, 100000)
# FACET MAP
map_jobs_pop <-
  tm_shape(cairo_hexagons) +
  tm_fill(c("pop2018cap", "jobsLFScou"),
          #style = c("kmeans", "pretty"),    # used instead of user defined breaks
          breaks = list(breaks_pop, breaks_job),
          palette = list("Purples", "YlOrBr"),
          #legend.hist = TRUE,
          title = c("Population", "Jobs")) +
  tm_layout(title = c("GCR Population (2018)", "Job Distribution Across GCR (2018)"),        # add a title
            title.size = 1.2,
            title.position = c("left", "top"),
            title.color = "azure4",
            inner.margins = c(0.09, 0.10, 0.10, 0.08),    # increase map margins to make space for legend
            fontfamily = 'Georgia',
            #bg.color = "antiquewhite",
            frame = TRUE) +
  tm_borders(col = "grey40", lwd = 0.1)+
  tm_legend(title.size=0.7,
            text.size = 0.5,
            #frame = "grey",
            position = c("right", "bottom")) +
  tm_scale_bar(color.dark = "gray60",
               position = c("left", "bottom")) +
  tm_compass(type = "arrow", position = c("right", "top"), size = 1.5) +
  tm_shape(cairo_metro) + 
  tm_lines(col = 'firebrick4', lwd = 1, alpha = 0.8) +
  # add legend for the metro
  tm_add_legend(type = "line", labels = 'Cairo Metro', col = 'firebrick4', lwd = 1) +
  # two plots together on one row
  tm_facets(nrow = 1)

map_jobs_pop 
tmap_save(tm = map_jobs_pop, filename = "Visuals/jobsANDpop.png")







# ggmap with basemap
cairo_basemap <- get_stamenmap(bbox = c(30.801369, 29.705080, 31.874483, 30.390664), zoom = 1, maptype = "terrain-background")
ggmap(cairo_basemap) +
  geom_sf(data = cairo_hexagons, aes(fill=znng_t_), inherit.aes = FALSE) +
  scale_fill_brewer(palette = "OrRd") 
