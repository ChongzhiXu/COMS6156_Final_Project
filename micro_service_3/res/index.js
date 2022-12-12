function showSelection(a) {
    $("#trend-result").empty();
    $("#order_transaction_table").empty();
    if (a === 1){
        let x = document.getElementById("item-price-search");
        let y = document.getElementById("item-order-search");
        x.style.display = "block";
        y.style.display = "none";
    } else {
        let x = document.getElementById("item-price-search");
        let y = document.getElementById("item-order-search");
        x.style.display = "none";
        y.style.display = "block";
    }
    document.getElementById("order-type-id").value = '';
    document.getElementById("type-id").value = '';
    document.getElementById("region-id").value = '';
    document.getElementById("date").value = '';
}

function search_trend() {
    let type_id = document.getElementById("type-id").value;
    let region_id = document.getElementById("region-id").value;
    let date = document.getElementById("date").value;
    let sql = "";

    if (type_id == "") {
        alert("Type_id information must be filled!")
    } else if (type_id && region_id && date) {
        console.log("All information search")
        sql = "select * from microService_3.Market_History where type_id = " + type_id + " and region_id = " + region_id + " and date = '" + date + "'";
        $.ajax({
            url: "http://localhost:63300/api/general/mysql/executeQuery?sql="+sql,
            type: "GET",
            error: function () {
                alert("Sorry! Some error happened");
            },
            success: function (data) {
                // console.log(data);
                $("#trend-result").empty();
                let new_div = "";
                new_div +=
                    // "<table className=\"table table-striped\">\n" +
                    "<thead>\n" +
                    "<tr>\n" +
                    "<th scope=\"col\">#</th>\n" +
                    "<th scope=\"col\">Order ID</th>\n" +
                    "<th scope=\"col\">Region ID</th>\n" +
                    "<th scope=\"col\">type ID</th>\n" +
                    "<th scope=\"col\">Date</th>\n" +
                    "<th scope=\"col\">Highest</th>\n" +
                    "<th scope=\"col\">Lowest</th>\n" +
                    "<th scope=\"col\">Average</th>\n" +
                    "<th scope=\"col\">Order Count</th>\n" +
                    "<th scope=\"col\">Volume</th>\n" +
                    "</tr>\n" +
                    "</thead>";
                new_div += "<tbody>";
                for (let i=0; i<data.length; i++) {
                    new_div +=
                        "<tr>\n" +
                        "<th scope=\"row\">" + (i+1) + "</th>\n" +
                        "<td>" + data[i][0] + "</td>\n" +
                        "<td>" + data[i][1] + "</td>\n" +
                        "<td>" + data[i][2] + "</td>\n" +
                        "<td>" + data[i][3] + "</td>\n" +
                        "<td>" + data[i][4] + "</td>\n" +
                        "<td>" + data[i][5] + "</td>\n" +
                        "<td>" + data[i][6] + "</td>\n" +
                        "<td>" + data[i][7] + "</td>\n" +
                        "<td>" + data[i][8] + "</td>\n" +
                        "</tr>";
                }
                new_div += "</tbody>\n";
                $("#transaction_table").append(new_div);
            }
        });
    } else if (type_id != "" && region_id == "" && date != "") {
        console.log("Search in different region")
        sql = "select * from microService_3.Market_History where type_id = " + type_id + " and date = '" + date + "'";
        $.ajax({
            url: "http://localhost:63300/api/general/mysql/executeQuery?sql="+sql,
            type: "GET",
            error: function () {
                alert("Sorry! Some error happened");
            },
            success: function (data) {
                // console.log(data[0]);
                let x_axis = [];
                for (let i=0; i<data.length; i++) {
                    if (x_axis.includes(data[i][1])) {} else {
                        x_axis.push(data[i][1]);
                    }
                }
                // console.log(x_axis);
                // compute the regional data average
                let region_data = new Map();
                for (let i=0; i<data.length; i++) {
                    if (region_data.has(data[i][1])) {
                        region_data.set(data[i][1], [region_data.get(data[i][1])[0] +data[i][4], region_data.get(data[i][1])[1] +data[i][5], region_data.get(data[i][1])[2] +data[i][6], region_data.get(data[i][1])[3] + 1]);
                    } else {
                        region_data.set(data[i][1], [data[i][4], data[i][5], data[i][6], 1]);
                    }
                }

                let final_region_data = new Map();
                for (let [key, value] of region_data) {
                    final_region_data.set(key, [value[0]/value[3], value[1]/value[3], value[2]/value[3]]);
                }

                let highest_value = [];
                let lowest_value = [];
                let average_value = [];
                for (let i=0; i<x_axis.length; i++) {
                    highest_value.push(final_region_data.get(x_axis[i])[0])
                    lowest_value.push(final_region_data.get(x_axis[i])[1])
                    average_value.push(final_region_data.get(x_axis[i])[2])
                }

                $("#trend-result").empty();
                $("#trend-result").append("<div id=\"region_price_info\" style=\"height:1000px; width: 100%\"></div>");

                // draw the chart
                var app = {};

                var chartDom = document.getElementById('region_price_info');
                var myChart = echarts.init(chartDom);
                var option;

                const posList = [
                    'left',
                    'right',
                    'top',
                    'bottom',
                    'inside',
                    'insideTop',
                    'insideLeft',
                    'insideRight',
                    'insideBottom',
                    'insideTopLeft',
                    'insideTopRight',
                    'insideBottomLeft',
                    'insideBottomRight'
                ];
                app.configParameters = {
                    rotate: {
                        min: -90,
                        max: 90
                    },
                    align: {
                        options: {
                            left: 'left',
                            center: 'center',
                            right: 'right'
                        }
                    },
                    verticalAlign: {
                        options: {
                            top: 'top',
                            middle: 'middle',
                            bottom: 'bottom'
                        }
                    },
                    position: {
                        options: posList.reduce(function (map, pos) {
                            map[pos] = pos;
                            return map;
                        }, {})
                    },
                    distance: {
                        min: 0,
                        max: 100
                    }
                };
                app.config = {
                    rotate: 90,
                    align: 'left',
                    verticalAlign: 'middle',
                    position: 'insideBottom',
                    distance: 15,
                    onChange: function () {
                        const labelOption = {
                            rotate: app.config.rotate,
                            align: app.config.align,
                            verticalAlign: app.config.verticalAlign,
                            position: app.config.position,
                            distance: app.config.distance
                        };
                        myChart.setOption({
                            series: [
                                {
                                    label: labelOption
                                },
                                {
                                    label: labelOption
                                },
                                {
                                    label: labelOption
                                }
                            ]
                        });
                    }
                };
                const labelOption = {
                    show: true,
                    position: app.config.position,
                    distance: app.config.distance,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    rotate: app.config.rotate,
                    formatter: '{c}  {name|{a}}',
                    fontSize: 16,
                    rich: {
                        name: {}
                    }
                };
                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['Highest', 'Lowest', 'Average']
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar', 'stack'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: { show: false },
                            data: x_axis,
                            name: 'Region_ID'
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: 'Price'
                        }
                    ],
                    series: [
                        {
                            name: 'Highest Price',
                            type: 'bar',
                            barGap: 0,
                            label: labelOption,
                            emphasis: {
                                focus: 'series'
                            },
                            data: highest_value
                        },
                        {
                            name: 'Lowest Price',
                            type: 'bar',
                            label: labelOption,
                            emphasis: {
                                focus: 'series'
                            },
                            data: lowest_value
                        },
                        {
                            name: 'Average Price',
                            type: 'bar',
                            label: labelOption,
                            emphasis: {
                                focus: 'series'
                            },
                            data: average_value
                        }
                    ]
                };

                option && myChart.setOption(option);
            }
        });
    } else if (type_id != "" && region_id != "" && date == "") {
        console.log("Search date trend")
        sql = "select * from microService_3.Market_History where type_id = " + type_id + " and region_id = " + region_id;
        $.ajax({
            url: "http://localhost:63300/api/general/mysql/executeQuery?sql="+sql,
            type: "GET",
            error: function () {
                alert("Sorry! Some error happened");
            },
            success: function (data) {
                // console.log(data);
                let x_axis = [];
                for (let i=0; i<data.length; i++) {
                    if (x_axis.includes(data[i][3])) {} else {
                        x_axis.push(data[i][3]);
                    }
                }
                // console.log(x_axis);
                // compute the date data average
                let date_data = new Map();
                for (let i=0; i<data.length; i++) {
                    if (date_data.has(data[i][3])) {
                        date_data.set(data[i][3], [date_data.get(data[i][3])[0] + data[i][4], date_data.get(data[i][3])[1] + data[i][5], date_data.get(data[i][3])[2] + data[i][6], date_data.get(data[i][3])[3] + 1]);
                    } else {
                        date_data.set(data[i][3], [data[i][4], data[i][5], data[i][6], 1]);
                    }
                }

                let final_date_data = new Map();
                for (let [key, value] of date_data) {
                    final_date_data.set(key, [value[0]/value[3], value[1]/value[3], value[2]/value[3]]);
                }

                let highest_value = [];
                let lowest_value = [];
                let average_value = [];
                for (let i=0; i<x_axis.length; i++) {
                    highest_value.push(final_date_data.get(x_axis[i])[0])
                    lowest_value.push(final_date_data.get(x_axis[i])[1])
                    average_value.push(final_date_data.get(x_axis[i])[2])
                }

                $("#trend-result").empty();
                $("#trend-result").append("<div id=\"date_price_info\" style=\"height:1000px; width: 100%\"></div>");

                var chartDom = document.getElementById('date_price_info');
                var myChart = echarts.init(chartDom);
                var option;

                option = {
                    title: {
                        text: 'Date Price Trend'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['Highest Price', 'Lowest Price', 'Average Price']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: x_axis
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: 'Highest',
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: highest_value
                        },
                        {
                            name: 'Lowest',
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: lowest_value
                        },
                        {
                            name: 'Average',
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: average_value
                        }
                    ]
                };

                option && myChart.setOption(option);

            }
        });
    } else if (type_id != "" && region_id == "" && date == "") {
        console.log("Only type_id searched")
        sql = "select * from microService_3.Market_History where type_id = " + type_id;
        $.ajax({
            url: "http://localhost:63300/api/general/mysql/executeQuery?sql="+sql,
            type: "GET",
            error: function () {
                alert("Sorry! Some error happened");
            },
            success: function (data) {
                // console.log(data);
                let x_axis_date = [];
                for (let i=0; i<data.length; i++) {
                    if (x_axis_date.includes(data[i][3])) {} else {
                        x_axis_date.push(data[i][3]);
                    }
                }
                let x_axis_region = [];
                for (let i=0; i<data.length; i++) {
                    if (x_axis_region.includes(data[i][1])) {} else {
                        x_axis_region.push(data[i][1]);
                    }
                }
                // console.log(x_axis);
                let type_data = new Map();
                for (let i=0; i<data.length; i++) {
                    if (type_data.has([data[i][1],data[i][3]])) {
                        type_data.set([data[i][1],data[i][3]], [type_data.get([data[i][1],data[i][3]])[0] + data[i][6], type_data.get([data[i][1],data[i][3]])[1] + 1]);
                    } else {
                        type_data.set([data[i][1],data[i][3]], [data[i][6], 1]);
                    }
                }
                let final_type_data = new Map();
                for (let [key, value] of type_data) {
                    let ave_price = value[0]/value[1]
                    let ave_pair = [key[1], ave_price];
                    if (final_type_data.has(key[0])) {
                        final_type_data.get(key[0]).push(ave_pair);
                    } else {
                        let initial = [];
                        initial.push(ave_pair);
                        final_type_data.set(key[0], initial);
                    }
                    // console.log(final_type_data);
                }

                let type_line_data = [];
                for (let i=0; i<x_axis_region.length; i++) {
                    let cur_line = [];
                    for (let j=0; j<x_axis_date.length; j++) {
                        let valid = false;
                        let region_data_pair = final_type_data.get(x_axis_region[i]);
                        for (let pair of region_data_pair) {
                            // let pair = region_data_pair[key];
                            // console.log(pair);
                            if (pair[0] === x_axis_date[j]) {
                                // console.log(2);
                                cur_line.push(pair[1]);
                                valid = true;
                            }
                        }
                        if (valid === false) {
                            cur_line.push(0);
                        }
                    }
                    type_line_data.push(cur_line);
                }
                // console.log(type_line_data);

                $("#trend-result").empty();
                $("#trend-result").append("<div id=\"region_date_info\" style=\"height:1000px; width: 100%\"></div>");

                var chartDom = document.getElementById('region_date_info');
                var myChart = echarts.init(chartDom);
                var option;

                let new_series = [];
                for (let i=0; i<type_line_data.length; i++) {
                    let cur_line_data = {
                        name: x_axis_region[i],
                        type: 'line',
                        stack: 'Total',
                        data: type_line_data[i]
                    };
                    new_series.push(cur_line_data);
                }

                option = {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: x_axis_region
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: x_axis_date
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: new_series
                };

                option && myChart.setOption(option);
            }
        });
    }
}

