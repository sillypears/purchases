$(async function () {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

    });


    {
        const priceData = await getData("/api/graph/getPricingTable")
        let table = `<table class='table border'><thead>`
        for (h of priceData.headers) {
            table += `<th>${h}</th>`
        }
        table += '</thead><tbody>'
        table += `<tr><td>${formatter.format(priceData.data[0].max_price)}</td><td>${formatter.format(priceData.data[0].min_price)}</td><td>${formatter.format(priceData.data[0].avg_price)}</td></tr>`
        table += '</tbody></table>'
        $('#artisan-price-table').append(table)
    }
    {
        const topSculptData = await getData("/api/graph/topSculpts")
        let tableSculpt = `<table class='table border hover'><thead>`
        for (h of topSculptData.headers) {
            console.log(h)
            tableSculpt += `<th>${h}</th>`
        }
        tableSculpt += '</thead><tbody>'
        for (x of topSculptData.data) {
            tableSculpt += `<tr><td>${x.sculpt}</td><td>${x.total}</td></tr>`
        }
        tableSculpt += '</tbody></table>'
        $('#artisan-top-sculpt').append(tableSculpt)
    }
    {
        const topMakerData = await getData("/api/graph/topMakers")
        let tableMaker = `<table class='table border hover'><thead>`
        for (h of topMakerData.headers) {
            tableMaker += `<th>${h}</th>`
        }
        tableMaker += '</thead><tbody>'
        for (x of topMakerData.data) {
            console.log(x)
            tableMaker += `<tr><td>${x.maker_name}</td><td>${x.total}</td></tr>`
        }
        tableMaker += '</tbody></table>'
        $('#artisan-top-maker').append(tableMaker)
    }
    {
        const totalMakerData = await getData("/api/graph/totalMakers")
        const totalSculptData = await getData("/api/graph/totalSculpts")
        console.log(totalMakerData)
        let totalCounts = `<table class='table border hover'><thead>`
        totalCounts += `<th>Total Makers</th>`
        totalCounts += `<th>Total Sculpts</th>`
        totalCounts += '</thead><tbody><tr>'

        totalCounts += `<td>${totalMakerData.data.count.count}</td>`
        totalCounts += `<td>${totalSculptData.data.count.count}</td>`

        totalCounts += '</tr></tbody></table>'
        $('#artisan-total-counts').append(totalCounts)
    }
    //artisansByCount
    const artisanData = await getData("/api/graph/haveArtisansByCount")
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
    const makerData = await getData("/api/graph/makerHaveByCount")
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