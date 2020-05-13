d3.json("http://dev.spatialdatacapture.org:8717/averages/mean/perc", function(data) {
    var inputData = data;
    var colorScheme = ["#ffa372"," #ff059","#ed6663","#bdccd4","#37a583","#186da0","#1b262c","#4DB6AC","#FFF176","#64B5F6","#00E676","#00008b"];
    renderPieChart(inputData,"#chart",colorScheme);
});
