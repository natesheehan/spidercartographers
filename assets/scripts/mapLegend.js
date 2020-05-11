var Svg = d3.select("#mapLegendDots")

var keys = ["Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4", "Cluster 5"]
var mapLegendColours = ['#ffa372','#ed6663','#37a583','#186da0','#fff059'];

// Usually you have a color scale in your chart already
var color = d3.scaleOrdinal()
    .domain(keys)
    .range(mapLegendColours);

// Add one dot in the legend for each name.
Svg.selectAll("mydots")
    .data(keys)
    .enter()
    .append("circle")
    .attr("cx", 75)
    .attr("cy", function(d,i){ return 10 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d){ return color(d)})

// Add label in the legend for each name.
Svg.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 0)
    .attr("y", function(d,i){ return 10 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", '#fff3e0')
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
