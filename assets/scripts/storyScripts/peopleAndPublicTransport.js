var url = "http://dev.spatialdatacapture.org:8717/averages/mean,std,min,twenty_five,median,seventy_five,max/box5";
// Store data here
var dataBoxArray = [];
// Flag when dataArray has been populated
var flag = false;
// get box 5 data
$.getJSON(url, function(dataBox) {
      // Check that call is working
      console.log("working?");
      flag = true;
      $.each(dataBox, function(k, v) {
          // Collect data
          const newBoxData = {
            "mode": v["mode"],
            "mean": v["mean"],
            "min": v["min"],
            "std": v["std"],
            "twenty_five": v["twenty_five"],
            "median": v["median"],
            "seventy_five": v["seventy_five"],
            "max": v["max"]
             };
            // Push new data to array and check on progress
            dataBoxArray.push(newBoxData);
            console.log(newBoxData.mode);
          }); // end of for each

          var DEFAULT_DATASET_SIZE = 6,
            addedCount = 0,
            color = Chart.helpers.color;

          var chartColors = {
            orange: '#ffa372',
            black: '#37a583',
            grey: '#bdccd4'
          };

          var barPeopleData = {
            labels: ["MIN", "25%", "50%", "75%", "MAX", "MEAN"],
            datasets: [{
              label: 'Sustainable travel',
              backgroundColor: color(chartColors.grey).alpha(0.5).rgbString(),
              borderColor: chartColors.grey,
              borderWidth: 1,
              data: [
                2.019363762,
                7.076739325,
                10.28142589,
                15.51043429,
                53.8021978,
                12.44920972
              ]
            }, {
              label: 'Public Transport',
              backgroundColor: color(chartColors.orange).alpha(0.5).rgbString(),
              borderColor: chartColors.orange,
              borderWidth: 1,
              data: [
                0.744047619,
                5.615874204,
                9.99275887,
                18.146184,
                74.62533361,
                15.38149353
              ]
            }]

          };
          var index = 11;
          var ctx = document.getElementById("barChartPeople").getContext("2d");
          var myNewChartB = new Chart(ctx, {
            type: 'bar',
            data: barPeopleData,
            options: {
              responsive: true,
              maintainAspectRation: true,
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Active Transport versus Public Transport'
              }
            }
          });
      }); // end of getJSON
