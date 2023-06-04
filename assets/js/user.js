function verifyUser() {
    if (localStorage.getItem("amministratore") == null) {

        window.alert("Effettuare il login!");
        window.open("login-ita.html", "_self");
    }
}