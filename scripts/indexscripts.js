function loadIndex_html() {
    var url = window.location.href;
    console.log(url);
    if (user == null) {
        document.getElementById("loggedOut").style.display = "block";
        document.getElementById("loggedIn").style.display = "none";
        document.getElementById("messagesLoggedOut").innerHTML = "<div id='messages'></div>";
        document.getElementById("messagesLoggedIn").innerHTML = "";
        if (url.indexOf("#logout") > -1) {
            addGoodMessage("Logged Out Successfully");
        }
    } else {
        document.getElementById("loggedIn").style.display = "block";
        document.getElementById("loggedOut").style.display = "none";
        document.getElementById("messagesLoggedOut").innerHTML = "";
        document.getElementById("messagesLoggedIn").innerHTML = "<div id='messages'></div>";
        toggleNav();
        if (url.indexOf("#login") > -1) {
            addGoodMessage("Logged In Successfully");
        }
    }
}