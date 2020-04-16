jQuery(document).ready(function(){
 $(window).scroll(function(e){
   parallaxScroll();
 });

 function parallaxScroll(){
   var scrolled = $(window).scrollTop();
   $('#parallax-bg-1').css('top',(0-(scrolled*.25))+'px');
   $('#parallax-bg-2').css('top',(0-(scrolled*.4))+'px');
   $('#parallax-bg-3').css('top',(0-(scrolled*.75))+'px');
 }

  //  displaying increasing numbers function
  $('.percText').counterUp({
    delay: 10,
    time: 1000
  });

  //variety chart
  const margin = 60;
  const width = 680;
  const height = 400;

  const svg = d3.select('svg');
  const chart = svg.append('g')
    .attr('transform',`translate(${margin}, ${margin})`);

  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 100]);
  
  chart.append('g')
    .call(d3.axisLeft(yScale));

  const xScale = d3.scaleBand()
    .range([0, width])
    .domain(['a','b','c'].map((s)=>s))
    .padding(0.2)

  chart.append('g')
    .attr('transform',`translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  


});
