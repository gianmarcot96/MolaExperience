//Campi di inserimento evento non vuoti
function checkField() {

    var nameAccount = document.getElementById('nameAccount').value;
    var emailAccount = document.getElementById('emailAccount').value;
    var password1Account = document.getElementById('password1Account').value;
    var password2Account = document.getElementById('password2Account').value;

    if (nameAccount == "" || emailAccount == "" || password1Account == "" || password2Account == "") {
        window.alert("E' necessario compilare tutti i campi per procedere.");
    } else {
        if (!(emailAccount.indexOf('@') > -1)) {
            window.alert("L'email inserita non è corretta, reinseriscila");
        }
        else{
            if (password1Account != password2Account) {
                window.alert("Le password inserite non coincidono, reinseriscile");
            }
            else
            {
                var db = firebase.firestore();
                db.collection("amministratori").add({

                    email: emailAccount,
                    nome: nameAccount,
                    password: password1Account
                });  
                window.alert("Amministratore accreditato correttamente. Sarai reinderizzato nuovamente alla tua area riservata.");
                timeout("admin.html");
            }
        }
    }
}


//Funzione per generare un timeout
function timeout(page) {

    setTimeout(function () {
        window.open(page, "_self");
    }, 500);

}