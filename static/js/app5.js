// Build the metadata panel (demograhic content dislay)
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    // The 'metaDataField' variable holds the 'metadata' array from the  json data.
    let metaDataField = data.metadata;

    // Filter the metadata for the object with the desired sample number
    // Use 'filter' to lookup & find  the specific row within the metadata array that has an 'id'
    // matching the 'sample' parameter provided when 'buildMetadata' is called.
    let lookupSampleData = metaDataField.filter(s => s.id == sample);
    
    // Use d3 to select the demographic data  with id of `#sample-metadata`
   
    let demographicWithId = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata  
    demographicWithId.html("");
    let placeholder = lookupSampleData[0];

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
   
    for (let key in placeholder) {
      demographicWithId.append("h5").text(`${key.toUpperCase()}: ${placeholder[key]}`);
    }
        
  });

};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampleFields = data.samples;
    // Filter the samples for the object with the desired sample number
    let sampleObjects = sampleFields.filter(s => s.id==sample);
    let sampleDataResults = sampleObjects[0];
    // Get the otu_ids,  
    let otuIds = sampleDataResults.otu_ids;
    // Get the   otu_labels,  
    let otuLabels = sampleDataResults.otu_labels;
    // Get the   sample_values
    let sampleValues = sampleDataResults.sample_values;
    // Build a Bubble Chart
    let bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: 'Earth'
        }
    }];

   
    let bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        margin: { t: 0 },
        hovermode: 'closest',
        xaxis: { title: 'OTU ID' },
        margin: { t: 30 }
    };
// Render the Bubble Chart
// Use Plotly to create a new Bubble Chart on the element with the ID 'bubble'.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yAxisMarkers = otuIds.slice(0, 10).map(oID => `OTU ${oID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
   // Prepare the data and layout for the Bar Chart considering only the top 10 OTU values.
   let barChartData = [{
    y: yAxisMarkers,
    x: sampleValues.slice(0, 10).reverse(),
    text: otuLabels.slice(0, 10).reverse(),
    type: 'bar',
    orientation: 'h'
  }];

  // Define the layout for the Bar Chart including titles and margins.
  let barChartLayout = {
    title: 'Top 10 Bacteria Cultures Found',
    margin: { t: 30, l: 150 }
    };

  // Render(make) the Bar Chart
  // Use Plotly to create a new Bar Chart on the element with the ID 'bar'.
   Plotly.newPlot('bar', barChartData, barChartLayout);
  });
};

// Function to run on page load
// Define the 'init' function.Will run when the webpage loads.
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleFieldNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropDownSelector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleFieldNames.forEach((sample) => {
        dropDownSelector
          .append("option")
          .text(sample)
          .property("value", sample);
      });

    // Get the first sample from the list
    let firstSample = sampleFieldNames[0];

    // Build charts and metadata panel with the first sample
     // Call the 'buildCharts' function and pass in the first sample to build the initial charts.
     buildCharts(firstSample);
    
     // Call the 'buildMetadata' function and pass in the first sample to display its metadata.
     buildMetadata(firstSample);

  });
}

// Function for event listener
// Waits for an event to occur then responds to it
// Build charts and demographic display box (panel) each time a unique identifier (sample)) is selected
// in the dropdown data entry item is changed.
// Define 'optionChanged' function that takes 'newSample' as a parameter.

// Rebuild charts and metadata panel with the newly selected sample.
function optionChanged(newSample) {
  // Rebuild charts and metadata panel with the newly selected sample.
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
// Call the 'init' function when the webpage is loaded to initialize the dashboard.
init();