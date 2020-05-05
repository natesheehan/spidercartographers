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

const margin ={left:25, top:25, bottom:25, right:65};
const width = 400;
const height = 300;
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
    .attr('class','axis')
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
    .attr('class','axis')
    .attr('transform',`translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .attr('stroke-width',0);
    // .call(wrap, xScale.bandwidth());


//grid lines  
const grid = chart.append('g')

const gridLines = grid.append('g')
    .attr('class','gridLines')
    .style('stroke-dasharray','1 6') // the first number is the size of a line/dot and the second is spacing
    .style('stroke', 'fff3e0')
    .call(d3.axisLeft()
        .scale(yScale)
        .tickSize(-innerWidth, 0, 0)
        .tickFormat(''))

const barGroups = chart.selectAll()
    .data(data)
    .enter()
    .append('g')

//average transport modes usage, dont think we should keep any data here, but its so small so its here for now xd
const avgValsMap = {
    "work at home": 10.38,
    "on foot": 9.77,
    "bicycle":2.68,
    "car":60,
    "bus":7.3,
    "train":4.7,
    "underground":3.37
}




barGroups
    .append('rect')
    .style('fill', 'ffa372')
    .attr('x', (s) => xScale(s.mode))
    .attr('mode', (s) => s.mode)
    .attr('y', (s) => yScale(s.value))
    .attr('height', (s) => innerHeight - yScale(s.value))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function(data, i){
        
        const y = yScale(avgValsMap[data.mode])
        //thats the average national usage of transport modes lines
        const line = chart.append("svg:line")
                        .attr("id","averageLine")
                        .attr("x1", 0)
                        .attr("x2", innerWidth)
                        .attr("y1", y)
                        .attr("y2", y)
                        .style("stroke", "37a583")
                        .style('stroke-dasharray','5 6');

        const lineText = barGroups.append('g');


        lineText // adds percentage value to the average line
            .append('text')
            // .attr('class', 'value')
            // .attr('x', (a) => xScale(a.mode) + xScale.bandwidth() / 2)
            // .attr('y', (a) => yScale(a.value))
            // .attr('text-anchor', 'middle')
            // .style('fill', 'fff3e0')
            .attr('id', 'averageLineText')
            .attr('text-anchor', 'start')
            .attr("x", innerWidth)
            .attr("y", y)
            .text(avgValsMap[data.mode]+"%")
            .style('fill','37a583')

      
    })
    .on('mouseleave', function(){
        chart.selectAll('#averageLine').remove()
        chart.selectAll('#averageLineText').remove()
    })

function decimalCut(x){
    return d3.format(".0f")(x)
};

barGroups // adds percentage value to a bar
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.mode) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.value))
    .attr('text-anchor', 'middle')
    .style('fill', 'fff3e0')
    .text((a) => `${decimalCut(a.value)}%`)

// Legend
chart.append('text')
    .attr('id', 'Legend')
    .attr('text-anchor', 'end')
    .attr("x", innerWidth)
    .attr("y", 0)
    .text('national average')
    .style('fill','fff3e0')

chart.append("svg:line")
    .attr("id","averageLineLegend")
    .attr("x1", innerWidth -50)
    .attr("x2", innerWidth)
    .attr("y1", 10)
    .attr("y2", 10)
    .style("stroke", "37a583")
    .style('stroke-dasharray','5 6');



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

