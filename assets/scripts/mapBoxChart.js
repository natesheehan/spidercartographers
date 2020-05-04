export const drawChart = (a,b,c,d,e,f,g) => {
const data = [
    {"mode":"work at home",
    "value":a},
    {"mode":"on foot",
    "value":b},
    {"mode":"bicycle",
    "value":c},
    {"mode":"car",
    "value":d},
    {"mode":"bus",
    "value":e},
    {"mode":"train",
    "value":f},
    {"mode":"underground",
    "value":g}
];

const margin ={left:25, top:25, bottom:25, right:25};
const width = 400;
const height = 250;
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;

d3.selectAll("svg").remove(); 

const svg = d3.select('.interactiveChart')
.append("svg")
    .attr("width", width)
    .attr("height", height);
    

const chart = svg.append('g')
    .attr('transform',`translate(${margin.left}, 20)`);

const yScale = d3.scaleLinear()
    .range([innerHeight, 0])
    .domain([0, 100]);

chart.append('g')
    .call(d3.axisLeft(yScale))
    .attr('transform',`translate(0,0)`)
    .attr('stroke-width',0)
    .style('fill',0);


const xScale = d3.scaleBand()
    .range([0, innerWidth])
    .domain(data.map(function(d){
        return d.mode
    }))
    .padding(0.2)

chart.append('g')
    .attr('transform',`translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .attr('stroke-width',0);
    // .call(wrap, xScale.bandwidth());

const barGroups = chart.selectAll()
    .data(data)
    .enter()
    .append('g')

barGroups
    .append('rect')
    .style('fill', 'ffa372')
    .style('opacity', 1)
    .attr('x', (s) => xScale(s.mode))
    .attr('y', (s) => yScale(s.value))
    .attr('height', (s) => innerHeight - yScale(s.value))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function(actual, i){

        d3.selectAll('.value')
        .attr('opacity', 0)

      const y = yScale(actual.value)

      line = chart.append('line')
        .attr('id', 'limit')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', innerWidth)
        .attr('y2', y)

      barGroups.append('text')
        .attr('class', 'divergence')
        .attr('x', (a) => xScale(a.mode) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.value) + 30)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text((a, idx) => {
          const divergence = (a.value - actual.value).toFixed(1)
          
          let text = ''
          if (divergence > 0) text += '+'
          text += `${divergence}%`

          return idx !== i ? text : '';
        })

    })

function decimalCut(x){
    return d3.format(".0f")(x)
};

console.log(decimalCut(12.8656787656));

barGroups // adds percentage value to a bar
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.mode) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.value))
    .attr('text-anchor', 'middle')
    .text((a) => `${decimalCut(a.value)}%`)

    

// chart.selectAll("text.chartBars")
//     .data(data)
//     .enter().append("text")
//     .attr("class", "bar")
//     .attr("text-anchor", "middle")
//     .attr("x", function(d) { return x(d.mode) + x.rangeBand()/2; })
//     .attr("y", function(d) { return y(d.value); })
//     .text(function(d) { return d.value; });




chart.append('g')
    .attr('class', 'grid')
    .style('opacity', 0.2)
    .style('stroke-dasharray','1 6') // the first number is the size of a line or and the second is spacing
    .call(d3.axisLeft()
        .scale(yScale)
        .tickSize(-innerWidth, 0, 0)
        .tickFormat(''))

    // svg.append('text')
    //     .attr('x', innerWidth / 2)
    //     .attr('y', 15)
    //     .attr('text-anchor', 'middle')
    //     .text('Transport Mode')

// text wrapping function
// function wrap(text, width) {
//     text.each(function() {
//       var text = d3.select(this),
//           words = text.text().split(/\s+/).reverse(),
//           word,
//           line = [],
//           lineNumber = 0,
//           lineHeight = 1.1, // ems
//           y = text.attr("y"),
//           dy = parseFloat(text.attr("dy")),
//           tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
//       while (word = words.pop()) {
//         line.push(word)
//         tspan.text(line.join(" "))
//         if (tspan.node().getComputedTextLength() > width) {
//           line.pop()
//           tspan.text(line.join(" "))
//           line = [word]
//           tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
//         }
//       }
//     })
//   }





}

