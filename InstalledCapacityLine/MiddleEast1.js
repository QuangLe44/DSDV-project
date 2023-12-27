const w = 1100;
const h = 800;
const p = 100;
//-----------------------------------------------
// Net Generation Graph
function task5() {
    d3.csv(
        "https://raw.githubusercontent.com/QuangLe44/DSDV-project/main/csv/Middle%20East/Middle%20East%20-%20installed%20capacity.csv",
        function (error, data) {
            if (error) {
                console.log(error);
            } else {
                console.log(data);
                
                var netInstalledCapacity = [];
                var bisectedDate = d3.bisector(function(d) { return d.Date; }).left;
                var type1 = ['installed capacity'];

                data.forEach(function(d) {
                    var country = d['Country'];
                    var features = d['Features'];
                    if (features.includes(type1)) {
                        for (var [key, value] of Object.entries(d)) {
                            if (key !== 'Country' && key !== 'Features') {
                                var date = new Date(key);
                                if (date >= new Date('1980') && date <= new Date('2021')) {
                                    netInstalledCapacity.push({
                                        Country: country,
                                        Date: date,
                                        Net: +value
                                    })
                                }
                            }
                        }
                    }
                });

                var nestedData1 = d3.nest()
                    .key(d => d.Country)
                    .entries(netInstalledCapacity);
                
                // Sort countries based on maximum Net generation values
                nestedData1.sort((a, b) => d3.max(b.values, d => d.Net) - d3.max(a.values, d => d.Net));

                // Select the top 5 countries
                var top5Countries = nestedData1.slice(0, 3);
                
                let svg = d3
                    .select(".task1")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("padding", p);
                
                let xScale = d3.scaleTime()
                    .domain(d3.extent(netInstalledCapacity, d => d.Date))
                    .range([p, w - p * 1.6]);
                
                let yScale = d3.scaleLinear()
                    .domain([0, d3.max(netInstalledCapacity, d => d.Net)])
                    .range([h - p, p]);
                
                var colors = ['#ff0000', '#00cc00', '#3498DB', '#2ECC71', '#BB8FCE'];
                
                let cScale = d3.scaleOrdinal(colors);
                
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
                
                // Add lines for each country
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
                    .data(nestedData1.filter(d => !top5Countries.map(c => c.key).includes(d.key)))
                    .enter()
                    .append("path")
                    .attr("class", "line")
                    .attr("d", d => line(d.values))
                    .style("stroke", "grey")
                    .style("stroke-width", 1)
                    .style("fill", "none"); 

                function formatDate(date) {
                    var options = { year: 'numeric'};
                    return date.toLocaleDateString(undefined, options);
                }

                // Create a rect on top of the svg area: this rectangle recovers mouse position
                svg
                .append('rect')
                .style("fill", "none")
                .style("pointer-events", "all")
                .attr('width', w)
                .attr('height', h)
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseout', mouseout);

                // Create groups for each country
                var focusGroups = svg.selectAll(".focus-group")
                .data(top5Countries)
                .enter()
                .append("g")
                .attr("class", "focus-group")
                .style("opacity", 0);

                // Create circles for each country within their respective group
                focusGroups.append('circle')
                .attr("class", "focus-circle")
                .style("fill", "none")
                .attr("stroke", d => cScale(d.key))
                .attr('r', 8.5);

                // Create text for each country within their respective group
                focusGroups.append('text')
                .attr("class", "focus-text")
                .style("opacity", 1)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("fill", d => cScale(d.key));

                // What happens when the mouse move -> show the annotations at the right positions.
                function mouseover() {
                // Show all focus circles and text groups
                focusGroups.style("opacity", 1);
                }

                function mousemove() {
                    // Recover coordinate we need
                    var x0 = xScale.invert(d3.mouse(this)[0]);
                    var i = bisectedDate(top5Countries[0].values, x0, 1);
                    var selectedData = top5Countries.map(country => {
                      return {
                        key: country.key,
                        values: [country.values[i]]
                      };
                    });
                  
                    // Update circles and text for each country
                    focusGroups.each(function (countryData) {
                      var countryCircle = d3.select(this).select(".focus-circle");
                      var countryText = d3.select(this).select(".focus-text");
                  
                      var dataForDate = selectedData.find(entry => entry.key === countryData.key).values[0];
                      countryCircle
                        .attr("cx", xScale(dataForDate.Date))
                        .attr("cy", yScale(dataForDate.Net));
                  
                      countryText
                        .html(
                          "Country: " + dataForDate.Country + "<br />" +
                          " Date: " + formatDate(dataForDate.Date) + "<br />" +
                          " Installed Capacity: " + dataForDate.Net
                        )
                        .attr("x", xScale(dataForDate.Date))
                        .attr("y", yScale(dataForDate.Net) - 30)
                        .attr("fill", cScale(countryData.key));
                    });
                }

                function mouseout() {
                // Hide all focus circles and text groups
                focusGroups.style("opacity", 0);
                }
                
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
                    .text("Installed Capacity")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "middle")
                    .attr("x", -h / 2)
                    .attr("y", p / 2)
                    .attr("font-size", 15)
                    .attr("font-weight", "bold")
                    .attr("transform", "rotate(-90)");
                
                svg
                    .append("text")
                    .text("Multiple Line Graph of Installed Capacity (Middle East)")
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
