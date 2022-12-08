function showSelection(a) {
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
}

function search() {
    let type_id = document.getElementById("type-id").value;
    let region_id = document.getElementById("region-id").value;
    let date = document.getElementById("date").value;

    let sql = "select * from microService_3.Market_History where type_id = " + type_id;
    // console.log(type_id, region_id, date);
    $.ajax({
        url: "localhost:63300/api/general/mysql/executeQuery?sql="+sql,
        type: "GET",
        error: function () {
            alert("Sorry! Some error happened");
        },
        success: function (data) {
            console.log(data);
        }
    });
}
