function drawBarChart(attributes,country){             
    var data = [];
    var barTip = d3.tip()
                  .attr('class','d3-tip')
                  .offset([-10,0])
                  .html(function(d){
                    return "<span class='details'>" + d.value+"</span>"; 
                  })                                              
    
    chart_data = JSON.parse(attributes.chart_data);
    for(i in chart_data[0]){

      data.push({"area":attributeJson[i], "value":chart_data[0][i]});
    }
  
  if(d3.select('#barChart svg')) d3.select('#barChart svg').remove();

  $("#barChart").html("<center><span style='font-size:20px; color: white'><strong>"+country+"</strong></span></center>");

  var margin = {top: 0, right:0, bottom:0, left:0};
  var svgbar = d3.select("#barChart")
            .append("svg")
            .attr("width", 475 + margin.left + margin.right)
            .attr("height", 220 + margin.top + margin.bottom)
            .append("g")
  
  svgbar.call(barTip);              
  width = 350 - margin.left - margin.right,
  height = 200 - margin.top - margin.bottom;
            
  var tooltip = d3.select("body").append("div").attr("class", "toolTip");
  
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleBand().range([height, 0]);

  var g = svgbar.append("g")
          .attr("transform", "translate(120,0)");
      
    x.domain([0, d3.max(data, function(d) { return d.value; })]);
    y.domain(data.map(function(d) { return d.area; })).padding(0.1);

  g.append("g")
      .attr("class", "x-axis")
         .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]));

  g.append("g")
      .attr("class", "y-axis")
      .attr("font-size",15)
      .call(d3.axisLeft(y));

      g.selectAll(".bar")
      .data(data)
    .enter().append("rect")        
    .on("mouseover", function(d){
      barTip.show(d);

                d3.select(this)
                  .style("opacity", 1)
                  .style("stroke","white")
                  .style("stroke-width",3);
      })
          .on("mouseout", function(d){ 
      barTip.hide(d);
          d3.select(this)
            .style("stroke","white")
            .style("stroke-width",0.3);                  
      })
      .attr("class", "bar")                
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("y", function(d) { return y(d.area); })
      .transition()        
      .duration(4500)
      .delay(function (d, i) {
                    return i * 50;
                })
      .ease(d3.easeElastic)
      .attr("width", function(d) { return x(d.value); });
      return chart_data;
  }