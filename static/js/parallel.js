function drawPC(attributes)
{
    if(d3.select('#pcStats svg')) d3.select('#pcStats svg').remove();
    data = [];
      chart_data = JSON.parse(attributes.chart_data);
      for(var i=0;i<chart_data.length;i++){                  
        data.push(chart_data[i]);
      }
    var margin = {top: 0, right: 40, bottom: 20, left: 500},
    width = 1640 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
      dimHeight = 500 - margin.top - margin.bottom;
      rangeArray = [];
      len = data.length;
      for(var i=0;i<len;i++){        
        if(i==len-1){
          rangeArray.push(Math.round(dimHeight));            
        }else{
          rangeArray.push(Math.round((i*dimHeight)/len)); 
        }
        
      }
      rangeArray.push(dimHeight);
      console.log(rangeArray);

var dimensions = [
  {
    name: "location",
    scale: d3.scalePoint().range([0,dimHeight]),
    type: "string"
  },
  {
    name: "total_cases",
    scale: d3.scaleLinear().range([dimHeight,0]),
    type: "number"
  },
  {
    name: "total_deaths",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },
  {
    name: "population",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },
  {
    name: "population_density",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },
  {
    name: "gdp_per_capita",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },
  {
    name: "cvd_death_rate",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },
  {
    name: "median_age",
    scale: d3.scaleLinear().range([dimHeight, 0]),
    type: "number"
  },

  {
    name: "continent",
    scale: d3.scaleOrdinal().range(rangeArray),
    type: "string"
  }
];

var x = d3.scaleOrdinal()
    .domain(dimensions.map(function(d) {return d.name; }))
    .range([0,width/8, 2*width/8,3*width/8,4 * (width/8),5*(width/8),6 * (width/8),7*(width/8),width]);
    
var line = d3.line()
    .defined(function(d) { return !isNaN(d[1]); });

var yAxis = d3.axisLeft();

var svgpar = d3.select("#pcStats").append("svg")
    .attr("width", 1400)
    .attr("height", 600)
    .attr("align","center")
  .append("g")
    .attr("transform", "translate(200,70)");

 dim = svgpar.selectAll(".dimension")
        .data(dimensions)
    .enter().append("g")
        .attr("transform", function(d) {return "translate(" + x(d.name) + ")"; });

  dimensions.forEach(function(dimension) {
    dimension.scale.domain(dimension.type === "number"
        ? d3.extent(data, function(d) { return +d[dimension.name]; })        
        : data.map(function(d) { return d[dimension.name]; }).sort());
  });

  svgpar.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", draw);

      svgpar.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", draw);

  dim.append("g")
      .attr("class", "axis")
    .each(function(d) {d3.select(this).call(yAxis.scale(d.scale)); })
    .append("text")
    .style('color','white')
      .attr("class","title")
      .attr("text-anchor", "start")      
      .attr("y", -9)
      .text(function(d) { return attributeJson[d.name]; });

  var ordinal_labels = svgpar.selectAll(".axis text")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  var projection = svgpar.selectAll(".background path,.foreground path")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  function mouseover(d) {
    svgpar.classed("active", true);

    if (typeof d === "string") {
      projection.classed("inactive", function(p) { return p.name !== d; });
      projection.filter(function(p) { return p.name === d; }).each(moveToFront);
      ordinal_labels.classed("inactive", function(p) { return p !== d; });
      ordinal_labels.filter(function(p) { return p === d; }).each(moveToFront);
    } else {
      projection.classed("inactive", function(p) { return p !== d; });
      projection.filter(function(p) { return p === d; }).each(moveToFront);
      ordinal_labels.classed("inactive", function(p) { return p !== d.name; });
      ordinal_labels.filter(function(p) { return p === d.name; }).each(moveToFront);
    }
  }

  function mouseout(d) {
    svgpar.classed("active", false);
    projection.classed("inactive", false);
    ordinal_labels.classed("inactive", false);
  }

  function moveToFront() {
    this.parentNode.appendChild(this);
  }


function draw(d) {    
  return line(dimensions.map(function(dimension) {
    return [x(dimension.name), dimension.scale(d[dimension.name])];
  }));
}
}