$(async function () {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

    });

 
    //yearlyWinCountByMaker
    {
        const maker_id = window.location.pathname.split('/').at(-1)
        const yearWins = await getData(`/api/graph/getYearlyWinsByMaker/${maker_id}`)
        $('#yearWinsChart').highcharts({
            chart: {
                type: 'pie',
                backgroundColor: 'transparent'
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


});

async function getData(url) {
    let result;
    result = await $.ajax({
        url: url,
        type: 'GET'
    });
    return result;
}