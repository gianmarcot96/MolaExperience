function login() {

    var db = firebase.firestore();
    let email = document.getElementById('emailField').value;
    let password = document.getElementById('passwordField').value;

    if ((email == "" || password == "")) {

        window.alert("Inserire le credenziali!");

    }
    if (!(email == "" || password == "")) {

        var res = 0;
        db.collection("amministratori").get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                res = res + renderAmministratori(doc, email, password);
            })
            if (res > 0) {
                window.alert("Credenziali errate!");
            }
        })

    }

}

function renderAmministratori(doc, email, password) {

    if ((email == doc.data().email) && (password == doc.data().password)) {

        var admin = doc.data().nome;
        localStorage.setItem("amministratore", admin);
        localStorage.setItem("adminID", doc.id);
        window.open("admin.html", "_self");

    } else {

        return 1;

    }

}