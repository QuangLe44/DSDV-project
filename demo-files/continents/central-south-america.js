const w = 1100;
const h = 800;
const p = 100;

function task7() {
    d3.csv(
        "https://raw.githubusercontent.com/QuangLe44/DSDV-project/main/csv/Central%20%26%20South%20America/Central%20%26%20South%20America%20-%20net%20generation.csv",
        function (error, data) {
            if (error) {
                console.log(error);
            } else {
                console.log(data);

                var netGenerationData = [];
                var bisectedDate = d3.bisector(function(d) { return d.Date; }).left;

                data.forEach(function (d) {
                    var country = d['Country'];
                    
                    for (var [key, value] of Object.entries(d)) {
                        if (key !== 'Country' && key !== 'Features') {
                            var date = new Date(key);
                            if (date >= new Date('1980') && date <= new Date('2021')) {
                                netGenerationData.push({
                                    Country: country,
                                    Date: date,
                                    Net: +value
                                })
                            }
                        }
                    }
                })

                var nestedData = d3.nest()
                    .key(d => d.Country)
                    .entries(netGenerationData);
                
                // Sort countries based on maximum Net generation values
                nestedData.sort((a, b) => d3.max(b.values, d => d.Net) - d3.max(a.values, d => d.Net));

                // Select the top 5 countries
                var top5Countries = nestedData.slice(0, 5);

                var colors = ['#ff0000', '#00cc00', '#3498DB', '#C6C613', '#BB8FCE'];
            
                let cScale = d3.scaleOrdinal(colors);

                let svg = d3
                    .select(".task7")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("padding", p);
                
                let xScale = d3.scaleTime()
                    .domain(d3.extent(netGenerationData, d => d.Date))
                    .range([p, w - p * 1.6]);
                
                let yScale = d3.scaleLinear()
                    .domain([0, d3.max(netGenerationData, d => d.Net)])
                    .range([h - p, p]);
                
                let line = d3
                    .line()
                    .x(function (d) {
                      return xScale(d.Date); // xScale
                    })
                    .y(function (d) {
                      return yScale(d.Net); // ySCale
                    });
                
                let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat("%Y"));
                let yAxis = d3.axisLeft(yScale);

                svg
                    .append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (h - p) + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-0.8em")
                    .attr("dy", "0.15em")
                    .attr("transform", "rotate(-45)");

                svg
                    .append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + p + ", 0)")
                    .call(yAxis);
                
                svg.selectAll(".line")
                    .data(top5Countries)
                    .enter()
                    .append("path")
                    .attr("class", "line")
                    .attr("d", d => line(d.values))
                    .style("stroke", d => cScale(d.key))
                    .style("stroke-width", 4)
                    .style("fill", "none");
                
                // Add lines for other countries in grey
                svg.selectAll(".line")
                    .data(nestedData.filter(d => !top5Countries.map(c => c.key).includes(d.key)))
                    .enter()
                    .append("path")
                    .attr("class", "line")
                    .attr("d", d => line(d.values))
                    .style("stroke", "grey")
                    .style("stroke-width", 1)
                    .style("fill", "none");
                
                // Add legends
                var legend = svg.selectAll(".legend")
                    .data(top5Countries)
                    .enter()
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });
                
                legend.append("rect")
                    .attr("x", w - p * 1.4)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", d => cScale(d.key));
                
                legend.append("text")
                    .attr("x", w - p * 1.4 + 25)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "start")
                    .style("fill", d => cScale(d.key))
                    .text(d => d.key);
                
                    svg
                    .append("text")
                    .text("Year")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "middle")
                    .attr("x", w / 2)
                    .attr("y", h - p * 0.4)
                    .attr("font-size", 15)
                    .attr("font-weight", "bold");
                
                svg
                    .append("text")
                    .text("Electricity Net Generation")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "middle")
                    .attr("x", -h / 2)
                    .attr("y", p / 2)
                    .attr("font-size", 15)
                    .attr("font-weight", "bold")
                    .attr("transform", "rotate(-90)");
                
                svg
                    .append("text")
                    .text("Multiple Line Graph of Electricity Net Generation (Central & South America)")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "middle")
                    .attr("x", w / 2)
                    .attr("y", h - 750)
                    .attr("font-size", 20)
                    .attr("font-weight", "bold");
            }
        }
    )
}

