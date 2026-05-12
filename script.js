const width = 700;
const height = 400;

const margin = {
    top: 40,
    right: 20,
    bottom: 80,
    left: 70
};

d3.csv("vgsales.csv").then(data => {

    ////////////////////////////////////////////////////////
    // FORMAT DATA
    ////////////////////////////////////////////////////////

    data.forEach(d => {
        d.Global_Sales = +d.Global_Sales;
        d.Year = +d.Year;
    });

    data = data.filter(d =>
        !isNaN(d.Global_Sales) &&
        !isNaN(d.Year)
    );

    ////////////////////////////////////////////////////////
    // GENRE BAR CHART
    ////////////////////////////////////////////////////////

    const genreSales = d3.rollup(
        data,
        v => d3.sum(v, d => d.Global_Sales),
        d => d.Genre
    );

    const genreData = Array.from(
        genreSales,
        ([genre, sales]) => ({ genre, sales })
    ).sort((a, b) => b.sales - a.sales);

    const svg1 = d3.select("#genreChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x1 = d3.scaleBand()
        .domain(genreData.map(d => d.genre))
        .range([margin.left, width - margin.right])
        .padding(0.3);

    const y1 = d3.scaleLinear()
        .domain([0, d3.max(genreData, d => d.sales)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // GRID
    svg1.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
            d3.axisLeft(y1)
                .tickSize(-(width - margin.left - margin.right))
                .tickFormat("")
        );

    // BARS
    svg1.selectAll(".bar")
        .data(genreData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x1(d.genre))
        .attr("y", d => y1(d.sales))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - margin.bottom - y1(d.sales));

    // X AXIS
    svg1.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x1))
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");

    // Y AXIS
    svg1.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y1));

    // Y LABEL
    svg1.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Global Sales (millions)");

    ////////////////////////////////////////////////////////
    // PLATFORM BAR CHART
    ////////////////////////////////////////////////////////

    const platformSales = d3.rollup(
        data,
        v => d3.sum(v, d => d.Global_Sales),
        d => d.Platform
    );

    const platformData = Array.from(
        platformSales,
        ([platform, sales]) => ({ platform, sales })
    )
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 10);

    const svg2 = d3.select("#platformChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x2 = d3.scaleBand()
        .domain(platformData.map(d => d.platform))
        .range([margin.left, width - margin.right])
        .padding(0.3);

    const y2 = d3.scaleLinear()
        .domain([0, d3.max(platformData, d => d.sales)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // GRID
    svg2.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
            d3.axisLeft(y2)
                .tickSize(-(width - margin.left - margin.right))
                .tickFormat("")
        );

    // BARS
    svg2.selectAll(".bar")
        .data(platformData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x2(d.platform))
        .attr("y", d => y2(d.sales))
        .attr("width", x2.bandwidth())
        .attr("height", d => height - margin.bottom - y2(d.sales));

    // X AXIS
    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x2));

    // Y AXIS
    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y2));

    // Y LABEL
    svg2.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Global Sales (millions)");

    ////////////////////////////////////////////////////////
    // LINE CHART
    ////////////////////////////////////////////////////////

    const yearSales = d3.rollup(
        data,
        v => d3.sum(v, d => d.Global_Sales),
        d => d.Year
    );

    const yearData = Array.from(
        yearSales,
        ([year, sales]) => ({ year, sales })
    ).sort((a, b) => a.year - b.year);

    const svg3 = d3.select("#lineChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x3 = d3.scaleLinear()
        .domain(d3.extent(yearData, d => d.year))
        .range([margin.left, width - margin.right]);

    const y3 = d3.scaleLinear()
        .domain([0, d3.max(yearData, d => d.sales)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // GRID
    svg3.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
            d3.axisLeft(y3)
                .tickSize(-(width - margin.left - margin.right))
                .tickFormat("")
        );

    // LINE
    const line = d3.line()
        .x(d => x3(d.year))
        .y(d => y3(d.sales));

    svg3.append("path")
        .datum(yearData)
        .attr("class", "line")
        .attr("d", line);

    // POINTS
    svg3.selectAll(".point")
        .data(yearData)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", d => x3(d.year))
        .attr("cy", d => y3(d.sales))
        .attr("r", 4);

    // X AXIS
    svg3.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
            d3.axisBottom(x3)
                .tickFormat(d3.format("d"))
        );

    // Y AXIS
    svg3.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y3));

    // X LABEL
    svg3.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text("Year");

    // Y LABEL
    svg3.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Global Sales (millions)");

    ////////////////////////////////////////////////////////
    // PIE CHART
    ////////////////////////////////////////////////////////

    let pieData = genreData.slice(0, 6);

    const pieWidth = 500;
    const pieHeight = 500;
    const radius = Math.min(pieWidth, pieHeight) / 2;

    const svg4 = d3.select("#pieChart")
        .append("svg")
        .attr("width", pieWidth)
        .attr("height", pieHeight)
        .append("g")
        .attr(
            "transform",
            `translate(${pieWidth / 2}, ${pieHeight / 2})`
        );

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    function updatePieChart(data) {

        svg4.selectAll("*").remove();

        const pie = d3.pie()
            .value(d => d.sales);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const arcs = svg4.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g");

        // slices
        arcs.append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => color(i))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        // labels
        arcs.append("text")
            .attr("transform", d =>
                `translate(${arc.centroid(d)})`
            )
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "12px")
            .text(d => d.data.genre);
    }

    // INITIAL PIE
    updatePieChart(pieData);

    ////////////////////////////////////////////////////////
    // ADD DATA
    ////////////////////////////////////////////////////////

    d3.select("#addData")
        .on("click", () => {

            pieData.push({
                genre: "New",
                sales: Math.floor(Math.random() * 300) + 50
            });

            updatePieChart(pieData);
        });

    ////////////////////////////////////////////////////////
    // REMOVE DATA
    ////////////////////////////////////////////////////////

    d3.select("#removeData")
        .on("click", () => {

            if (pieData.length > 1) {

                pieData.pop();

                updatePieChart(pieData);
            }
        });

});
