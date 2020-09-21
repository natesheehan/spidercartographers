d3.json("https://raw.githubusercontent.com/natesheehan/scdata/master/storyPie.json", function(data) {
    var inputData = data;

    data[0].mode = "WFH"
    data[1].mode = "Metro"
    data[2].mode = "Train"
    data[3].mode = "Bus"
    data[4].mode = "Taxi"
    data[5].mode = "Motorbike"
    data[6].mode = "Bike"
    data[7].mode = "Walk"
    data[8].mode = "Other"
    data[9].mode = "Car"

    var colorScheme = ["#ffa372"," #ff059","#ed6663","#bdccd4","#37a583","#186da0","#1b262c","#4DB6AC","#FFF176","#64B5F6","#00E676","#00008b"];
    renderPieChart(inputData,"#chart",colorScheme);
});