function task8() {
    d3.csv(
        "https://raw.githubusercontent.com/QuangLe44/DSDV-project/main/csv/Central%20%26%20South%20America/Central%20%26%20South%20America%20-%20net%20consumption.csv",
        function (error, data) {
            if (error) {
                console.log(error);
            } else {
                console.log(data);

                var netConsumptionData = [];
                var bisectedDate = d3.bisector(function(d) { return d.Date; }).left;

                data.forEach(function (d) {
                    var country = d['Country'];
                    
                    for (var [key, value] of Object.entries(d)) {
                        if (key !== 'Country' && key !== 'Features') {
                            var date = new Date(key);
                            if (date >= new Date('1980') && date <= new Date('2021')) {
                                netConsumptionData.push({
                                    Country: country,
                                    Date: date,
                                    Net: +value
                                })
                            }
                        }
                    }
                })

                var nestedData = d3.nest()
                    .key(d => d.Country)
                    .entries(netConsumptionData);
                
                // Sort countries based on maximum Net generation values
                nestedData.sort((a, b) => d3.max(b.values, d => d.Net) - d3.max(a.values, d => d.Net));

                // Select the top 5 countries
                var top5Countries = nestedData.slice(0, 5);

                var colors = ['#ff0000', '#00cc00', '#3498DB', '#C6C613', '#BB8FCE'];
            
                let cScale = d3.scaleOrdinal(colors);

                let svg = d3
                    .select(".task7")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("padding", p);
                
                let xScale = d3.scaleTime()
                    .domain(d3.extent(netConsumptionData, d => d.Date))
                    .range([p, w - p * 1.6]);
                
                let yScale = d3.scaleLinear()
                    .domain([0, d3.max(netConsumptionData, d => d.Net)])
                    .range([h - p, p]);
                
                let line = d3
                    .line()
                    .x(function (d) {
                      return xScale(d.Date); // xScale
                    })
                    .y(function (d) {
                      return yScale(d.Net); // ySCale
                    });
                
                let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat("%Y"));
                let yAxis = d3.axisLeft(yScale);

                svg
                    .append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (h - p) + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-0.8em")
                    .attr("dy", "0.15em")
                    .attr("transform", "rotate(-45)");

                svg
                    .append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + p + ", 0)")
                    .call(yAxis);
                
                svg.selectAll(".line")
                    .data(top5Countries)
                    .enter()
                    .append("path")
                    .attr("class", "line")
                    .attr("d", d => line(d.values))
                    .style("stroke", d => cScale(d.key))
                    .style("stroke-width", 4)
                    .style("fill", "none");
                
                // Add lines for other countries in grey
                svg.selectAll(".line")
                    .data(nestedData.filter(d => !top5Countries.map(c => c.key).includes(d.key)))
                    .enter()
                    .append("path")
                    .attr("class", "line")
                    .attr("d", d => line(d.values))
                    .style("stroke", "grey")
                    .style("stroke-width", 1)
                    .style("fill", "none");
                
                // Add legends
                var legend = svg.selectAll(".legend")
                    .data(top5Countries)
                    .enter()
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });
                
                legend.append("rect")
                    .attr("x", w - p * 1.4)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", d => cScale(d.key));
                
                legend.append("text")
                    .attr("x", w - p * 1.4 + 25)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "start")
                    .style("fill", d => cScale(d.key))
                    .text(d => d.key);
                
                    svg
                    .append("text")
                    .text("Year")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "middle")
                    .attr("x", w / 2)
                    .attr("y", h - p * 0.4)
                    .attr("font-size", 15)
                    .attr("font-weight", "bold");
                
                svg
                    .append("text")
                    .text("Electricity Net Consumption")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "middle")
                    .attr("x", -h / 2)
                    .attr("y", p / 2)
                    .attr("font-size", 15)
                    .attr("font-weight", "bold")
                    .attr("transform", "rotate(-90)");
                
                svg
                    .append("text")
                    .text("Multiple Line Graph of Electricity Net Consumption (Central & South America)")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "middle")
                    .attr("x", w / 2)
                    .attr("y", h - 750)
                    .attr("font-size", 20)
                    .attr("font-weight", "bold");
            }
        }
    )
}