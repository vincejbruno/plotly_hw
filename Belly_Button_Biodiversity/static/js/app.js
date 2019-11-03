function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response) {

    console.log(response)
    var panel = response;

    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata

    metadata.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    var row = metadata.append('ul');
    Object.entries(panel).forEach(function([key,value]) {
      var cell = row.append('li');
      cell.text(`${key}: ${value}`);
    });

  })
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response) {

    console.log(response);
    // @TODO: Build a Bubble Chart using the sample data
    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.
    var trace = {
      type: "scatter", 
      mode: "markers",
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      marker: {
        color: response.otu_ids,
        size: response.sample_values,
        colorscale: "Viridis",
        opacity: 0.5
      }
    };

    var data = [trace];

    var layout = {
      title: "Bubble Representation",
      showlegend: false,
      height: 700,
      width: 1000
    };

    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // Use sample_values as the values for the PIE chart.
    // Use otu_ids as the labels for the pie chart.
    // Use otu_labels as the hovertext for the chart.
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var trace2 = {
      hovertext: response.otu_labels.slice(0, 10),
      values: response.sample_values.slice(0, 10),
      labels: response.otu_ids.slice(0, 10),
      type: "pie",
      marker: {
        colorscale: "Viridis"
      }
    };

    var data2 = [trace2];

    var layout2 = {
      height: 450,
      width: 550,
      showlegend: true
    };

    Plotly.newPlot("pie", data2, layout2);

  });

};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
