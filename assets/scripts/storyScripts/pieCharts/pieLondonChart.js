function renderLondonPieChart (dataset,dom_element_to_append_to, colorScheme){

    var margin = {top:50,bottom:50,left:50,right:50};
    var width = 500 - margin.left - margin.right,
    height = width,
    radius = Math.min(width, height) / 2;
    var donutWidth = 75;
    var legendRectSize = 18;
    var legendSpacing = 4;

    dataset.forEach(function(item){
      item.enabled = true;
    });

    var color = d3.scale.ordinal()
    .range(colorScheme);

    var svg = d3.select(dom_element_to_append_to)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - donutWidth);

    var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.mean; });

    var tooltipUrban = d3.select(dom_element_to_append_to)
    .append('div')
    .attr('class', 'tooltip');

    tooltipUrban.append('div')
    .attr('class', 'label');

    tooltipUrban.append('div')
    .attr('class', 'percent');

    var path = svg.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) {
      return color(d.data.metrics);
    })
    .each(function(d) { this._current = d; });


    path.on('mouseover', function(d) {
      var total = d3.sum(dataset.map(function(d) {
        return (d.enabled) ? d.mean : 0;
      }));

      var percent = Math.round(1000 * d.data.mean / total) / 10;
      tooltipUrban.select('.label').html(d.data.metrics.toUpperCase()).style('color','black');
      tooltipUrban.select('.count').html(d.data.mean);
      tooltipUrban.select('.percent').html(percent + '%');

      tooltipUrban.style('display', 'block');
      tooltipUrban.style('opacity',2);

    });


    path.on('mousemove', function(d) {
      tooltipUrban.style('top', (d3.event.layerY + 10) + 'px')
      .style('left', (d3.event.layerX - 25) + 'px');
    });

    path.on('mouseout', function() {
      tooltipUrban.style('display', 'none');
      tooltipUrban.style('opacity',0);
    });

    var legendUrban = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * color.domain().length / 2;
      var horz = -2 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });

    legendUrban.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color)
    .on('click', function(label) {
      var rect = d3.select(this);
      var enabled = true;
      var totalEnabled = d3.sum(dataset.map(function(d) {
        return (d.enabled) ? 1 : 0;
      }));

      if (rect.attr('class') === 'disabled') {
        rect.attr('class', '');
      } else {
        if (totalEnabled < 2) return;
        rect.attr('class', 'disabled');
        enabled = false;
      }

      pie.value(function(d) {
        if (d.metrics === label) d.enabled = enabled;
        return (d.enabled) ? d.mean : 0;
      });

      path = path.data(pie(dataset));

      path.transition()
      .duration(750)
      .attrTween('d', function(d) {
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return arc(interpolate(t));
        };
      });
    });

    legendUrban.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; })
  };
