d3.json("data3.json",function(data){
    
    
    console.log(data)
    
    
//    Create a poster to modify later
    var posterg=d3.select("#Posters")
        .append("g")
    posterg.selectAll("image").data("0").enter().append("image")

//    Function to render poster using URL
    function showPoster(posterURL){
        var posters = posterg.selectAll("image").data(posterURL);
        
        posters 
            .enter().append("image")
            .merge(posters)
            .attr("xlink:href", d => d)
            .attr("width",400)
            .attr("height",400)
            .style("display", null)
        
        posters.exit().remove()
    }
    
//    Text elements for information box
   var info = d3.select("#Info").append("g")
   
   info.append("rect")
        .attr("id","inforect")
        .attr("width",400)
        .attr("height",180)
        .attr("stroke-width", 5 )
        .attr("stroke", "black")
        .style("fill","beige")
   
   
   info.append("text")
        .attr('class','Title')
        .attr("dy", "2em")
        .text("1")
        .attr("fill",'black')
   
   
    info.append("text")
        .attr('class','Year')
        .attr("dy", "2em")
        .text("1")
        .attr("fill",'black')
        .attr('y',20)
        
    
     info.append("text")
        .attr('class','Director')
        .attr("dy", "2em")
        .text("2")
        .attr("fill",'black')
        .attr('y',40)
    
     info.append("text")
        .attr('class','Awards')
        .attr("dy", "2em")
        .text("3")
        .attr("fill",'black')
        .attr('y',60)
    
    info.append("text")
        .attr('class','Profit')
        .attr("dy", "2em")
        .text("4")
        .attr("fill",'black')
        .attr('y',80)
    
    info.append("text")
        .attr('class','Platform')
        .attr("dy", "2em")
        .text("5")
        .attr("fill",'black')
        .attr('y',100)
    
    info.append("text")
        .attr('class','Rating')
        .attr("dy", "2em")
        .text("6")
        .attr("fill",'black')
        .attr('y',120)
    
    info.selectAll("text").attr("display","none");
    info.select("rect").attr("display","none");
   
   
    
    
//    SVG for Plot itself
    var svg = d3.select("svg");
    var width = +svg.attr("width");
    var height = +svg.attr("height");
    
    var margin = {top:140, right:50, left:90, bottom:50};
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;
    
    
    
//    Required scales and axis
    var colorScale = d3.scaleOrdinal()
            .domain(["IMDb","TMDb"])
            .range(["#F0C749","#61D27D"]);
    
    
    
    var xValue =  Object.keys(data).map(i => data[i].Profit);
    var voteCounts = Object.keys(data).map(i => data[i].Vote_Count);
    var tmdb = data.filter(d=> d.Platform ==="TMDb");
    var imdb = data.filter(d=> d.Platform ==="IMDb");
    var imdbRating =  Object.keys(imdb).map(i => imdb[i].Rating);
    var tmdbRating =  Object.keys(tmdb).map(i => tmdb[i].Rating);
    
    

    
    console.log("asS")
    
    var xScale = d3.scaleLinear()
        .domain(d3.extent(xValue))
        .range([0,innerWidth]);
    
    var yScale = d3.scaleLinear()
        .domain([0,10])
        .range([innerHeight,0]);
    
    var radiusScale = d3.scaleSqrt()
        .domain([0,d3.max(voteCounts)])
        .range([0,10]);
    
    
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);
    
    
    
    function numberFormat(number){
        return d3.format("$.2s")(number).replace("G","B")
    }
    
//    Text elements for axis labels and plot title
    var g = svg.append("g")
        .attr('transform',`translate(${margin.left},${margin.top})`);
    
    var yElemet = g.append("g").call(yAxis).attr("class","yAxis");
    var xElement = g.append("g").call(xAxis.ticks(10).tickFormat(numberFormat))
        .attr("transform",`translate(0,${innerHeight})`)
        .attr("class","xAxis");
    
    g.append("text")
        .attr("id","PlotTitle")
        .text("Rating vs Profit Plot")
        .attr("x",350)
        .attr("y", -20)
     
    xElement.append("text")
        .attr("id","xAxisLabel")
        .text("Profit")
        .attr("fill",'black')
        .attr("x",840)
        .attr("y", 5)
    
    
    yElemet.append("text")
        .attr("id","yAxisLabel")
        .text("Average User Rating")
        .attr("fill",'black')
        .attr("transform","translate(-30,120) rotate(-90)")
    
    
    
    
    const render = d => {
        
        var ModifiedxValue =  Object.keys(d).map(i => d[i].Profit)
        
//        Rescale X axis
        xScale.domain(d3.extent(ModifiedxValue))
        d3.select(".xAxis").transition().duration(1000).call(d3.axisBottom(xScale).ticks(10).tickFormat(numberFormat))

        //Enter Phase        
        var myCircle=g.selectAll("circle").data(d);
        myCircle
            .enter()
            .append("circle")
            .attr("cx",d => xScale(d.Profit))
            .style("fill", d=> colorScale(d.Platform))
            .attr("fill-opacity",0.6)
            .on("mouseover",function(d){
            
                var currentTitle=d.Title
                var currentProfit =d.Profit
                var currentRating = d.Rating
                var currentPlatform = d.Platform

                d3.select(this).attr("fill-opacity",1)
                    .attr("stroke-width",1)
                    .attr("stroke","black")

            
//                API request
                d3.json("http://www.omdbapi.com/?i=" + d.movie_id + "&apikey=3f49586a", function(response){
                    
//                    Get Response and get the required information from it
                        var posterURL = response.Poster
                        var awards = response.Awards
                        var director = response.Director
                        var year = response.Year
                        
                        showPoster([posterURL])
                    
                        
                        info.select(".Title")
                            .text("" + currentTitle)
                    
                        info.select(".Year")
                            .text("Year: " + year)
                        
                        info.select(".Director")
                            .text("Director: " + director)
                        
                        info.select(".Awards")
                            .text("Awards: " + awards)
                        
                        info.select(".Profit")
                            .text("Profit: " + numberFormat(currentProfit))
                    
                        info.select(".Platform")
                            .text("Platform: " + currentPlatform)
                        
                        info.select(".Rating")
                            .text("Rating: " + currentRating)
                    
                        info.selectAll("text").attr("display",null);
                        info.select("rect").attr("display",null);

        })
    })
            .on("mouseout",function(d){
            
            info.selectAll("text").attr("display","none");
            info.select("rect").attr("display","none");
            
            d3.select(this)
                .attr("fill-opacity",0.6)
                .attr("stroke-width",0);
            
                showPoster([])
            
        })
            .transition().duration(1000)
            .attr("cy",d => yScale(d.Rating))
            .attr("r", d => radiusScale(d.Vote_Count))
            
//        Update Phase
        myCircle
            .attr("cx",d => xScale(d.Profit))
            .attr("cy",d => yScale(d.Rating))
            .style("fill", d=> colorScale(d.Platform))
            .attr("fill-opacity",0.6)
            .transition().duration(1000)
            .attr("r", d => radiusScale(d.Vote_Count))
        //Exit Phase
        myCircle
            .exit()
              .transition().duration(1000)
              .attr('cy',height+10)
              .remove();
            
    
    }
 
    

//    Every Time user changes any of the filters call this function to re render with fitlered data
    function update(){
        var minProfit = +d3.select("#mySlider").property("value")
        var minRating = +d3.select("#mySlider2").property("value")
        
        var arrayPlatforms = []
        if(d3.select(".checkboxIMDb").property("checked")){arrayPlatforms.push("IMDb")}
        if(d3.select(".checkboxTMDb").property("checked")){arrayPlatforms.push("TMDb")}
        
        var arrayGenres = []
        d3.selectAll(".checkboxGenre").each(function(d){
            var cbGenre = d3.select(this)
            var currentGenre = cbGenre.property("value")
            if(cbGenre.property("checked")){ arrayGenres.push(currentGenre)}
        })
        
        var profitFiltered = data.filter(d => d.Profit > minProfit)
        var ratingFiltered2 = profitFiltered.filter(d => d.Rating >= minRating)
        var genreFiltered3 = ratingFiltered2.filter(d => arrayGenres.indexOf(d.Genre)!=-1)
        var platformFiltered4 = genreFiltered3.filter(d => arrayPlatforms.indexOf(d.Platform)!=-1)
        
        d3.select(".platformFilters").text("Min. Profit: "+numberFormat(d3.select("#mySlider").property("value")))

        render(platformFiltered4)
    }
    
    
    
   

    
    update();
    render(data);
    
//    Event Listeners
    d3.select(".checkboxTMDb").on("change",update);
    d3.select(".checkboxIMDb").on("change",update);
    d3.select("#mySlider").on("change", update);
    d3.select("#mySlider2").on("change", update);
    d3.selectAll(".checkboxGenre").on("change",update);
    
    
//    To render current value of the filters
    var forFilters = d3.select("#filterTexts").append("g")
        .attr("transform","translate(0,0)")
    
    forFilters.append("text").attr("class","platformFilters")
        .text("Min. Profit: "+numberFormat(d3.select("#mySlider").property("value")))
        .attr("x",10)
        .attr("y",40)
        .attr("fill",'black')
    
    
    
//    Add legend
    var legend = svg.append("g")
        .attr('transform',`translate(${margin.left},${margin.top})`);
    
    legend.append("g").selectAll("circle").data([data[0],data[1],data[2],data[3]])
        .enter()
        .append("circle")
        .attr("cx",720)
        .attr("cy", function(d,i){return 250+ i*40} )
        .attr("r",function(d,i){return radiusScale(500000+500000*i)} )
        .style("fill","black")
        .attr("fill-opacity",0.6)
    
    legend.append("g").selectAll("circle").data([data[0],data[1]])
        .enter()
        .append("circle")
        .attr("cx",600)
        .attr("cy", function(d,i){return 250+ i*40} )
        .attr("r",5)
        .style("fill",function(d,i){
        if(i==0){return colorScale("IMDb")}
        else{return colorScale("TMDb")}})
        .style("fill-opacity",0.6)
    
    
    var texts = legend.append("g")
    
    texts.append("text")
        .attr("class","legendCountHeader")
        .attr("dy","2em")
        .text("Number of Votes")
        .attr("x",700)
        .attr("y",200)
    
    
    texts.append("text")
        .attr("class","legendCount")
        .attr("dy","2em")
        .text("500K")
        .attr("x",730)
        .attr("y",222)
    
    texts.append("text")
        .attr("class","legendCount")
        .attr("dy","2em")
        .text("1M")
        .attr("x",730)
        .attr("y",263)
    
    texts.append("text")
        .attr("class","legendCount")
        .attr("dy","2em")
        .text("1.5M")
        .attr("x",730)
        .attr("y",303)
    
    
    texts.append("text")
        .attr("class","legendCount")
        .attr("dy","2em")
        .text("2M")
        .attr("x",733)
        .attr("y",343)
    
    
    
    texts.append("text")
        .attr("class","legendColorHeader")
        .attr("dy","2em")
        .text("Platforms")
        .attr("x",590)
        .attr("y",200)
    
    texts.append("text")
        .attr("class","legendColor1")
        .attr("dy","2em")
        .text("IMDb")
        .attr("x",610)
        .attr("y",222)
    
    texts.append("text")
        .attr("class","legendColor1")
        .attr("dy","2em")
        .text("TMDb")
        .attr("x",610)
        .attr("y",262)

    

})