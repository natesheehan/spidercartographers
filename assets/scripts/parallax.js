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

  //MSOA variety of modes use chart

  const data=[
    {msoa:"MSOA 1", walking: 30, cycling: 25, car: 50, bus: 36, train: 70},
    {msoa:"MSOA 2", walking: 5, cycling: 10, car: 90, bus: 5, train: 5},
    {msoa:"MSOA 3", walking: 25, cycling: 25, car: 50, bus: 10, train: 15},
    {msoa:"MSOA 4", walking: 5, cycling: 7, car: 15, bus: 40, train: 80}
  ];
  
  const margin ={left:30, top:25};
  const width = 600;
  const height = 350;

  const svg = d3.select('svg');
  const chart = svg.append('g')
    .attr('transform',`translate(${margin.left}, ${margin.top})`);

  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 100]);
  
  chart.append('g')
    .call(d3.axisLeft(yScale));
    

  const xScale = d3.scaleBand()
    .range([0, width])
    .domain(data.map(function(d){
      return d.msoa
    }))
    .padding(0.2)

  chart.append('g')
    .attr('transform',`translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

    chart.selectAll()
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (s) => xScale(s.Mode))
    .attr('y', (s) => yScale(s.Value))
    .attr('height', (s) => height - yScale(s.Value))
    .attr('width', xScale.bandwidth())

    chart.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft()
        .scale(yScale)
        .tickSize(-width, 0, 0)
        .tickFormat(''))

        svg.append('text')
        .attr('x', width / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .text('Variety chart - MSOAs')

    // svg
    //   .on('mouseenter', function (actual, i) {
    //       d3.select(this).attr('opacity', 0.5)
    //   })
    //   .on('mouseleave', function (actual, i) {
    //     d3.select(this).attr('opacity', 1)
    // })

    .on('mouseenter', function (s, i) {
      d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.6)
          .attr('x', (a) => xScale(a.msoa) - 5)
          .attr('width', xScale.bandwidth() + 10)
  
      chart.append('line')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', width)
          .attr('y2', y)
          .attr('stroke', 'red')

    const barGroups = chart.selectAll()
      .data(data)
      .enter()
      .append('g')

      //it works up till here

            
        
  
      // this is only part of the implementation, check the source code
  })


    
      

  


});
