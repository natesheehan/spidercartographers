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

getwd()

msoa <-  geojson_read("https://opendata.arcgis.com/datasets/29fdaa2efced40378ce8173b411aeb0e_2.geojson", what = "sp")

msoa_sf <- st_as_sf(msoa)


#YJ range 
yj_DB <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/yeojohnson_range_st_DBSCAN.csv")

yj_DB <- select(yj_DB, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(yj_DB)[names(yj_DB) == "label"] <- "yj_DB_cluster"

yj_H <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/yeojohnson_range_st_heirarchy.csv")

yj_H <- select(yj_H, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(yj_H)[names(yj_H) == "label"] <- "yj_H_cluster"

yj_Kmeans <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/yeojohnson_range_st_kmeans.csv")

yj_Kmeans <- select(yj_Kmeans, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(yj_Kmeans)[names(yj_Kmeans) == "label"] <- "yj_Kmeans_cluster"

#yj zscore
yj_Z_Kmeans <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/yeojohnson_zscore_st_kmeans.csv")

yj_Z_Kmeans <- select(yj_Z_Kmeans, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19))

names(yj_Z_Kmeans)[names(yj_Z_Kmeans) == "label"] <- "yj_zscore_Kmeans_cluster"


yj_Z_DB <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/yeojohnson_zscore_st_DBSCAN.csv")

yj_Z_DB <- select(yj_Z_DB, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19))

names(yj_Z_DB)[names(yj_Z_DB) == "label"] <- "yj_Zscore_DB_cluster"

yj_Z_H <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/yeojohnson_zscore_st_heirarchy.csv")

yj_Z_H <- select(yj_Z_H, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19))

names(yj_Z_H)[names(yj_Z_H) == "label"] <- "yj_Zscore_H_cluster"


#YJ IDR
yj_idr_Kmeans <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/yeojohnson_idr_st_kmeans.csv")

