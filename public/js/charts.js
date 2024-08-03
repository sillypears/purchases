$(async function () {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

    });

    // Price Data
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
    // Top Sculpts
    {
        const topSculptData = await getData("/api/graph/topSculpts")
        let tableSculpt = `<table class='table border hover'><thead>`
        console.log('a')
        console.log(topSculptData)
        console.log('b')
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
    // Top Makers
    {
        const topMakerData = await getData("/api/graph/topMakers")
        let tableMaker = `<table class='table border hover'><thead>`
        for (h of topMakerData.headers) {
            tableMaker += `<th>${h}</th>`
        }
        tableMaker += '</thead><tbody>'
        for (x of topMakerData.data) {
            tableMaker += `<tr><td><a href="/maker/id/${x.maker_id}">${x.maker_name}</a></td><td>${x.total}</td></tr>`
        }
        tableMaker += '</tbody></table>'
        $('#artisan-top-maker').append(tableMaker)
    }
    // total Maker/Sculpts
    {
        const totalMakerData = await getData("/api/graph/totalMakers")
        const totalSculptData = await getData("/api/graph/totalSculpts")
        const totalArtisansIHaveCount = await getData("/api/graph/artisansIHaveCount")
        console.log(totalMakerData)
        let totalCounts = `<table class='table border hover'><thead>`
        totalCounts += `<th class="text-center">Total Makers</th>`
        totalCounts += `<th class="text-center">Have Sculpts</th>`
        totalCounts += `<th class="text-center">Total Sculpts</th>`
        totalCounts += `<th class="text-center">Total Have</th>`

        totalCounts += '</thead><tbody><tr>'

        totalCounts += `<td class="text-center">${totalMakerData.data.makers.length}</td>`
        totalCounts += `<td class="text-center">${totalSculptData.data.sculptCount.length}</td>`
        totalCounts += `<td class="text-center">${totalSculptData.data.sculptsNotArrived.length}</td>`
        totalCounts += `<td class="text-center">${totalArtisansIHaveCount.data.length}</td>`

        totalCounts += '</tr></tbody></table>'
        $('#artisan-total-counts').append(totalCounts)
    }
    //artisansByCount
    {
        const artisanData = await getData("/api/graph/haveArtisansByCount")
        console.log(artisanData)
        $('#artisan-count-chart').highcharts({
            chart: {
                type: 'pie',
                backgroundColor: 'transparent'
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
    }
    //makerByCount
    {
        const makerData = await getData("/api/graph/makerHaveByCount")
        $('#maker-count-chart').highcharts({
            chart: {
                type: 'pie',
                backgroundColor: 'transparent'
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
    }
    // Sale Types
    {
        const saleTypeWins = await getData("/api/graph/saleTypeWins")
        let tableMaker = `<table class='table border hover'><thead>`
        for (h of saleTypeWins.headers) {
            tableMaker += `<th>${h}</th>`
        }
        tableMaker += '</thead><tbody>'
        for (x of saleTypeWins.data) {
            tableMaker += `<tr><td>${x.name}</td><td>${x.y}</td></tr>`
        }
        tableMaker += '</tbody></table>'
        $('#artisan-sale-types').append(tableMaker)
    }
    //artisansByCount
    {
        const saleTypeWins = await getData("/api/graph/saleTypeWins")
        console.log(saleTypeWins)
        $('#artisan-pie-sales').highcharts({
            chart: {
                type: 'pie',
                backgroundColor: 'transparent'
            },
            title: {
                text: 'Count By Sale Type'
            },

            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            legend: {
                enabled: true
            },
            series: [{
                name: "Sale Type",
                colorByPoint: true,
                data: saleTypeWins.data
            }]
        })
    }
    //purchasesByMonthCount
    {
        const monthPurch = await getData("/api/graph/monthlyPurchases")

        $('#monthy-purchase-chart').highcharts({
            chart: {
                type: 'pie',
                backgroundColor: 'transparent'
            },
            title: {
                text: 'Count By Month Purchased'
            },

            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            legend: {
                enabled: true
            },
            series: [{
                name: "Montly Purchase Count",
                colorByPoint: true,
                data: monthPurch.data.purchases
            }]
        })
    }
    //yearlyWinCountByMaker
    {
        const maker_id = window.location.pathname.split('/').at(-1)
        const yearWins = await getData(`/api/graph/getYearlyWinsByMaker/${maker_id}`)
        $('yearWinsChart').highcharts({
            chart: {
                type: 'bar',
                backgroundColor: 'transparent'
            },
            title: {
                text: "Yes"
            },
            legend: {
                enabled: true
            },
            series: [{
                data: yearWins.data
            }]
        })
    }
    {
        const countries = await getData(`/api/graph/getAllMakerCountries`)
        $('#maker-countries').highcharts({
            chart: {
                type: 'pie',
                backgroundColor: 'transparent'
            },
            title: {
                text: "Count of Maker's Country"
            },

            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            legend: {
                enabled: true
            },
            series: [{
                name: "Maker Country",
                colorByPoint: true,
                data: countries.data2
            }]
        })

    }
});

async function getData(url) {
    let result;
    result = await $.ajax({
        url: url,
        type: 'GET'
    });
    return result;
}