// d3.json("http://dev.spatialdatacapture.org:8717/cityscale/mean/london", function(urbanData) {
//     var urbanMeanData = urbanData;
//     urbanData[0].metrics = "Bike"
//     urbanData[1].metrics = "Bus"
//     urbanData[2].metrics = "Car"
//     urbanData[3].metrics = "Motorbike"
//     urbanData[4].metrics = "Walk"
//     urbanData[5].metrics = "Other"
//     urbanData[6].metrics = "Taxi"
//     urbanData[7].metrics = "Train"
//     urbanData[8].metrics = "Metro"
//     urbanData[9].metrics = "WFH"
//
//     var colorScheme = ["#ffa372"," #ff059","#ed6663","#bdccd4","#37a583","#186da0","#202BBC","#4DB6AC","#FFF176","#64B5F6","#00E676","#00008b"];
//     renderLondonPieChart(urbanMeanData,"#chartLondon",colorScheme);
// });

var urbanMeanData = [{label:"Bike",value:3.69389596508514},{label:"Bus",value:13.7519425567017},{label:"Car",value:28.7356105871848},{label:"Motorbike",value:1.07352333857829},{label:"Walk",value:8.06773535464926},{label:"Other",value:0.517545651523208},{label:"Taxi",value:0.472554427858655},{label:"Train",value:12.8619245102006},{label:"Underground",value:21.2454257385779},{label:"WFH",value:9.57984186964039}];
var colorScheme = ["#ffa372"," #ff059","#ed6663","#bdccd4","#37a583","#186da0","#202BBC","#4DB6AC","#FFF176","#64B5F6","#00E676","#00008b"];
renderPieChart(urbanMeanData,"#chartLondon",colorScheme);
