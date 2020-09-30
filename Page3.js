//svg for stacked graph
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    innerRadius = 180,
    outerRadius = Math.min(width, height) / 2 -30,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


//Radial Scale function
function scaleRadial() {
  var domain = [0, 1],
      range = [0, 1];

  function scale(x) {
    var r0 = range[0] * range[0], r1 = range[1] * range[1];
    return Math.sqrt((x - domain[0]) / (domain[1] - domain[0]) * (r1 - r0) + r0);
  }

  scale.domain = function(_) {
    return arguments.length ? (domain = [+_[0], +_[1]], scale) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range = [+_[0], +_[1]], scale) : range.slice();
  };

  scale.ticks = function(count) {
    return d3.scaleLinear().domain(domain).ticks(count);
  };

  scale.tickFormat = function(count, specifier) {
    return d3.scaleLinear().domain(domain).tickFormat(count, specifier);
  };

  return scale;
}

//Axises for Stacked graph
var x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0);

var y = scaleRadial()
    .range([innerRadius, outerRadius]);

var z = d3.scaleOrdinal(d3.schemeSet2)


//group elements chart 
var selection = g.append("g").selectAll("g")
var label = g.append("g")
    .selectAll("g")

var yAxis = g.append("g")
      .attr("text-anchor", "middle");

var legend = g.append("g")
    .selectAll("g")



