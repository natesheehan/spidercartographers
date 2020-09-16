d3.json("http://dev.spatialdatacapture.org:8717/cityscale/mean/rural", function(urbanData) {
    var urbanMeanData = urbanData;

    urbanData[0].metrics = "Bike"
    urbanData[1].metrics = "Bus"
    urbanData[2].metrics = "Car"
    urbanData[3].metrics = "Motorbike"
    urbanData[4].metrics = "Walk"
    urbanData[5].metrics = "Other"
    urbanData[6].metrics = "Taxi"
    urbanData[7].metrics = "Train"
    urbanData[8].metrics = "Underground"
    urbanData[9].metrics = "WFH"

    var colorScheme = ["#ffa372"," #ff059","#ed6663","#bdccd4","#37a583","#186da0","#202BBC","#4DB6AC","#FFF176","#64B5F6","#00E676","#00008b"];
    renderRuralPieChart(urbanMeanData,"#chartRural",colorScheme);
});
var inputRuralData = [{label:"Bike",value:1.58785543367506}},{label:"Bus",value:2.41135542580226},{label:"Car",value:68.4545807237194},{label:"Motorbike",value:0.70090302336073},{label:"Walk",value:6.43826289172237},{label:"Other",value:0.524356215881074},{label:"Taxi",value:0.17998138802704},{label:"Train",value:2.6468338072178},{label:"Underground",value:0.232963454914564},{label:"WFH",value:16.8229076356796}];
var colorScheme = ["#ffa372"," #ff059","#ed6663","#bdccd4","#37a583","#186da0","#202BBC","#4DB6AC","#FFF176","#64B5F6","#00E676","#00008b"];
renderPieChart(inputRuralData,"#chartUrban",colorScheme);
