$(async function () {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

    });
    let maker = await getData(`/api/maker/id/${window.location.pathname.split('/').at(-1)}`)
    {
        const maker_id = window.location.pathname.split('/').at(-1)
        const sculptCounts = await getData(`/api/maker/sculpt/count/${maker_id}`)
        let table = `<table class="table border odd">`
        table += `<tr><th>Sculpt</th><th>Count</th></tr>`
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

    //yearlyWinCountByMaker
    {
        const maker_id = window.location.pathname.split('/').at(-1)
        const sculptCounts = await getData(`/api/maker/sculpt/count/${maker_id}`)
        let data = []
        sculptCounts.forEach(function(s) {
            data.push({ value: s.count, name: s.sculpt})    
        })
        console.log(data)
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