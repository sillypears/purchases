$(async function () {
    //artisansByCount
    const artisanData = await getData("/api/graph/artisansByCount")
    $('#artisan-count-chart').highcharts({
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Count By Sculpt'
        },

        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        legend: {
            enabled: true
        },
        series: [{
            name: "Sculpts",
            colorByPoint: true,
            data: artisanData.data
        }]
    })
    //makerByCount
    const makerData = await getData("/api/graph/makerByCount")
    $('#maker-count-chart').highcharts({
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Count By Maker'
        },

        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        series: [{
            name: "Makers",
            colorByPoint: true,
            data: makerData.data
        }]
    })

});

async function getData(url) {
    let result;
    result = await $.ajax({
        url: url,
        type: 'GET'
    });
    return result;
}