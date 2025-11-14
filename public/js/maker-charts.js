$(async function () {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

    });
    let maker = await getData(`/api/maker/id/${window.location.pathname.split('/').at(-1)}`)
    {
        const maker_id = window.location.pathname.split('/').at(-1)
        let sculptCounts = await getData(`/api/maker/sculpt/count/${maker_id}`)
        let check = sculptCounts.pop() 
        let table = `<table class="table border odd">`
        table += `<tr><th>Sculpt</th><th>Count (${check.count})</th></tr>`
        sculptCounts.forEach(function(s) {
            table += `<tr><td>${s.sculpt}</td><td>${s.count}</td></tr>`    
        })
        table += `</table>`
        $('#sculptTable').append(table)
    }

    //yearlyWinCountByMaker
    {
        const maker_id = window.location.pathname.split('/').at(-1)
        const yearWins = await getData(`/api/graph/getYearlyWinsByMaker/${maker_id}`)
        $('#yearWinsChart').highcharts({
            chart: {
                type: 'pie',
                backgroundColor: 'transparent',
                height: '100%'
            },
            title: {
                text: `${yearWins.data.maker.display_name} Purchases by Year`
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series:[{
                name: "Wins",
                colorByPoint: true,
                data: yearWins.data.yearly
            }]
        })
    }
    {
        const maker_id = window.location.pathname.split('/').at(-1)
        const monthlyPurch = await getData(`/api/graph/monthlyPurchases/${maker_id}`)
        let data = monthlyPurch.data
        let seriesData = []
        data.purchases.forEach(function(s) {
            seriesData.push({ data: [s.y], name: s.name})    
        })
        Highcharts.chart('monthlyPurch', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Purchases By Month'
            },

            xAxis: {
                categories: data.headers,
                crosshair: false
            },
            yAxis: {
                min: 0,
                title: {
                    text: '# of Purchases'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: false,
                useHTML: true
            },
  
            series: seriesData
        })
    }
    //yearlyWinCountByMaker
    {
        const maker_id = window.location.pathname.split('/').at(-1)
        let sculptCounts = await getData(`/api/maker/sculpt/count/${maker_id}`)
        let data = []
        sculptCounts.pop()
        sculptCounts.forEach(function(s) {
            data.push({ value: s.count, name: s.sculpt})    
        })
        $('#sculptBubble').highcharts({
            chart: {
                type: 'packedbubble',
                backgroundColor: 'transparent'
            },
            title: {
                text: `Sculpts`
            },
            plotOptions: {
                packedbubble: {
                    minSize: '30%',
                    maxSize: '120%',
                    layoutAlgorithm: {
                        splitSeries: false,
                        gravitationalConstant: 0.02
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                        filter: {
                            property: 'y',
                            operator: '>',
                            value: 1
                        },
                        style: {
                            color: 'black',
                            textOutline: 'none',
                            fontWeight: 'normal'
                        }
                    }
                }
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            series:[{
                colorByPoint: true,
                name: maker.display_name,
                data: data
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