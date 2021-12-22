






//function to populate the metadata
function demoInfo(sample)
{
    //console.log(sample);

    //use d3.json in order to get the data
    d3.json("samples.json").then((data) => {
        //grab the metadata
        let metaData = data.metadata;
        //console.log(metaData);

        //filter based on the value of the sample
        let result = metaData.filter(sampleResult => sampleResult.id==sample)[0];

        //console.log(result);

        // resets the metadata box each time a new sample is called
        let metaDataBox = d3.select("#sample-metadata");
        metaDataBox.html("")
        //get the key value pairs
        Object.entries(result).forEach(([key,value]) =>{
            //add sample data / demographics section
            metaDataBox.append("p")
                .html(`<b>${key}:</b> ${value}`);
         //reset wfreq each time a new sample is pulled
         let gaugeDisplay = d3.select("#gauge");
         gaugeDisplay.html("")
                
        });
    });
}

//function to build the bar chart
function buildBarChart(sample)
{
    // console.log(sample);
    // let data = d3.json("samples.json");
    // console.log(data);

    d3.json("samples.json").then((data) => {
        //grab the metadata
        let sampleData = data.samples;
        //console.log(sampleData);

        //filter based on the value of the sample
        let result = sampleData.filter(sampleResult => sampleResult.id==sample)[0];

        //console.log(result);

        //get otu_ids, otu labels, and sample values
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values
        // console.log(otu_ids)
        // console.log(otu_labels)
        // console.log(sample_values);

        //build the bar chart
        //get the yticks
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0,10);
        let textLabels = otu_labels.slice(0,10);
        //console.log(textLabels);

        let barChart = {
            y:yticks.reverse(),
            x:xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };
        Plotly.newPlot("bar",[barChart],layout);

    });
}

//function that builds the gauge
function buildGauge(sample){
    // console.log(sample);
    // let data = d3.json("samples.json");
    // console.log(data);

    d3.json("samples.json").then((data) => {
        //grab the metadata
        let washFreqData = data.metadata;
        console.log(washFreqData);

        //filter based on the value of the sample
        let result = washFreqData.filter(sampleResult => sampleResult.id==sample)[0];


        let washFreq = result.wfreq
        //console.log(washFreq)

       

        //Build Gauge
        let Gauge = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            title: { text: "Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                { range: [0, 1], color: "white" },
                { range: [1, 2], color: "lightgray" },
                { range: [2, 3], color: "darkseagreen" },
                { range: [3, 4], color: "lightgreen" },
                { range: [4, 5], color: "yellowgreen" },
                { range: [5, 6], color: "palegreen" },
                { range: [6, 7], color: "green" },
                { range: [7, 8], color: "paleturquoise" },
                { range: [8, 9], color: "teal" }
                ],
                threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: washFreq
                },
                bar: {color: "darkslategray"}
            }
            }
        ];

        
            let gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
            Plotly.newPlot('gauge', Gauge, gaugeLayout);
            
    });
};

// function that builds the bubble chart
function bubbleChart(sample)
{
    // console.log(sample);
    // let data = d3.json("samples.json");
    // console.log(data);

    d3.json("samples.json").then((data) => {
        //grab the metadata
        let sampleData = data.samples;
        //console.log(sampleData);

        //filter based on the value of the sample
        let result = sampleData.filter(sampleResult => sampleResult.id==sample)[0];

        //console.log(result);

        //get otu_ids, otu labels, and sample values
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values
        // console.log(otu_ids)
        // console.log(otu_labels)
        // console.log(sample_values);

        //build the bubble chart
        

        let bubbleChart = {
            y:sample_values,
            x:otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size:sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };
        Plotly.newPlot("bubble",[bubbleChart],layout);
    });
    
}



// function to initialize the dashboard
function initialize()
{
   //let data = d3.json("samples.json");
   //console.log(data);

    // access the dropdown selector from the index.html file
    var select = d3. select("#selDataset");

    // use d3.json to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names; //made an array of just the names
        console.log(sampleNames);

        //use a foreach in order to create options for each sample in the selector
        sampleNames.forEach((sample) =>{
            select.append("option")
                .text(sample)
                .property("value",sample);

        });
        //pass in the information for the first sample
        let sample1 = sampleNames[0];

        //call the function to build the metadata
        demoInfo(sample1);

        //call function to build the bar chart
        buildBarChart(sample1);
        //call function to build bubble chart
        bubbleChart(sample1);
        //call function to build gauge
        buildGauge(sample1);
    });

    
}

//function to update the dashboard
function optionChanged(item)
{
    //console.log(item);
    demoInfo(item)
    //call function to build bar chart
    buildBarChart(item)
    // call function to build bubble chart
    bubbleChart(item)
    // call function to build gauge
    buildGauge(item)
}


//call the initizalize the function
initialize();