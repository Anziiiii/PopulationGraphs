var currentChart;

document.getElementById('renderBtn').addEventListener('click', renderCountryView);
document.getElementById("renderBtn").onclick = function show() {
    document.getElementById("myContainer").style.visibility = 'visible';
    document.getElementById("para").style.visibility = 'visible';

};

function renderCountryInfo(countryName, capital, region, flagUrl) {
    // Create an image element
    var img = document.createElement('img');
    img.src = flagUrl;
    img.id = 'flag';
    img.alt = 'Country flag';

    // Insert the texts and image element into the HTML document
    document.getElementById('countryName').textContent = countryName;
    document.getElementById('capital').textContent = 'Capital: ' + capital;
    document.getElementById('region').textContent = 'Region: ' + region;
    if (document.getElementById('flagcontainer').firstChild !== null) {
        document.getElementById('flagcontainer').firstChild.remove();
    }
    document.getElementById('flagcontainer').appendChild(img);
}

async function fetchDataAndRenderGraph(countryCode, indicatorCode) {
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json&per_page=60&page=1';
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValues(fetchedData);
        var labels = getLabels(fetchedData);
        var countryName = getCountryName(fetchedData);
        var indicatorName = getIndicatorName(fetchedData);
        renderChart(data, labels, countryName, indicatorName);
    }
    document.getElementById("para").innerHTML = countryName + " " + indicatorName;
}

async function fetchDataAndRenderCountryInfo(countryCode) {
    // REST Countries API using ISO 3166-1 3-letter country codes
    const baseUrl = 'https://restcountries.eu/rest/v2/alpha/';
    const url = baseUrl + countryCode;

    var response = await fetch(url);

    if (response.status == 200) {
        //var dataAsString = await response.json();
        var countryData = await response.json();
        //var countryData = JSON.parse(dataAsString);

        var countryCode = countryData.name;
        var countryCapital = countryData.capital;
        var countryRegion = countryData.region;
        var countryFlagUrl = countryData.flag;

        renderCountryInfo(countryCode, countryCapital, countryRegion, countryFlagUrl);
    }
}

function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}

function getIndicatorName(data) {
    var indicatorName = data[1][0].indicator.id;
    return indicatorName;
}

function renderChart(data, labels, countryName, indicatorName) {
    var ctx = document.getElementById('myChart').getContext('2d');

    if (currentChart) {
        // Clear the previous chart if it exists
        currentChart.destroy();
    }

    // Draw new chart
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Population, ' + countryName,
                data: data,
                borderColor: 'rgb(191, 22, 191)',
                borderWidth: 1,
                backgroundColor: 'rgb(243, 169, 243)',
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: {
                duration: 10000
            }
        }
    });
}

async function renderCountryView() {
    var countryCode = document.getElementById('country').value;
    const indicator = 'SP.POP.TOTL';
    fetchDataAndRenderGraph(countryCode, indicator);
    fetchDataAndRenderCountryInfo(countryCode);
}
