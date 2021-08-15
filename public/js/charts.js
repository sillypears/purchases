$(function () {

    function create_chart(render_to, type, title, name, url) {

        let options = {
            chart: {
                renderTo: render_to,
                type: type
            },
            title: {
                text: title
            },

            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            series: [{
                name: name, 
                colorByPoint: true,
                data: []
            }]
        };

        $.getJSON(url, function (data) {
            let jData = []
            let headers = []
            for (i in data.data) {
                jData.push({
                    name: data.data[i].entity,
                    y: data.data[i].count
                })
                headers.push(data.data[i].entity)
            }
            options.series[0].data = jData
            var chart1 = new Highcharts.Chart(options);
        });
    }

    create_chart('count-chart', 'pie', 'Count By Sculpt', "Sculpts", "http://localhost:3003/api/graph/artisansByCount")
    create_chart('price-chart', 'Line', 'Price By Sculpt', "Sculpts", "http://localhost:3003/api/graph/artisansByPrice")

});