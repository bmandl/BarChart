import * as d3 from "d3";

const h = 800;
const padding = 60;

const tooltip = d3.select('.dataDisplay').append('div')
                  .attr('id', "tooltip")
                  .style('opacity', 0);

const svgContainer = d3.select(".dataDisplay")
    .append("svg")
    .attr("width", "100%")
    .attr("height", h)
    .attr("id", "svg");

const xScale = d3.scaleTime();
const yScale = d3.scaleLinear();

const dateRange = dataset => {

    const min = d3.min(dataset, d => new Date(d[0])),
        max = d3.max(dataset, d => new Date(d[0]));

    return { min, max };
}

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').then(data => {

    const dataset = data.data;

    const w = (svgContainer.node().clientWidth - padding) / dataset.length;

    const xDomain = dateRange(dataset);

    xScale.domain([xDomain.min, xDomain.max]);
    xScale.range([padding, w * dataset.length]);

    yScale.domain([0, d3.max(dataset, d => d[1])]);
    yScale.range([h - padding, padding]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svgContainer.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", d => xScale(new Date(d[0])))
        .attr("y", d => yScale(d[1]))
        .attr("rx", 2)
        .attr("width", w)
        .attr("height", d => h - yScale(d[1]) - padding)
        .attr("fill", "navy")
        .attr("class", "bar")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .on("mouseover", (d,i) => {
            tooltip.transition()
            .duration(200)
            .style('opacity',0.9);
            tooltip.html(`${d[1]}`)
            .attr("data-date", d[0])
            .style('left', `${i*w+padding}px`)
            .style('top', `${h-padding-50}px`)
            .style('transform', 'translateX(60px)');
        })
        .on('mouseout', () => {
            tooltip.transition()
                   .duration(200)
                   .style('opacity',0);
        });
        /*.append("title")
        .text(d => d[1]);*/

    svgContainer.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${(h - padding)})`)
        .call(xAxis);

    svgContainer.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${(padding)},0)`)
        .call(yAxis);
});