console.log('This is app.js'); 


// Note: This code was adapted from the Homework 14 tutorial Dom gave on 27Sep2022


// Define a global variable to hold the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"; 

function DrawBargraph(sampleId)
{
    console.log(`DrawBargraph(${sampleId})`); 

    d3.json(url).then(data => {

        let samples = data.samples; 
        let resultArray = samples.filter(s => s.id == sampleId); 
        let result = resultArray[0]; 

        let otu_ids = result.otu_ids; 
        let otu_labels = result.otu_labels; 
        let sample_values = result.sample_values; 

        let yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(); 

        // Create a trace object
        let barData = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: 'bar', 
            text: otu_labels.slice(0, 10).reverse(),
            orientation: 'h'
        }; 

        // Put the trace object into an array
        let barArray = [barData]; 

        // Create a layout object
        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        }

        // Call the Plotly function 
        Plotly.newPlot("bar", barArray, barLayout); 

    }); 
}

function DrawBubblechart(sampleId)
{
    console.log(`DrawBubblechart(${sampleId})`); 

    d3.json(url).then(data => {

        let samples = data.samples; 
        let resultArray = samples.filter(s => s.id == sampleId); 
        let result = resultArray[0]; 

        let otu_ids = result.otu_ids; 
        let otu_labels = result.otu_labels; 
        let sample_values = result.sample_values; 

        // Create a trace
        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels, 
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Put the trace into an array
        let bubbleArray = [bubbleData]; 

        // Create a layout object
        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 30},
            hovermode: "closest", 
            xaxis: { title: "OTU ID"}
        };

        // Call Plotly
        Plotly.newPlot("bubble", bubbleArray, bubbleLayout); 

    }); 


}

function ShowMetadata(sampleId)
{
    console.log(`ShowMetadata ${sampleId}`);

    let tableSelect = d3.select('#sample-metadata');

    d3.json(url).then(data => {

        let metadata = data.metadata;
        let resultArray = metadata.filter(s => s.id == sampleId);
        let result = resultArray[0];

        let id = result.id;
        let ethnicity = result.ethnicity;
        let gender = result.gender;
        let age = result.age;
        let location = result.location;
        let bbtype = result.bbtype;
        let wfreq = result.wfreq;

        tableSelect.html(

            `id: ${id} <br>
            ethnicity: ${ethnicity} <br>
            gender: ${gender} <br>
            age: ${age} <br>
            location: ${location} <br>
            bbtype: ${bbtype} <br>
            wfreq: ${wfreq}`
        )

    });


}

function DrawGauge(sampleId)
{
    console.log(`gauge: ${sampleId}`);

    d3.json(url).then(data => {

        let metadata = data.metadata;
        let resultArray = metadata.filter(s => s.id == sampleId);
        let result = resultArray[0];
        let wfreq = result.wfreq;

        console.log('wfreq:', wfreq)

        var data = [
            {
              type: "indicator",
              value: wfreq,
              gauge: { axis: { visible: false, range: [0, 9] } },
              domain: { row: 0, column: 0 }
            },

          ];
          
          var layout = {
            width: 600,
            height: 400,
            template: {
              data: {
                indicator: [
                  {
                    title: { text: "Washing Frequency Per Week" },
                    mode: "number+delta+gauge",
                  }
                ]
              }
            }
          };
          

          Plotly.newPlot('gauge', data, layout);
    });
}


function optionChanged(sampleId)
{
    console.log(`optionChanged, new value: ${sampleId}`); 

    DrawBargraph(sampleId); 
    DrawBubblechart(sampleId); 
    ShowMetadata(sampleId); 
    DrawGauge(sampleId); 
}


function InitDashboard() 
{
    console.log('InitDashboard()'); 

    // Get a handle to the dropdown
    let selector = d3.select("#selDataset"); 

    d3.json(url).then(data => {
        console.log("Here's the data:", data); 

        let sampleNames = data.names; 
        console.log("Here are the sample names:", sampleNames); 

        // Populate the dropdown box
        for (let i = 0; i < sampleNames.length; i++) {
            let sampleId = sampleNames[i]; 
            selector.append("option").text(sampleId).property("value", sampleId); 
        };      

        // Read the current value from the dropdown
        let initialId = selector.property("value");
        console.log(`initialId = ${initialId}`); 

        // Draw the bargraph for the selected sample id
        DrawBargraph(initialId); 

        // Draw the bubblechart for the selected sample id
        DrawBubblechart(initialId); 

        // Show the metadata for the selected sample id 
        ShowMetadata(initialId); 

        // Show the gauge
        DrawGauge(initialId); 

    }); 
}

InitDashboard(); 




// Note: This code was adapted from the Homework 14 tutorial Dom as well as some pointers from fellow students gave on Sep/29/2022