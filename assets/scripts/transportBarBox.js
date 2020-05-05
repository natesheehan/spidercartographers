
        var DEFAULT_DATASET_SIZE = 5,
        			addedCount = 0,
        		   color = Chart.helpers.color;

        	var chartColors = {
        		orange: '#ffa372',
        		black: '#1b262c',
        		grey: '#bdccd4'
        	};

        var barData = {
        			  labels: ["MIN","25%","50%","75%","MAX"],
        			  datasets: [{
        				label: 'Metro',
        				backgroundColor: color(chartColors.grey).alpha(0.5).rgbString(),
        				borderColor: chartColors.grey,
        				borderWidth: 1,
        				data: [
                            0,
                            0.067980965,
                            0.15497869,
                            0.53876085,
                            55.72609209
        				]
        			},{
        				label: 'Bus',
        				backgroundColor: color(chartColors.black).alpha(0.5).rgbString(),
        				borderColor: chartColors.black,
        				borderWidth: 1,
        				data: [
                            0.173671414,
                            2.491103203,
                            5.3783285,
                            10.13041013,
                            45.51775515
        				]
        			}, {
        				label: 'Train',
        				backgroundColor: color(chartColors.orange).alpha(0.5).rgbString(),
        				borderColor: chartColors.orange,
        				borderWidth: 1,
        				data: [
                            0.052521008,
                            1.024377593,
                            2.332222751,
                            5.741775295,
                            46.02851324
        				]
        			}]

        		};
        var index = 5;
        var ctx = document.getElementById("barChart").getContext("2d");
        		var	myNewChartB = new Chart(ctx, {
        				type: 'bar',
        				data: barData,
        				options: {
        					responsive: true,
                  maintainAspectRation: true,
        					legend: {
        						position: 'top',
        					},
        					title: {
        						display: true,
        						text: 'Public Transport'
        					}
        				}
        			});
