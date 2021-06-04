

function sendView(num) {

    var btn = document.getElementById(num);
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string+"/"+num);
    console.log(url);
    console.log(num);

}