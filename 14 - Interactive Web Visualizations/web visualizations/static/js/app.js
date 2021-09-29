$(document).ready(function() {
    // alert("Page Loaded");

    getData();

    $("#selDataset").on("change",function() {
        getData();
    });

});

function getData() {
    let url = "samples.json";

    // AJAX
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
         
            buildDropdown (data);
            buildBarPlot (data);
            buildBubblePlot(data);
            buildMetaTable(data);
            // buildGauge(data);
        },
        error: function(data) {
            console.log("YOU BROKE IT!!");
        },
        complete: function(data) {
            console.log("Request finished");
        }
    });
}

// Dropdown Function //

function buildDropdown (data) {
    let names = data.names;

    // loop through names, create html, put into dropdown
    for (let i = 0; i < names.length; i++) {
        let name = names[i];
        let html_option = `<option value="${name}">${name}</option>`;
        $("#selDataset").append(html_option);
    }
}


// Horizontal Bar Chart Function //
function buildBarPlot (data) {
    let curr_id = $("#selDataset").val();
    let curr_data = data.samples.filter(x => x.id === curr_id)[0];

    let trace1 = {
        x: curr_data.sample_values.slice(0,10).reverse(),
        y: curr_data.otu_ids.map(x => `OTU ID: ${x}`).slice(0,10).reverse(),
        text: curr_data.otu_labels.slice(0,10).reverse(),
        name: "Bacteria Count",
        type: 'bar',
        orientation: 'h',
        marker: {
            color: 'maroon'
        }
    }

    let traces = [trace1];

    let layout = {
        autosize: false,
        width: 850,
        height: 600,
        title: "Bacteria Count in Belly Button",
        xaxis: {
            title: "Number of Bacteria"
        },
        yaxis: {
            tickfont: {
                size: 10,
                color: 'black'
            }
        }
    };

    Plotly.newPlot('bar', traces, layout);

}

// Bubble Chart Function //
function buildBubblePlot(data) {
    let curr_id = $("#selDataset").val();
    let curr_data = data.samples.filter(x => x.id === curr_id)[0];

    var trace1 = {
        x: curr_data.otu_ids,
        y: curr_data.sample_values,
        mode: 'markers',
        marker: {
            color: curr_data.otu_ids,
            size: curr_data.sample_values
        }
      };
      
      var traces = [trace1];
      
      var layout = {
        title: 'Bactieria Bubble Chart',
        showlegend: false,
        xaxis: {
            title: "OTU ID"
        }
      };
      
      Plotly.newPlot('bubble', traces, layout);
};

// Metadata Table //

function buildMetaTable(data) {
    let curr_id = parseInt($("#selDataset").val());
    let curr_data = data.metadata.filter(x => x.id == curr_id)[0];

    //Clear Table
    $("#sample-metadata").empty();

    let items = Object.entries(curr_data).map(([key, value]) => `${key} : ${value}`)
    console.log(items)

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let html_item = `<p">${item}</p>`;
        $("#sample-metadata").append(html_item);
    }
    
}

// Attempting Gauge Chart //

// function buildGauge(data) {
//     let curr_id = parseInt($("#selDataset").val());
//     let curr_data = data.metadata.filter(x => x.id == curr_id)[0];

//     console.log(curr_data.wfreq)


//     let data = [
//         {
//         type: "indicator",
//         mode: "gauge+number+delta",
//         value: curr_data.wfreq,
//         title: { text: "Belly Button Washing Freqency", font: { size: 24 } },
//         gauge: {
//             axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
//             bar: { color: "darkblue" },
//             bgcolor: "white",
//             borderwidth: 2,
//             bordercolor: "gray",
//         //     steps: [
//         //     { range: [0, 250], color: "cyan" },
//         //     { range: [250, 400], color: "royalblue" }
//         //     ],
//         // }
//         }
//     ];
    
//     var layout = {
//         // width: 500,
//         // height: 400,
//         // margin: { t: 25, r: 25, l: 25, b: 25 },
//         paper_bgcolor: "lavender",
//         font: { color: "darkblue", family: "Arial" }
//     };
    
//     Plotly.newPlot('gauge', data, layout);
// }