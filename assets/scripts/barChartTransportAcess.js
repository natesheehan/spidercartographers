
      // set the dimensions and margins of the graph
      var margin = {top: 20, right: 30, bottom: 40, left: 90},
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3.select("#my_dataviz")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      // Parse the Data
      d3.csv("assets/barTest.csv", function(data) {

        // Add X axis
        var x = d3.scaleLinear()
          .domain([0, 40])
          .range([ 0, width]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y axis
        var y = d3.scaleBand()
          .range([ 0, height ])
          .domain(data.map(function(d) { return d.Mode; }))
          .padding(.1);
        svg.append("g")
          .call(d3.axisLeft(y))

        //Bars
        svg.selectAll("myRect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", x(0) )
          .attr("y", function(d) { return y(d.Mode); })
          .attr("width", function(d) { return x(d.Share); })
          .attr("height", y.bandwidth() )
          .attr("fill", "#ed6663")

        })
