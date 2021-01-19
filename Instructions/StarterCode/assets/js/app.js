// // @TODO: YOUR CODE HERE!
//Using the D3 techniques we taught you in class, 
// create a scatter plot that represents each state with circle elements. 
// You'll code this graphic in the app.js file of your 
// homework directory—make sure you pull in the data from data.csv by using the d3.csv function. 
// Your scatter plot should ultimately appear like the image at the top of this section.


// Include state abbreviations in the circles.


// Create and situate your axes and labels to the left and bottom of the chart.


// Note: You'll need to use python -m http.server to run the visualization. 
// This will host the page at localhost:8000 in your web browser.

var svgWidth= 960;
var svgHeight= 500;
var margin= {
    top: 20,
    right: 40, 
    bottom: 80,
    left: 100
};

var width = svgWidth -margin.left-margin.right;
var height = svgHeight-margin.top- margin.bottom;

var svg = d3. select('.chart').append('svg').attr('width', svgWidth).attr('height', svgHeight);

var chartGroup= svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

var chosenXaxis = 'poverty';
function xScale(data, chosenXaxis){
    var xLinearScale = d3. scaleLinear()
        .domain([d3.min(data, d=>d[chosenXaxis])*0.8, 
        d3.max(data, d=>d[chosenXaxis])*1.2
    ])
    .range([0,width]);
    return xLinearScale;
};

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  };

  function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  };

  function updateToolTip(chosenXAxis, circlesGroup){

      var label;
      
      if (chosenXaxis === 'poverty'){
          label = 'Poverty:';
      }
      else{
          label ='Age'
      }

      var toolTip = d3.tip()
        .attr('class', 'tooltip')
        .offset([80,-60])
        .html(function(d){
            return (`${d.healthcare}<br>${label} ${d[chosenXAxis]}`)
        });

    circlesGroup.call(toolTip);
    circlesGroup.on('mouseover', function(data){
        toolTip.show(data);
    })
        .on('mouseout', function(data, index){
            toolTip.hide(data);
        })
    return circlesGroup;
  }

  d3.csv('assets/data/data.csv').then(function(data, err){
      if (err) throw err;
    //   console.log(data)
    data.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
    });

    var xLinearScale =xScale(data, chosenXaxis);

    var yLinearScale= d3.scaleLinear()
        .domain([0,d3.max(data, d=> d.healthcare)])
        .range([height, 0]);
    var bottomAxis= d3.axisBottom(xLinearScale);
    var leftAxis= d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append('g')
        .classed('x-axis',true)
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .call(leftAxis);
    var circlesGroup= chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d=> xLinearScale(d[chosenXaxis]))
        .attr('cy',d=> yLinearScale(d.healthcare))
        .attr('r',20)
        .attr('fill', 'pink')
        .attr('opacity', '.5');

    var labelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${width/2}, ${height +20})`);
    var povertyLevel = labelsGroup.append('text')
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty");
    var ageLevel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("age");
    
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Healthcare");

    var circlesGroup = updateToolTip(chosenXaxis, circlesGroup);
    labelsGroup.selectAll('text')
        .on('click',function(){
            var value =d3.select(this).attr('value');
            if(value !== chosenXaxis){
                chosenXaxis=value;
                xLinearScale=xScale(data, chosenXaxis);
                xAxis= renderAxes(xLinearScale, xAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
                if (chosenXAxis === "poverty") {
                    povertyLevel
                      .classed("active", true)
                      .classed("inactive", false);
                    ageLevel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
                  else {
                    povertyLevel
                      .classed("active", false)
                      .classed("inactive", true);
                    ageLevel
                      .classed("active", true)
                      .classed("inactive", false);
                  }
            }
        })
  }).catch(function(error){
      console.log(error);
  });