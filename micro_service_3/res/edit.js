function showFunction(a) {
    let x = document.getElementById("insert-session");
    let y = document.getElementById("delete-session");
    let z = document.getElementById("update-session");
    if (a === 1){
        x.style.display = "block";
        y.style.display = "none";
        z.style.display = "none";
        document.getElementById("order-id").value = '';
        document.getElementById("region-id").value = '';
        document.getElementById("type-id").value = '';
        document.getElementById("date").value = '';
        document.getElementById("highest-price").value = '';
        document.getElementById("lowest-price").value = '';
        document.getElementById("average-price").value = '';
        document.getElementById("order-count").value = '';
        document.getElementById("volume").value = '';

    } else if (a === 2) {
        x.style.display = "none";
        y.style.display = "block";
        z.style.display = "none";
        document.getElementById("order-id-delete").value = '';
    } else if (a === 3) {
        x.style.display = "none";
        y.style.display = "none";
        z.style.display = "block";
        document.getElementById("order-id-update").value = '';
        document.getElementById("region-id-update").value = '';
        document.getElementById("type-id-update").value = '';
        document.getElementById("date-update").value = '';
        document.getElementById("highest-price-update").value = '';
        document.getElementById("lowest-price-update").value = '';
        document.getElementById("average-price-update").value = '';
        document.getElementById("order-count-update").value = '';
        document.getElementById("volume-update").value = '';
    }
}

function func (a) {

    if (a===1) {
        let order_id = document.getElementById("order-id").value;
        let region_id = document.getElementById("region-id").value;
        let type_id = document.getElementById("type-id").value;
        let date = document.getElementById("date").value;
        let highest = document.getElementById("highest-price").value;
        let lowest = document.getElementById("lowest-price").value;
        let average = document.getElementById("average-price").value;
        let order_count = document.getElementById("order-count").value;
        let volume = document.getElementById("volume").value;
        let sql = "";
        sql = "INSERT INTO microService_3.Market_History (order_id,region_id,type_id,date,highest,lowest,average,order_count,volume) VALUES (" + order_id + "," + region_id + "," + type_id + ",'" + date + "'," + highest + "," + lowest + "," + average + "," + order_count + "," + volume + ");";
        console.log(sql);
        $.ajax({
            url: "http://18.191.120.105:63300/api/general/mysql/execute?sql="+sql,
            type: "GET",
            error: function () {
                alert("Sorry! Some error happened");
            },
            success: function (data) {
                alert(data);
            }
        });
    } else if (a===2) {
        let order_id = document.getElementById("order-id-delete").value;
        let sql = "";
        sql = "DELETE FROM microService_3.Market_History WHERE order_id="+ order_id +";";
        $.ajax({
            url: "http://18.191.120.105:63300/api/general/mysql/execute?sql="+sql,
            type: "GET",
            error: function () {
                alert("Sorry! Some error happened");
            },
            success: function (data) {
                alert(data);
            }
        });
    } else if (a===3) {
        let order_id = document.getElementById("order-id-update").value;
        let region_id = document.getElementById("region-id-update").value;
        let type_id = document.getElementById("type-id-update").value;
        let date = document.getElementById("date-update").value;
        let highest = document.getElementById("highest-price-update").value;
        let lowest = document.getElementById("lowest-price-update").value;
        let average = document.getElementById("average-price-update").value;
        let order_count = document.getElementById("order-count-update").value;
        let volume = document.getElementById("volume-update").value;
        let sql = "";
        sql = "UPDATE microService_3.Market_History SET order_id=" + order_id + "," + "region_id=" + region_id + "," + "type_id=" + type_id + "," + "date=" + "'" + date + "'" + "," + "highest=" + highest + "," + "lowest=" + lowest + "," + "average=" + average + "," + "order_count=" + order_count + "," + "volume=" + volume + " WHERE order_id=" + order_id + ";";

        console.log(sql);
        $.ajax({
            url: "http://18.191.120.105:63300/api/general/mysql/execute?sql="+sql,
            type: "GET",
            error: function () {
                alert("Sorry! Some error happened");
            },
            success: function (data) {
                alert(data);
            }
        });
    }
}