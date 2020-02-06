var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv").then(function (newsdata) {


  newsdata.forEach(function (data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
  });


  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(newsdata, d => d.healthcare)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(newsdata, d => d.poverty)])
    .range([height, 0]);


  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);


  chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(newsdata)
    .enter()
    .append("tspan")
    .attr("x", function (data) {
      return xLinearScale(data.healthcare - 0);
    })
    .attr("y", function (data) {
      return yLinearScale(data.poverty - 0.22);
    })
    .text(function (data) {
      return data.abbr
    });




  var circlesGroup = chartGroup.selectAll("circle")
    .data(newsdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "green")
    .attr("opacity", "0.75");




  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
    });


  chartGroup.call(toolTip);


  circlesGroup.on("click", function (data) {
      toolTip.show(data, this);
    })

    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });


  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .text("Poverty (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Healthcare (%)");
}).catch(function (error) {
  console.log(error);
});