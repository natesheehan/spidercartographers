// set the dimensions and margins of the graph
var marginBarCar = {
    top: 20,
    right: 30,
    bottom: 40,
    left: 90
  },
  widthBarCar = 460 - marginBarCar.left - marginBarCar.right,
  heightBarCar = 400 - marginBarCar.top - marginBarCar.bottom;

// append the svg object to the body of the page
var svgBarCar = d3.select("#barCar")
  .append("svg")
  .attr("width", widthBarCar + marginBarCar.left + marginBarCar.right)
  .attr("height", heightBarCar + marginBarCar.top + marginBarCar.bottom)
  .append("g")
  .attr("transform",
    "translate(" + marginBarCar.left + "," + marginBarCar.top + ")"

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
delete data[0].avg_time_from_origin_rail_UNWEIGHTED
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
delete data[1].avg_time_from_origin_rail_UNWEIGHTED
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
delete data[2].avg_time_from_origin_rail_UNWEIGHTED
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
delete data[3].avg_time_from_origin_rail_UNWEIGHTED
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
delete data[4].avg_time_from_origin_rail_UNWEIGHTED
delete data[4].avg_time_from_origin_bus_UNWEIGHTED

console.log(data)

// Add X axis
var x = d3.scaleLinear()
  .domain([0, 40])
  .range([0, widthBarCar]);
svgBar.append("g")
  .attr("transform", "translate(0," + heightBarCar + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

// Y axis
var y = d3.scaleBand()
  .range([0, heightBarCar])
  .domain(data.map(function(d) {
    return d.mode;
  }))
  .padding(.1);
svgBarCar.append("g")
  .call(d3.axisLeft(y))

//Bars
svgBarCar.selectAll("myRect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", x(0))
  .attr("y", function(d) {
    return y(d.mode);
  })
  .attr("width", function(d) {
    return x(d.["cluster label"]);
  })
  .attr("height", y.bandwidth())
  .attr("fill", "#37a583")

  svgBarCar.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", widthBarCar)
    .attr("y", heightBarCar +35)
    .text("Mean Public Transport Access in MSOA's");

    svgBarCar.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -10)
    .attr("x", 5)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-360)")
    .text("Transport Type");

})
