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
