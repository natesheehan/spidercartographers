export const drawChart = (a,b,c,d,e,f,g) => {
const data2 = [a,b,c,d,e,f,g];

const margin ={left:30, top:25};
const width = 300;
const height = 150;
debugger
d3.selectAll("svg").remove(); 
debugger
const svg = d3.select('.interactiveChart')
.append("svg")
    .attr("width", width)
    .attr("height", height);


const rectangles = svg.selectAll("rect")
    .data(data2);

rectangles.enter()
    .append("rect")
        .attr("x", 2 )
        .attr("y",function(d,i){
            return (i*20)+10;
        })
        .attr("width", function(d){
            return d
        })
        .attr("height", 15);

    }