function search_transaction() {
    console.log("All orders search")
    let type_id = document.getElementById("order-type-id").value;
    let sql = "select * from microService_3.Market_History where type_id = " + type_id;
    $.ajax({
        url: "http://localhost:63300/api/general/mysql/executeQuery?sql="+sql,
        type: "GET",
        error: function () {
            alert("Sorry! Some error happened");
        },
        success: function (data) {
            // console.log(data);
            $("#trend-result").empty();
            $("#transaction_table").empty();
            $("#order_transaction_table").empty();
            let new_div = "";
            new_div +=
                // "<table className=\"table table-striped\">\n" +
                "<thead>\n" +
                "<tr>\n" +
                "<th scope=\"col\">#</th>\n" +
                "<th scope=\"col\">Order ID</th>\n" +
                "<th scope=\"col\">Region ID</th>\n" +
                "<th scope=\"col\">type ID</th>\n" +
                "<th scope=\"col\">Date</th>\n" +
                "<th scope=\"col\">Highest</th>\n" +
                "<th scope=\"col\">Lowest</th>\n" +
                "<th scope=\"col\">Average</th>\n" +
                "<th scope=\"col\">Order Count</th>\n" +
                "<th scope=\"col\">Volume</th>\n" +
                "</tr>\n" +
                "</thead>";
            new_div += "<tbody>";
            for (let i=0; i<data.length; i++) {
                new_div +=
                    "<tr>\n" +
                    "<th scope=\"row\">" + (i+1) + "</th>\n" +
                    "<td>" + data[i][0] + "</td>\n" +
                    "<td>" + data[i][1] + "</td>\n" +
                    "<td>" + data[i][2] + "</td>\n" +
                    "<td>" + data[i][3] + "</td>\n" +
                    "<td>" + data[i][4] + "</td>\n" +
                    "<td>" + data[i][5] + "</td>\n" +
                    "<td>" + data[i][6] + "</td>\n" +
                    "<td>" + data[i][7] + "</td>\n" +
                    "<td>" + data[i][8] + "</td>\n" +
                    "</tr>";
            }
            new_div += "</tbody>\n";
            $("#order_transaction_table").append(new_div);
        }
    });
}