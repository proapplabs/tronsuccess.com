

function toast(msg) {
    var x = document.querySelector(".toast");
    x.className = "toast show";
    var msgBody = document.querySelector(".toast .body");
    msgBody.innerHTML = msg
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

function test(msg) {
    alert(msg)
}