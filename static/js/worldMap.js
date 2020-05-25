function createWorldMap(selected_month)
      {
        function zoomed() {
          const {transform} = d3.event;
          g.attr("transform", transform);
          g.attr("stroke-width", 1 / transform.k);
        }
        if(d3.select('#worldMap svg')) d3.select('#worldMap svg').remove();
        var format = d3.format(",");
        const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

        var tip = d3.tip()
                    .attr('class','d3-tip')
                    .offset([-10,0])
                    .html(function(d){
                      return "<strong>Country: </strong><span class='details'>"+ d.properties.name +"<br></span>"+"<strong>Confirmed Cases: </strong><span class='details'>" + d.total_cases+"</span>"; 
                    })        

        var margin = {top: 0, right: 0, bottom: 0, left: -175},
                      width = 750 - margin.left - margin.right;
                      height = 900 - margin.top - margin.bottom;
        
        var padding = 20;

        var colorScheme = d3.schemeBlues[6];
        colorScheme.unshift("#eee")
        
        var color = d3.scaleThreshold()
            .domain([1,1001,10001,50001,100001,500001,1000001])
            .range(colorScheme);
        var path = d3.geoPath();

        
    
        var svgmap = d3.select("#worldMap")
                    .append("svg")
                    .attr("width",600)
                    .attr("height",380)
                    .attr("transform", "translate(20,-20)")
                    .append("g")
                    .attr("class","map")
                    .attr("transform", "translate(130,-180)");
                    
        var g = svgmap.append("g")
          .attr("class", "legendThreshold")
          .attr("transform", "translate(-120,420)");

         g.append("text")
          .attr("class", "caption")
          .attr("x", 0)
          .attr("y", -6)
          .text("#Confirmed Cases");
      
      svgmap.call(zoom);

      var labels = ['0-1000', '1001-10000', '10001-50000', '50001-100000','100001-500000','500001-1 Million','>1 Million'];
      var legend = d3.legendColor()
          .labels(function (d) { return labels[d.i]; })
          .shapePadding(4)
          .scale(color);
      svgmap.select(".legendThreshold")
          .call(legend);
         var projection = d3.geoMercator()
                            .scale(90)
                            .translate([width/2, height/1.5]);
         var path = d3.geoPath().projection(projection);
         svgmap.call(tip);
         queue()
          .defer(d3.json, "https://raw.githubusercontent.com/jdamiani27/Data-Visualization-and-D3/master/lesson4/world_countries.json")
          .defer(d3.csv, "/static/json/covid_"+selected_month+".csv") 
          .await(createMap);

          function createMap(error, data, rank) {
          var rankById = {};
          for(var r in rank){
              if(rank[r]['total_cases']== undefined){
                  delete rank[r];
              }
          }
          rank.forEach(function(d) {rankById[d.iso_code] = +d['total_cases']; });
          data.features.forEach(function(d) { 
           d.total_cases = rankById[d.id];});
          
        
          

          svgmap.append("g")
              .attr("class", "countries")
            .selectAll("path")
              .data(data.features)
            .enter().append("path")
              .attr("d", path)
              .style("fill", function(d) { return color(rankById[d.id]); })
              .style('stroke', 'white')
              .style('stroke-width', 1.5)
              .style("opacity",0.8)
              .attr("transform", "translate(-300,-150)")
              // tooltips
                .style("stroke","white")
                .style('stroke-width', 0.3)
                .on('mouseover',function(d){                    
                  if(d.total_cases>0){
                    tip.show(d);  
                    d3.select(this)
                    .style("opacity", 1)
                    .style("stroke","white")
                    .style("stroke-width",3);
                  }
                })
                .on('mouseout', function(d){                                    
                    tip.hide(d);
                    d3.select(this)
                      .style("opacity", 0.8)
                      .style("stroke","white")
                      .style("stroke-width",0.3);                  
                })
                .on('click',function(d){
                  if(d.total_cases>0){
                    createBarChart(d,selected_month);  
                    createPC(d,selected_month);
                       
                  }                                                        
                });

          svgmap.append("path")
              .datum(topojson.mesh(data.features, function(a, b) { return a.iso_code !== b.iso_code; }))
              .attr("class", "names")
              .attr("d", path);
        }
      }