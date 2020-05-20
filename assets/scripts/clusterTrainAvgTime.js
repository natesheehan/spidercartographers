// set the dimensions and margins of the graph
var marginBarTrain = {top: 30, right: 30, bottom: 70, left: 60},
    widthBarTrain = 460 - marginBarTrain.left - marginBarTrain.right,
    heightBarTrain = 400 - marginBarTrain.top - marginBarTrain.bottom;

// append the svg object to the body of the page
var svgBarTrain = d3.select("#barCar")
  .append("svg")
    .attr("width", widthBarTrain + marginBarTrain.left + marginBarTrain.right)
    .attr("height", heightBarTrain + marginBarTrain.top + marginBarTrain.bottom)
  .append("g")
    .attr("transform",
          "translate(" + marginBarTrain.left + "," + marginBarTrain.top + ")");

d3.json("http://dev.spatialdatacapture.org:8717/data/clusters/average", function(data) {

delete data[0].HH_owning_cars_perc
delete data[0].avg_time_bus
delete data[0].avg_time_car
delete data[0].avg_time_rail
delete data[0].bicycle_perc
delete data[0].bus_perc
delete data[0].car_perc
delete data[0].on_foot_perc
delete data[0].train_perc
delete data[0].underground_metro_perc
delete data[0].work_from_home_perc
delete data[0].avg_time_from_origin_car_UNWEIGHTED
delete data[0].avg_time_from_origin_bus_UNWEIGHTED


delete data[1].HH_owning_cars_perc
delete data[1].avg_time_bus
delete data[1].avg_time_car
delete data[1].avg_time_rail
delete data[1].bicycle_perc
delete data[1].bus_perc
delete data[1].car_perc
delete data[1].on_foot_perc
delete data[1].train_perc
delete data[1].underground_metro_perc
delete data[1].work_from_home_perc
delete data[1].avg_time_from_origin_car_UNWEIGHTED
delete data[1].avg_time_from_origin_bus_UNWEIGHTED

delete data[2].HH_owning_cars_perc
delete data[2].avg_time_bus
delete data[2].avg_time_car
delete data[2].avg_time_rail
delete data[2].bicycle_perc
delete data[2].bus_perc
delete data[2].car_perc
delete data[2].on_foot_perc
delete data[2].train_perc
delete data[2].underground_metro_perc
delete data[2].work_from_home_perc
delete data[2].avg_time_from_origin_car_UNWEIGHTED
delete data[2].avg_time_from_origin_bus_UNWEIGHTED

delete data[3].HH_owning_cars_perc
delete data[3].avg_time_bus
delete data[3].avg_time_car
delete data[3].avg_time_rail
delete data[3].bicycle_perc
delete data[3].bus_perc
delete data[3].car_perc
delete data[3].on_foot_perc
delete data[3].train_perc
delete data[3].underground_metro_perc
delete data[3].work_from_home_perc
delete data[3].avg_time_from_origin_car_UNWEIGHTED
delete data[3].avg_time_from_origin_bus_UNWEIGHTED

delete data[4].HH_owning_cars_perc
delete data[4].avg_time_bus
delete data[4].avg_time_car
delete data[4].avg_time_rail
delete data[4].bicycle_perc
delete data[4].bus_perc
delete data[4].car_perc
delete data[4].on_foot_perc
delete data[4].train_perc
delete data[4].underground_metro_perc
delete data[4].work_from_home_percs
delete data[4].avg_time_from_origin_car_UNWEIGHTED
delete data[4].avg_time_from_origin_bus_UNWEIGHTED

console.log(data)

// X axis
var x = d3.scaleBand()
  .range([ 0, widthBarTrain ])
  .domain(data.map(function(d) { return d["cluster label"]; }))
  .padding(0.2);
svgBarTrain.append("g")
  .attr("transform", "translate(0," + heightBarTrain + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 400])
  .range([ heightBarTrain, 0]);
svgBarTrain.append("g")
  .call(d3.axisLeft(y));

// Bars
svgBarTrain.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d["cluster label"]); })
    .attr("y", function(d) { return y(d.avg_time_from_origin_rail_UNWEIGHTED); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return heightBarTrain - y(d.avg_time_from_origin_rail_UNWEIGHTED); })
    .attr("fill", "#69b3a2")

    svgBarTrain.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", widthBarTrain -150)
      .attr("y", heightBarTrain +35)
      .text("Cluster");

      svgBarTrain.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -10)
      .attr("x", 300)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-360)")
      .text("Average time to origin by train (Minutes)");

})
