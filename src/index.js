import * as d3 from "d3";

const h = 800;
const padding = 60;

const svg = d3.select(".center")
    .append("svg")
    .attr("width", "100%")
    .attr("height", h)
    .attr("id", "svg");

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

var req = new XMLHttpRequest();
req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
req.send();
req.onload = () => {
    const json = JSON.parse(req.responseText);
    const dataset = json.data;
    const w = (document.getElementById("svg").clientWidth - padding) / dataset.length;

    xScale.domain([0,dataset.length-1]);
    xScale.range([padding,w*dataset.length]);

    yScale.domain([0, d3.max(dataset, d => d[1])]);
    yScale.range([h - padding, padding]);//800 / 10

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d[1]))
        .attr("rx",2)
        //.attr("ry",1)
        .attr("width", w)
        .attr("height", d => h - yScale(d[1])-padding)
        .attr("fill", "navy")
        .attr("class", "bar")
        .append("title")
        .text(d => d[1]);

    svg.append("g")
        .attr("transform", `translate(0,${(h-padding)})`)
        .call(xAxis);

    svg.append("g")
       .attr("transform", `translate(${(padding)},0)`)
       .call(yAxis);

    /*svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("x",(d,i) => i * (w+2))
        .attr("y", d => h - scale(d[1]) / 2)
        .text(d => d[1]);*/
}
