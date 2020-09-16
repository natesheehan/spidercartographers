// d3.json("http://dev.spatialdatacapture.org:8717/cityscale/mean/birmingham", function(urbanData) {
//
//     var urbanMeanData = urbanData;
//
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
//     renderBirminghamPieChart(urbanMeanData,"#chartBirmingham",colorScheme);
// });

var urbanMeanData = [{label:"Bike",value:1.52791039559104},{label:"Bus",value:18.0310479488505},{label:"Car",value:57.54457839902},{label:"Motorbike",value:0.475666493944294},{label:"Walk",value:9.7448054405688},{label:"Other",value:0.493910448074561},{label:"Taxi",value:0.711589925837425},{label:"Train",value:3.87154584476284},{label:"Underground",value:0.299545545922254},{label:"WFH",value:7.29939955742826}];
var colorScheme = ["#ffa372"," #ff059","#ed6663","#bdccd4","#37a583","#186da0","#202BBC","#4DB6AC","#FFF176","#64B5F6","#00E676","#00008b"];
renderPieChart(urbanMeanData,"#chartBirmingham",colorScheme);
