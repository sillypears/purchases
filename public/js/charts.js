$(async function () {

        // Function to fetch data from your API endpoint
        function fetchDataFromAPI(url) {
          return $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json'
          }).fail(function(error) {
            console.error('Error fetching data:', error);
            return {};
          });
        }
      
        // Process the data to group items with value 1
        function processDataForPieChart(dataArray) {
          let mainItems = {};
          let otherCount = 0;
          const data = {};
          dataArray['data'].forEach(item => {
            data[item.name] = item.count;
          });
          // Separate items into main items and "Other"
          for (const [key, value] of Object.entries(data)) {
            if (value > 1) {
              mainItems[key] = value;
            } else {
              otherCount++;
            }
          }
        //   mainItems = data;
          // Convert to Chart.js format
          const labels = [...Object.keys(mainItems)];
          const values = [...Object.values(mainItems)];
          
          // Add "Other" category if there are items with value 1
          if (otherCount > 0) {
            labels.push("Only 1");
            values.push(otherCount);
          }
          
          return { labels, values };
        }
      
        // Generate random colors for the chart
        function generateColors(count) {
          const colors = [];
          for (let i = 0; i < count; i++) {
            const r = Math.floor(Math.random() * 200);
            const g = Math.floor(Math.random() * 200);
            const b = Math.floor(Math.random() * 200);
            colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
          }
          return colors;
        }
      
        // Create the pie chart with data from API
        function createPieChartSculptCount() {
          const ctx = $('#pieSculptCount').get(0).getContext('2d');
          
          // Show loading state (optional)
          ctx.font = '16px Arial';
          ctx.fillText('Loading data...', ctx.canvas.width/2 - 60, ctx.canvas.height/2);
          
          // Fetch and process the data
          fetchDataFromAPI('/api/graph/pieArtisansBycount').then(function(rawData) {
            const { labels, values } = processDataForPieChart(rawData);
            const backgroundColors = generateColors(labels.length);
            
            // Create the chart
            new Chart(ctx, {
              type: 'pie',
              data: {
                labels: labels,
                datasets: [{
                  data: values,
                  backgroundColor: backgroundColors,
                  borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                    position: 'right',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  },
                  title: {
                    display: true,
                    text: 'Sculpt Count'
                  }
                }
              }
            });
          });
        }
        function createPieChartMakerCount() {
            const ctx = $('#pieMakerCount').get(0).getContext('2d');
            
            // Show loading state (optional)
            ctx.font = '16px Arial';
            ctx.fillText('Loading data...', ctx.canvas.width/2 - 60, ctx.canvas.height/2);
            
            // Fetch and process the data
            fetchDataFromAPI('/api/graph/pieMakersBycount').then(function(rawData) {
              const { labels, values } = processDataForPieChart(rawData);
              const backgroundColors = generateColors(labels.length);
              
              // Create the chart
              new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: labels,
                  datasets: [{
                    data: values,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    },
                    title: {
                      display: true,
                      text: 'Maker Count'
                    }
                  }
                }
              });
            });
          }
        // Initialize the chart
        createPieChartSculptCount();
        createPieChartMakerCount();

    })