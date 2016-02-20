function Get(yourUrl) {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;

}

var json_obj = JSON.parse(Get("http://localhost:8080/api/GetChunk/"));

document.getElementById("json").innerHTML = Get("http://localhost:8080/api/GetChunk/");


