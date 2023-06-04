var avvisoID;

function emptyAnnouncement() {

    var nameAnnouncement = document.getElementById('nameAnnouncement').value;
    var descriptionAnnouncement = document.getElementById('descriptionAnnouncement').value;
    var typeAnnouncement = document.getElementById('typeAnnouncement').value;

    if (nameAnnouncement == "" || descriptionAnnouncement == "") {
        window.alert("E' necessario compilare tutti i campi per poter inserire l'avviso.");
    } else {
        insertAnnouncement(nameAnnouncement, descriptionAnnouncement, typeAnnouncement);
    }
}


function insertAnnouncement(nameAnnouncement, descriptionAnnouncement, typeAnnouncement) {

    var db = firebase.firestore();
    db.collection("avvisi").add({

            ID_CREATORE: localStorage.getItem("adminID"),
            titolo: nameAnnouncement,
            descrizione: descriptionAnnouncement,
            categoria: typeAnnouncement
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    window.alert("Avviso inserito correttamente nel sistema.");
    timeout("new-announcement.html");
}



//Funzione per generare un timeout
function timeout(page) {
    setTimeout(function () {
        window.open(page, "_self");
    }, 500);

}


function loadAnnouncement() {
    verifyUser();
    var db = firebase.firestore();
    var count = 0;

    db.collection("avvisi").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().titolo != "Avviso di default") {
                renderAnnouncement(doc);
                count++;
            }
        });
        if (count == 0) {
            window.alert("Non è stato inserito nessun avviso nel sistema.\r\nInserirne uno.");
            window.open("new-announcement.html", "_self");
        } else {
            document.getElementById('nameAnnouncement').disabled = false;
        }
    });
}


//Riempio il dropdown con gli avvisi presenti nel db
function renderAnnouncement(doc) {
    const announcementList = document.querySelector('#nameAnnouncement');
    let option = document.createElement('option');
    option.setAttribute('id-announcement', doc.id);
    option.textContent = doc.data().titolo;
    announcementList.appendChild(option);
}


//Cancello l'avviso dal DB
function deleteAnnouncement() {

   
}


function showDivAnnouncement() {
    categoryAnnouncement()
    //loadAnnouncement();
    var avviso = localStorage.getItem("avvisoID");
    var db = firebase.firestore();
    db.collection("avvisi").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.id == avviso) {
                document.getElementsByName('titleAnnouncement')[0].value = doc.data().titolo;
                document.getElementsByName('descriptionAnnouncement')[0].value = doc.data().descrizione;
                const text = doc.data().categoria;
                const $select = document.querySelector('#typeAnnouncement');
                const $options = Array.from($select.options);
                const optionToSelect = $options.find(item => item.text === text);
                // Here's the trick:
                $select.value = optionToSelect.value;
                avvisoID = doc.id;
            }
        });
    });
}


//Applico le modifiche apportate all'avviso
function updateAnnouncement() {

    var db = firebase.firestore();
    if (document.getElementById('titleAnnouncement').value == "" || document.getElementById('descriptionAnnouncement').value == "") {
        window.alert("E' necessario compilare tutti i campi per poter modificare l'avviso.");
    } else {
        db.collection("avvisi").doc(avvisoID).update({
                titolo: document.getElementById('titleAnnouncement').value,
                descrizione: document.getElementById('descriptionAnnouncement').value,
                categoria: document.getElementById('typeAnnouncement').value

            })
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });

        window.alert("Avviso modificato correttamente.");
        timeout("show-announcements.html");
    }

}


//Seleziono gli avvisi da mostrare nella visualizzazione
function listAnnouncement() {
    verifyUser();
    var db = firebase.firestore();
    var count = 0;
    db.collection("avvisi").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().titolo != "Avviso di default") {

                renderAnnouncementList(doc);
                count++;
            }
        });
        if (count == 0) {
            window.alert("Non è stato inserito nessun avviso nel sistema.\r\nInserirne uno.");
            window.open("new-announcement.html", "_self");
        }
    });
}


