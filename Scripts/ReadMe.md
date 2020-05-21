{\rtf1\ansi\ansicpg1252\cocoartf1671\cocoasubrtf600
{\fonttbl\f0\fswiss\fcharset0 Helvetica-Bold;\f1\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww10800\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\ri-340\sl259\slmult1\sa160\partightenfactor0

\f0\b\fs22 \cf0 ReadMe Data side:\
Workflow follows these workbooks in order
\f1\b0 \

\f0\b 1. Points in polygon.R 
\f1\b0 \'96 This reads in the stops.csv file (too large to be uploaded to github), merges this with the MSOA GeoJSON to perform a points in polygon analysis of each bus sotp, train station and metro/tram/underground station in the UK and outputs the locations csvs. This was also used to get the latitude and longitude of each MSOA centroid to add it to the flows data. \

\f0\b 1. Travel_Time_bus.ipynb (Car and Rail also) 
\f1\b0 \'96 are scripts used to read in the distance and travel data known as \'91dis1.csv\'92, \'91dis2.csv\'92 and \'91disc3.csv\'92 from the Data folder, which are combined with the flow data from \'91Data/wu03ew_msoa.csv\'92 to calculate the average travel time results. The results are then outputted as \'91Data/travel_time_bus.csv\'92, \'91Data/ travel_time_car.csv\'92 and \'91Data/ travel_time_rail.csv\'92.\

\f0\b 2. Merging and variable exploration.ipynb 
\f1\b0 \'96 This is the first script that begins to merge the existing datasets. From the Data folder, this reads in \'91wu03ew_msoa.csv\'92 which contains all the flow data for each msoa, the \'91Bus_locations.csv\'92, \'91Train locations.csv\'92 and \'91Metro_locations.csv\'92, which contain all the information on each number of stops/stations in each MSOA, \'91household cars.csv\'92 which contains all the cars in each MSOA, and \'91travel_time_car.csv\'92, \'91travel_time_bus.csv\'92 and \'91travel_time_rail.csv\'92 which contains information on all the travel times. Each of these datasets are merged into a single csv and outputted as \'91Data/cleaned_transport.csv\'92. The latter parts of this script are used later and so have been changed to remove variables after initial analysis and cleaned transport is updated. \

\f0\b 3. Exploration (log transformation + standardization.ipynb and Yeo-Johnson Transformation.ipynb 
\f1\b0 \'96 These scripts take in the \'91cleaned_transport.csv\'92, explore the variables and their distribution and then transform and standardise the data. The first performs the log transformation then each of the standardisations, the latter performs the Yeo-Johnson transformation and following standardisations. These result in the csvs within the Data folder of \'91transport_log_then_normal.csv\'92, \'91transport_log_then_range.csv\'92, \'91transport_log_then_idr.csv\'92, \'91yeojohnson_range_st.csv\'92, \'91yeojohsnon_zscore_st.csv\'92 and \'91yeojohnson_idr_st.csv\'92.\

\f0\b 4.1-4.2 Clustering_templace.ipynb and other clustering workbooks 
\f1\b0 \'96 The clustering template explains the clustering methodologies we used, along with how they work and their code, which was subsequently used in the other clustering workbooks. These workbooks perform the clustering algorithms on csvs produced above, and outputs the results in the Data/Clustering_Results folder, with the clustering method added to the end of the name of each file. \

\f0\b 4.3 Evaluating clusters.ipynb and mapping clusters.R
\f1\b0  \'96 These workbook reads in the clustering results and produces plots and maps to explore the results. The latter merged all the clustering outputs into a single csv called \'91clusterlabels_cleaneddata.csv\'92 which is in the clustering_results folder. These plots, along with maps produced in RStudio were used to analyse the clustering results to reach the final conclusion of which clustering results performed best.\

\f0\b 4.4 Clustering_Json_Script.ipynb 
\f1\b0 \'96 This used the \'91clusterlables_cleaneddata3.csv\'92 to create a json to put on the Firebase database. \

\f0\b 5.1 Classification - Socioeconomic Varibles.ipynb 
\f1\b0 \'96 This workbook produces the geodemographic variables csv known as \'91Data/Socioeconomic_data/socioeconomic_all.csv\'92 by cleaning and combining all the socioeconomic factors into a single dataframe. These factors are then to be used in the classification workbook.\

\f0\b 5.2 Classification workbook.ipynb 
\f1\b0 \'96 This workbook performs the final classification results and explains the method and process, outputting the RandomForest results as pngs.\

\f0\b 6. Data for Website Story Page.ipynb
\f1\b0  \'96 uses the existing data from the previous workbooks to produce summary statistics that will be used to inform the story and on the website through grouby methods. \

\f0\b 7. Flows to sql,ipynb
\f1\b0  \'96 This workbook is used to put all the resulting information onto sql which is then used through the API (with all personal information removed). \
\
\
}