yj_idr_Kmeans <- select(yj_idr_Kmeans, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(yj_idr_Kmeans)[names(yj_idr_Kmeans) == "label"] <- "yj_idr_Kmeans_cluster"


yj_idr_DB <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/yeojohnson_idr_st_DBSCAN.csv")

yj_idr_DB <- select(yj_idr_DB, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(yj_idr_DB)[names(yj_idr_DB) == "label"] <- "yj_idr_DB_cluster"

yj_idr_H <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/yeojohnson_idr_st_heirarchy.csv")

yj_idr_H <- select(yj_idr_H, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(yj_idr_H)[names(yj_idr_H) == "label"] <- "yj_idr_H_cluster"




msoa_w_clusters <- merge(msoa,  
                      yj_Kmeans,
                       by.x = "msoa11cd",
                       by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         yj_H,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,           yj_DB,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         yj_idr_DB,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         yj_idr_H,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         yj_idr_Kmeans,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         yj_Z_Kmeans,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         yj_Z_DB,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         yj_Z_H,
                         by.x = "msoa11cd",
                         by.y = "MSOA")


#log idr
log_idr_kmeans <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/log_idr_st_kmeans.csv")

log_idr_kmeans <- select(log_idr_kmeans, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(log_idr_kmeans)[names(log_idr_kmeans) == "label"] <- "log_idr_kmeans_cluster"

log_idr_H <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/log_idr_st_heirarchy.csv")

log_idr_H <- select(log_idr_H, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(log_idr_H)[names(log_idr_H) == "label"] <- "log_idr_H_cluster"

log_idr_DB <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/log_idr_st_DBSCAN.csv")

log_idr_DB  <- select(log_idr_DB , -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(log_idr_DB )[names(log_idr_DB ) == "label"] <- "log_idr_DB_cluster"

#log range
log_range_H <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/log_range_st_heirarchy.csv")

log_range_H <- select(log_range_H, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(log_range_H)[names(log_range_H) == "label"] <- "log_range_H_cluster"

log_range_kmeans <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/log_range_st_kmeans.csv")

log_range_kmeans <- select(log_range_kmeans, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(log_range_kmeans)[names(log_range_kmeans) == "label"] <- "log_range_kmeans_cluster"

log_range_DB <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/log_range_st_DBSCAN.csv")

log_range_DB <- select(log_range_DB, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(log_range_DB)[names(log_range_DB) == "label"] <- "log_range_DB_cluster"

#log zscore
log_zscore_H <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/log_zscore_st_heirarchy.csv")

log_zscore_H <- select(log_zscore_H, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(log_zscore_H)[names(log_zscore_H) == "label"] <- "log_zscore_H_cluster"

log_zscore_kmeans <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/log_zscore_st_kmeans.csv")

log_zscore_kmeans <- select(log_zscore_kmeans, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(log_zscore_kmeans)[names(log_zscore_kmeans) == "label"] <- "log_zscore_kmeans_cluster"

log_zscore_DB <- read.csv("Code repos/spidercartographers/Scripts/Data/Clustering_results/log_zscore_st_DBSCAN.csv")

log_zscore_DB <- select(log_zscore_DB, -c(1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22))

names(log_zscore_DB)[names(log_zscore_DB) == "label"] <- "log_zscore_DB_cluster"

msoa_w_clusters <- merge(msoa_w_clusters,       
                         log_idr_DB,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         log_idr_H,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         log_idr_kmeans,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         log_zscore_DB,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         log_zscore_H,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         log_zscore_kmeans,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         log_range_DB,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         log_range_H,
                         by.x = "msoa11cd",
                         by.y = "MSOA")

msoa_w_clusters <- merge(msoa_w_clusters,       
                         log_range_kmeans,
                         by.x = "msoa11cd",
                         by.y = "MSOA")


#logframes <- c(log_zscore_DB, log_zscore_kmeans, log_zscore_H, log_range_DB, log_range_H, log_range_kmeans, log_idr_DB, log_idr_kmeans, log_idr_H)

#for(df in logframes){
 # msoa_w_clusters <- merge(msoa_w_clusters, 
 #                          df,
  #                         by.x = "msoa11cd",
   #                        by.y = "MSOA")
#}



#class(msoa_w_clusters)

msoa_w_clusters <- st_as_sf(msoa_w_clusters)

tmap_mode("plot")

#tm_shape(msoa_w_clusters)+
 # tm_polygons(c("yj_DB_cluster","yj_Kmeans_cluster", "yj_H_cluster"),
  #            palette = "RdBu")

tm_shape(msoa_w_clusters)+
  tm_polygons("yj_Kmeans_cluster",
              palette = "RdBu")


tm_shape(msoa_w_clusters)+
  tm_polygons("yj_H_cluster",
              palette = "RdBu")

#yj idr maps
tm_shape(msoa_w_clusters)+
  tm_polygons("yj_idr_H_cluster",
              palette = "RdBu")
#
#tm_shape(msoa_w_clusters)+
 # tm_polygons("yj_idr_DB_cluster",
  #            palette = "RdBu")

tm_shape(msoa_w_clusters)+
  tm_polygons("yj_idr_Kmeans_cluster",
              palette = "RdBu")

#yj zscore
#tm_shape(msoa_w_clusters)+
 # tm_polygons("yj_Zscore_H_cluster",
  #            palette = "RdBu")

tm_shape(msoa_w_clusters)+
  tm_polygons("yj_zscore_Kmeans_cluster",
              palette = "RdBu")

#tm_shape(msoa_w_clusters)+
 # tm_polygons("yj_Zscore_DB_cluster",
  #            palette = "RdBu")

#log range
#tm_shape(msoa_w_clusters)+
 # tm_polygons("log_range_DB_cluster",
  #            palette = "RdBu")

breaks = c(-0.5, 0.5,1.5,2.5,3.5,4.5)

tmap_mode("view")

tm_shape(msoa_w_clusters)+
  tm_polygons("log_range_H_cluster",
              palette = "RdBu",
              breaks = breaks)

tm_shape(msoa_w_clusters)+
  tm_polygons("log_range_kmeans_cluster",
              palette = "RdBu",
              breaks = breaks)

#log z
#tm_shape(msoa_w_clusters)+
 # tm_polygons("log_zscore_DB_cluster",
 #             palette = "RdBu")

tm_shape(msoa_w_clusters)+
  tm_polygons("log_zscore_kmeans_cluster",
              palette = "RdBu")

tm_shape(msoa_w_clusters)+
  tm_polygons("log_zscore_H_cluster",
              palette = "RdBu")

#log idr
tm_shape(msoa_w_clusters)+
  tm_polygons("log_idr_kmeans_cluster",
              palette = "RdBu")

tm_shape(msoa_w_clusters)+
  tm_polygons("log_idr_H_cluster",
              palette = "RdBu")

#tm_shape(msoa_w_clusters)+
 # tm_polygons("log_idr_DB_cluster",
  #            palette = "RdBu")





msoa_clusters_df <- merge(yj_idr_Kmeans,
                          yj_DB,
                          by = "MSOA"
)

logframes <- c(log_zscore_DB, log_zscore_kmeans, log_zscore_H, log_range_DB, log_range_H, log_range_kmeans, log_idr_DB, log_idr_kmeans, log_idr_H, yj_idr_DB, yj_idr_H, yj_H, yj_Kmeans, yj_Z_DB, yj_Z_H, yj_Z_Kmeans) 

cleaned_transport <- read.csv("Code repos/spidercartographers/Scripts/Data/cleaned_transport.csv")


msoa_clusters_df <- merge(msoa_clusters_df,
                          log_idr_kmeans,
                          by = "MSOA"
)

msoa_clusters_df <- select(msoa_clusters_df, -c(30,31,32))

names(msoa_clusters_df)[names(msoa_clusters_df) == "log_idr_H_cluster.y"] <- "log_idr_H_cluster"

names(msoa_clusters_df)[names(msoa_clusters_df) == "log_idr_DB_cluster.y"] <- "log_idr_DB_cluster"

names(msoa_clusters_df)[names(msoa_clusters_df) == "log_idr_kmeans_cluster.y"] <- "log_idr_kmeans_cluster"

write.csv(msoa_clusters_df, "Code repos/spidercartographers/Scripts/Data/Clustering_results/clusterlabels_cleaneddata.csv")