function stackedRender(data, selection, label, yAxis, legend, innerRadius){
//    Determine domains
    x.domain(data.map(function(d) { return d.Country; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]);
    z.domain(data.columns.slice(1));
    
    
//    Enter phase with interactions and class assignments
    var newSelection = selection.data(d3.stack().keys(data.columns.slice(1))(data))
    var counter = 0
  newSelection
    .enter().append("g")
        .attr("class", d=> d.key)
        .attr("fill", function(d) { return z(d.key); })
    .selectAll("path")
    .data(d=>d)
    .enter().append("path")
    
        .attr("class", function(d){
      counter = counter+1
      if(counter<=32){return d.data.Country + "Animation"}
      else if(counter<=64){return d.data.Country + "Documentary"}
      else if(counter<=96){return d.data.Country + "Horror"}
      else if(counter<=128){return d.data.Country + "Fantasy"}
      else if(counter<=160){return d.data.Country + "Romance"}
      else if(counter<=192){return d.data.Country + "Drama"}
      else if(counter<=224){return d.data.Country + "Comedy"}
      })
    
        .attr("d", d3.arc()
                .innerRadius(function(d) { return y(d[0]); })
                .outerRadius(function(d) { return y(d[1]); })
                .startAngle(function(d) { return x(d.data.Country); })
                .endAngle(function(d) { return x(d.data.Country) + x.bandwidth(); })
                .padAngle(0.01)
                .padRadius(innerRadius))
    
        .on("mouseover", function(d){
      var allClasses = ["Animation","Documentary","Horror","Fantasy","Romance","Drama","Comedy"]
      var currentClass = d3.select(this.parentNode).attr("class")
      
      allClasses = allClasses.filter( d=> d!= currentClass)
      
      allClasses.forEach(function(d){
          d3.select("."+d)
            .attr("opacity",0.4)
      })
            
      d3.select("."+d3.select(this.parentNode).attr("class"))
            .attr("stroke","black")
            .attr("stroke-width","1px")
  })
    
    .on("mouseout", function(d){
        
      var allClasses = ["Animation","Documentary","Horror","Fantasy","Romance","Drama","Comedy"]
      var currentClass = d3.select(this.parentNode).attr("class")
      
      allClasses = allClasses.filter( d=> d!= currentClass)
      
      allClasses.forEach(function(d){
          d3.select("."+d)
            .attr("opacity",1)
      })
            
      d3.select("."+d3.select(this.parentNode).attr("class"))
            .attr("stroke","black")
            .attr("stroke-width","0px")
        
        })
    
    
        //    Update phase with interactions and class assignments
        var counter=0
        newSelection
            .attr("class", d=> d.key)
            .attr("fill", function(d) { return z(d.key); })
            .selectAll("path")
            .data(d=>d)
                 .attr("class", function(d){
                      counter = counter+1
                      if(counter<=32){return d.data.Country + "Animation"}
                      else if(counter<=64){return d.data.Country + "Documentary"}
                      else if(counter<=96){return d.data.Country + "Horror"}
                      else if(counter<=128){return d.data.Country + "Fantasy"}
                      else if(counter<=160){return d.data.Country + "Romance"}
                      else if(counter<=192){return d.data.Country + "Drama"}
                      else if(counter<=224){return d.data.Country + "Comedy"}
                      })
                        .attr("d", d3.arc()
                                .innerRadius(function(d) { return y(d[0]); })
                                .outerRadius(function(d) { return y(d[1]); })
                                .startAngle(function(d) { return x(d.data.Country); })
                                .endAngle(function(d) { return x(d.data.Country) + x.bandwidth(); })
                                .padAngle(0.01)
                                .padRadius(innerRadius))
                        .on("mouseover", function(d){
                        d3.select(this)
                            .attr("stroke","black")
                            .attr("stroke-width","1px")})
                            
        
//        Exit Phase
    newSelection.exit().remove()

    
//    Create labels   
    label = label.data(data)
    .enter().append("g")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "rotate(" + ((x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });
    
//    Small ticks
    label.append("line")
      .attr("x2", -5)
      .attr("stroke", "#000");
    
//    Country Names
    label.append("text")
      .attr("transform", function(d) {; return (x(d.Country) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
      .text(function(d) { return d.Country; })
      .style("font-size", "6px")
      .style("font-weight", "bold")
    
    
    
//    Radial axis Elements
    yAxis = g.append("g")
      .attr("text-anchor", "middle");
    
    var yTick = yAxis
    .selectAll("g")
    .data(y.ticks(5).slice(1))
    .enter().append("g");
    
    
    yTick.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("r", y);
    
    
    yTick.append("text")
      .attr("y", function(d) { return -y(d); })
      .attr("dy", "0.35em")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 5)
      .text(y.tickFormat(5, "s"));
    
    
    yTick.append("text")
      .attr("y", function(d) { return -y(d); })
      .attr("dy", "0.35em")
      .text(y.tickFormat(5, "s"));

    
    
    yAxis.append("text")
      .attr("y", function(d) { return -y(y.ticks(5).pop()); })
      .attr("dy", "-1em")
      .text("Mean Profit per Movie");
    
    
    
//    Add Legend
    legend = legend.data(data.columns.slice(1).reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(-40," + (i - (data.columns.length - 1) / 2) * 20 + ")"; });

    
    legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", z);
    
    
    legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(function(d) { return d; });

    
}



//For sequencial transitions
function setDelay(genre,t){setTimeout(function(){
        d3.select("." + genre).selectAll("path").transition().duration(1000).attr("transform","scale(0,0)")
        }, t);}


//Do transitions when user choose a genre
function update(currentGenre){
    var allGenres = ["Animation","Documentary","Horror","Fantasy","Romance","Drama","Comedy"]

//        Remove 
        var removal = allGenres.filter(d => d != currentGenre)
        var t = 500
        removal.forEach(function(d){setDelay(d,t);t = t+500})
        
//        Change Location
        var genreData = d3.select('.'+currentGenre).data()
        const storeGenre = currentGenre
        
        setTimeout(() =>{
        genreData[0].forEach(function(d){
            d3.select("." + d.data.Country + currentGenre).transition().duration(1000)
                .attr("d", d3.arc()
                .innerRadius(180)
                .outerRadius(y(d[1] - d[0]))
                .startAngle(x(d.data.Country))
                .endAngle(x(d.data.Country) + x.bandwidth())
                .padAngle(0.01)
                .padRadius(250))})
            },3500)
    setTimeout(() =>{
        d3.select(".bar" + currentGenre).attr("display",null);
        d3.select("."+ currentGenre + "title").attr("display",null);
        d3.selectAll("."+ currentGenre + "text").attr("display",null);
        d3.select("#Explanation").attr("display",null);
    
    },4500)
        
    }



function numberFormat(number){
        return d3.format("$.2s")(number).replace("G","B")
    }







d3.json("top.json", function(data) {
    var comedy = data[0].Comedy;
    var drama = data[1].Drama
    var romance = data[2].Romance
    var fantasy = data[3].Fantasy
    var horror = data[4].Horror
    var documentary = data[5].Documentary
    var animation = data[6].Animation
    
    
    
        //svg for bar chart
    const svg2 = d3.select("#tops");
    const width2 = 500;
    const height2 = 500;
    const margin = {top:40, right:20, left:90, bottom:50};
    const innerWidth2 = width2 - margin.left - margin.right;
    const innerHeight2 = height2 - margin.top - margin.bottom;

    function renderBar(data,genre, number){
    
//        Draw Axis and add text labels
    var xVal = Object.keys(data).map(i => data[i].amount);
    var yVal = Object.keys(data).map(i => data[i].Country);
    
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(xVal)])
        .range([0,innerWidth2]);

    
    const yScale = d3.scaleBand()
        .domain(yVal)
        .range([0,innerHeight2])
        .padding(0.1);
    
    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(numberFormat);
    
    
    var g2 = svg2.append("g")
        .attr("class", () => "bar"+genre)
        .attr('transform',`translate(${margin.left},${margin.top})`);
        
        
    g2.append("g").call(yAxis)
        .selectAll('.domain, .tick line')
          .remove();
    
    
    const xAxisG = g2.append("g").call(xAxis)
        .attr("transform",`translate(0,${innerHeight2})`);
    
    xAxisG.select('.domain').remove()
    
    xAxisG.append('text')
        .attr('x',innerWidth2/2)
        .attr('y',40)
        .attr('fill','black')
        .text("Mean Profit per Movie")
    
    
    g2.append('text')
        .text('Top 5 Countries')
    
        
//        Add bars
    g2.selectAll("rect").data(data)
        .enter().append("rect")
          .attr('y', d => yScale(d.Country))
          .attr("width", d => xScale(d.amount))
          .attr("height",yScale.bandwidth())
          .attr("fill",d3.schemeSet2[number]);
    
}
    
//    Create all of the bar charts
    renderBar(animation,"Animation",0)
    renderBar(documentary,"Documentary",1)
    renderBar(horror,"Horror",2)
    renderBar(fantasy,"Fantasy",3)
    renderBar(romance,"Romance",4)
    renderBar(drama,"Drama",5)
    renderBar(comedy,"Comedy",6)
    
//    Dont display bar charts
    d3.select(".barAnimation").attr("display","none")
    d3.select(".barDocumentary").attr("display","none")
    d3.select(".barHorror").attr("display","none")
    d3.select(".barFantasy").attr("display","none")
    d3.select(".barRomance").attr("display","none")
    d3.select(".barDrama").attr("display","none")
    d3.select(".barComedy").attr("display","none")
    
    
//    Dont display text boxes
    d3.select(".Animationtitle").attr("display","none")
    d3.selectAll(".Animationtext").attr("display","none")
    d3.select(".Documentarytitle").attr("display","none")
    d3.selectAll(".Documentarytext").attr("display","none")
    d3.select(".Horrortitle").attr("display","none")
    d3.selectAll(".Horrortext").attr("display","none")
    d3.select(".Fantasytitle").attr("display","none")
    d3.selectAll(".Fantasytext").attr("display","none")
    d3.select(".Romancetitle").attr("display","none")
    d3.selectAll(".Romancetext").attr("display","none")
    d3.select(".Dramatitle").attr("display","none")
    d3.selectAll(".Dramatext").attr("display","none")
    d3.select(".Comedytitle").attr("display","none")
    d3.selectAll(".Comedytext").attr("display","none")
    d3.select("#Explanation").attr("display","none")
    
    
    })





d3.csv("genre_country.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error; 
  
    stackedRender(data,selection,label,yAxis,legend,180);   
    
})





