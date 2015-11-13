var width = 500,
    height = 580;

var gdps = {},
    gdps_pc = {},
    torts = {},
    torts_pc = {},
    pops = {},
    dics = {'gdps':gdps,'gdps_pc':gdps_pc,'torts':torts,'torts_pc':torts_pc,'pops':pops},
    maxs = {},
    titles = {"en": {
      "gdps": "GDP per delegation in DF ('000 pesos)",
      "gdps_pc": "GDP per capita per delegation in DF (pesos per year)",
      "torts": "Tortilla shops per delegation in DF",
      "torts_pc": "Tortilla shops per capita per delegation in DF",
      "pops": "Population per delegation in DF" },
              "es": {
                "gdps": "Producto interno bruto por delegación en el DF (miles de pesos)",
                "gdps_pc": "PIB per cápita por delegación en el DF (pesos por año)",
                "torts": "Tortillerías por delegación en el DF",
                "torts_pc": "Tortillerías per cápita por delegación en el DF",
                "pops": "Población por delegación en el DF"}
             };

var quantize;

var path = d3.geo.path()
    .projection(null);

var svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
  .defer(d3.json, "./topo_df.json")
  .defer(d3.csv, "dfdata.csv", function(d) {
    gdps[d.statecd+d.towncd] = +d.gdp;
    if(maxs.gdps === undefined || maxs.gdps < +d.gdp) maxs.gdps = +d.gdp;
    gdps_pc[d.statecd+d.towncd] = +d.gdp_p_capita;
    if(maxs.gdps_pc === undefined || maxs.gdps_pc < +d.gdp_p_capita) maxs.gdps_pc = +d.gdp_p_capita;
    torts[d.statecd+d.towncd] = +d.tortillerias;
    if(maxs.torts === undefined || maxs.torts < +d.tortillerias) maxs.torts = +d.tortillerias;
    torts_pc[d.statecd+d.towncd] = +d.tortillerias_p_capita;
    if(maxs.torts_pc === undefined || maxs.torts_pc < +d.tortillerias_p_capita) maxs.torts_pc = +d.tortillerias_p_capita;
    pops[d.statecd+d.towncd] = +d.population;
    if(maxs.pops === undefined || maxs.pops < +d.population) maxs.pops = +d.population;
  })
  .await(ready);

function numberWithCommas(x) {
  var res = 100;
  if(x < 1) res = 10000;
  x = Math.floor(x*res)/res;
  if(x < 1) return x;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function parse(val) {
    var result,
        tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
    });
  return result;
}
var lang = lang || parse("lang") || "en";
console.log(lang);

function wrap(text) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 0.4, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > 0) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function updateChoropleth(measure) {
  var statistic = measure,
      dic = dics[statistic];
  svg.selectAll("path")
    .attr("class", function(d) { return quantize(dic[d.id]/maxs[statistic]); });
  svg.selectAll("path title")
    .text(function(d) {return d.properties.name+" - "+numberWithCommas(dic[d.id]); });
  d3.selectAll(".del-list").text(function(d){return d.properties.name +" - "+numberWithCommas(dic[d.id]); });
  d3.selectAll("#values_list li").sort(function(a,b) {return +dic[b.id] - +dic[a.id]; }).transition().delay(1000);
  d3.selectAll(".del-span").attr('class',function(d) { return "del-span " + quantize(dic[d.id]/maxs[statistic]); });
  d3.select("h3").text(titles[lang][measure]);
  svg.selectAll(".delegacion-label")
    .text(function(d){return d.properties.name;})
    .attr("class",function(d){ if(["q8-9","q7-9"].indexOf(quantize(dic[d.id]/maxs[statistic])) >= 0)
                               return "delegacion-label q0-9";
                               return "delegacion-label";})
    .call(wrap);
}

function ready(error, mx) {
  if (error) throw error;
  var statistic = 'torts',
      dic = dics[statistic];
  quantize = d3.scale.quantize()
    .domain([0,1.0])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

  d3.select("#values_list").selectAll("li")
    .data(topojson.feature(mx,mx.objects.delegaciones).features)
    .enter().append("li").append("span").attr("class","del-span");
  
  d3.selectAll("#values_list li").append("span").attr("class","del-list");

  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(mx, mx.objects.delegaciones).features)
    .enter().append("path")
    .attr("d", path).append("title").text("");
  svg.selectAll(".delegacion-label").data(topojson.feature(mx,mx.objects.delegaciones).features)
    .enter().append("text").attr("class","delegacion-label")
    .attr("transform", function(d) { return "translate("+path.centroid(d)+")";})
    .attr("dy",".35em").text(function(d){return d.properties.name});
  updateChoropleth(statistic);
}
d3.select(self.frameElement).style("height", height + "px");
