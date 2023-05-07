export function alert(icon, title, content, timer = 3000) {
    if (icon == "error") {
        timer = 10000
    }
    var x = document.querySelector(".toast");
    x.className = "toast show";
    var msgBody = document.querySelector(".toast .body");
    // msgBody.innerHTML = '<h3>' + title + '</h3>' + content
    msgBody.innerHTML = content
    setTimeout(function () { x.className = x.className.replace("show", ""); }, timer);
}
export function alertScam(img) {
    // alert('info', 'SCAM', ' <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMMWqYnSNIk2hWN4qYadO5nBPrjzelfZPrww&usqp=CAU" alt="scam" width="100%"> ', 99999999999999999)
    alert('info', 'SCAM', ' You are making suspicious transactions.<br/>Your account has been marked as spam.', 99999999999999999)
}
