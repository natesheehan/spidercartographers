# Data Scripts:

## Workflow follows these workbooks in order

### 1. Points in polygon.R -
This reads in the stops.csv file (too large to be uploaded to github), merges this with the MSOA GeoJSON to perform a points in polygon analysis of each bus sotp, train station and metro/tram/underground station in the UK and outputs the locations csvs. This was also used to get the latitude and longitude of each MSOA centroid to add it to the flows data. 

### 1. Travel_Time_bus.ipynb (Car and Rail also) 
scripts used to read in the distance and travel data known as ‘dis1.csv’, ‘dis2.csv’ and ‘disc3.csv’ from the Data folder, which are combined with the flow data from ‘Data/wu03ew_msoa.csv’ to calculate the average travel time results. The results are then outputted as ‘Data/travel_time_bus.csv’, ‘Data/ travel_time_car.csv’ and ‘Data/ travel_time_rail.csv’.

### 2. Merging and variable exploration.ipynb 
This is the first script that begins to merge the existing datasets. From the Data folder, this reads in ‘wu03ew_msoa.csv’ which contains all the flow data for each msoa, the ‘Bus_locations.csv’, ‘Train locations.csv’ and ‘Metro_locations.csv’, which contain all the information on each number of stops/stations in each MSOA, ‘household cars.csv’ which contains all the cars in each MSOA, and ‘travel_time_car.csv’, ‘travel_time_bus.csv’ and ‘travel_time_rail.csv’ which contains information on all the travel times. Each of these datasets are merged into a single csv and outputted as ‘Data/cleaned_transport.csv’. The latter parts of this script are used later and so have been changed to remove variables after initial analysis and cleaned transport is updated. 

### 3. Exploration (log transformation + standardization.ipynb and Yeo-Johnson Transformation.ipynb 
These scripts take in the ‘cleaned_transport.csv’, explore the variables and their distribution and then transform and standardise the data. The first performs the log transformation then each of the standardisations, the latter performs the Yeo-Johnson transformation and following standardisations. These result in the csvs within the Data folder of ‘transport_log_then_normal.csv’, ‘transport_log_then_range.csv’, ‘transport_log_then_idr.csv’, ‘yeojohnson_range_st.csv’, ‘yeojohsnon_zscore_st.csv’ and ‘yeojohnson_idr_st.csv’.

### 4.1-4.2 Clustering_templace.ipynb and other clustering workbooks 
The clustering template explains the clustering methodologies we used, along with how they work and their code, which was subsequently used in the other clustering workbooks. These workbooks perform the clustering algorithms on csvs produced above, and outputs the results in the Data/Clustering_Results folder, with the clustering method added to the end of the name of each file. 

### 4.3 Evaluating clusters.ipynb and mapping clusters.R 
These workbook reads in the clustering results and produces plots and maps to explore the results. The latter merged all the clustering outputs into a single csv called ‘clusterlabels_cleaneddata.csv’ which is in the clustering_results folder. These plots, along with maps produced in RStudio were used to analyse the clustering results to reach the final conclusion of which clustering results performed best.

### 4.4 Clustering_Json_Script.ipynb 
This used the ‘clusterlables_cleaneddata3.csv’ to create a json to put on the Firebase database. 

### 5.1 Classification - Socioeconomic Varibles.ipynb 
This workbook produces the geodemographic variables csv known as ‘Data/Socioeconomic_data/socioeconomic_all.csv’ by cleaning and combining all the socioeconomic factors into a single dataframe. These factors are then to be used in the classification workbook.

### 5.2 Classification workbook.ipynb 
This workbook performs the final classification results and explains the method and process, outputting the RandomForest results as pngs.

### 6. Data for Website Story Page.ipynb 
This uses the existing data from the previous workbooks to produce summary statistics that will be used to inform the story and on the website through grouby methods. 

### 7. Flows to sql,ipynb 
This workbook is used to put all the resulting information onto sql which is then used through the API (with all personal information removed). 