//Riempio le liste con gli avvisi presenti nel db
function renderAnnouncementList(doc) {

    const amministrazione = document.querySelector('#event-list-amministrazione');
    const bando = document.querySelector('#event-list-bando');
    const concorso = document.querySelector('#event-list-concorso');
    const meteo = document.querySelector('#event-list-meteo');
    let btn1 = document.createElement('button');
    btn1.setAttribute('type', 'showbutton');
    btn1.textContent = "Dettagli";
    let btn2 = document.createElement('button');
    btn2.setAttribute('type', 'showbutton');
    btn2.textContent = "Modifica";
    let btn3 = document.createElement('button');
    btn3.setAttribute('type', 'showbutton');
    btn3.textContent = "Elimina";

    if (doc.data().categoria == "Amministrazione") {
        let li = document.createElement('li');
        li.textContent = doc.data().titolo + " - ";
        btn1.setAttribute('id', doc.id);
        btn1.setAttribute('onclick', 'buttonDetailsAnnouncement(this)');
        btn2.setAttribute('id', doc.id);
        btn2.setAttribute('onclick', 'buttonModifyAnnouncement(this)');
        btn3.setAttribute('id', doc.id);
        btn3.setAttribute('onclick', 'buttonDeleteAnnouncement(this)');
        li.setAttribute('class', 'list-group-item');
        li.appendChild(btn1);
        li.appendChild(btn2);
        li.appendChild(btn3);
        amministrazione.appendChild(li);


    }else {
        if (doc.data().categoria == "Bando") {
            let li = document.createElement('li');
            li.textContent = doc.data().titolo + " - ";
            btn1.setAttribute('id', doc.id);
            btn1.setAttribute('onclick', 'buttonDetailsAnnouncement(this)');
            btn2.setAttribute('id', doc.id);
            btn2.setAttribute('onclick', 'buttonModifyAnnouncement(this)');
            btn3.setAttribute('id', doc.id);
            btn3.setAttribute('onclick', 'buttonDeleteAnnouncement(this)');
            li.setAttribute('class', 'list-group-item');
            li.appendChild(btn1);
            li.appendChild(btn2);
            li.appendChild(btn3);
            bando.appendChild(li);


        } else {
            if (doc.data().categoria == "Concorso") {
                let li = document.createElement('li');
                li.textContent = doc.data().titolo + " - ";
                btn1.setAttribute('id', doc.id);
                btn1.setAttribute('onclick', 'buttonDetailsAnnouncement(this)');
                btn2.setAttribute('id', doc.id);
                btn2.setAttribute('onclick', 'buttonModifyAnnouncement(this)');
                btn3.setAttribute('id', doc.id);
                btn3.setAttribute('onclick', 'buttonDeleteAnnouncement(this)');
                li.setAttribute('class', 'list-group-item');
                li.appendChild(btn1);
                li.appendChild(btn2);
                li.appendChild(btn3);
                concorso.appendChild(li);


            } else {
                if (doc.data().categoria == "Meteo") {
                    let li = document.createElement('li');
                    li.textContent = doc.data().titolo + " - ";
                    btn1.setAttribute('id', doc.id);
                    btn1.setAttribute('onclick', 'buttonDetailsAnnouncement(this)');
                    btn2.setAttribute('id', doc.id);
                    btn2.setAttribute('onclick', 'buttonModifyAnnouncement(this)');
                    btn3.setAttribute('id', doc.id);
                    btn3.setAttribute('onclick', 'buttonDeleteAnnouncement(this)');
                    li.setAttribute('class', 'list-group-item');
                    li.appendChild(btn1);
                    li.appendChild(btn2);
                    li.appendChild(btn3);
                    meteo.appendChild(li);

                }
            }
        }
    }

}


function buttonDeleteAnnouncement(bottone){

    var db = firebase.firestore();

    if (confirm("Sei sicuro di voler eliminare l'avviso selezionato?") == true) {
        db.collection("avvisi").get().then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                if (doc.id == bottone.getAttribute('id')) {
                    db.collection("avvisi").doc(doc.id).delete();
                    window.alert("L'avviso selezionato è stato eliminato correttamente.");
                    timeout("show-announcements.html");
                }
            });
        });
    }

}


//Apro la pagina per modificare l'evento passando l'ID per trovarlo nelDB
function buttonModifyAnnouncement(bottone) {
    localStorage.setItem("avvisoID", bottone.getAttribute("id"));
    window.open("modify-announcement.html", "_self");

}

function buttonDetailsAnnouncement(bottone){
    localStorage.setItem("avvisoID", bottone.getAttribute("id"));
    window.open("announcement-details.html", "_self");
}



function detailsAnnouncement() {

    const h3TitleAnnouncement = document.querySelector('#titleAnnouncement');
    const liTitle = document.querySelector('#nameAnnouncement');
    const liType = document.querySelector('#typeAnnouncement');
    const pDescription = document.querySelector('#descriptionAnnouncement');
    var db = firebase.firestore();
    db.collection("avvisi").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            if (doc.id == localStorage.getItem("avvisoID")) {

                h3TitleAnnouncement.textContent = doc.data().titolo;
                liTitle.textContent = doc.data().titolo;
                liType.textContent = doc.data().categoria;
                pDescription.textContent = doc.data().descrizione;
            }

        });
    });

}