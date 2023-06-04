//Campi di inserimento evento non vuoti
function emptyFields() {
    var nameEvent = document.getElementById('nameEvent').value;
    var descriptionEvent = document.getElementById('descriptionEvent').value;
    var locationEvent = document.getElementById('locationEvent').value;
    var cityEvent = document.getElementById('cityEvent').value;
    var typeEvent = document.getElementById('typeEvent').value;
    var hourEvent = document.getElementById('hourEvent').value;
    var dateEvent = document.getElementById('dateEvent').value;
    var numberSpotEvent = document.getElementById('numberSpotEvent').value;
    var priceEvent = document.getElementById('priceEvent').value;
    var linkEvent = document.getElementById('linkEvent').value;
    var hEvent = document.getElementById('hEvent').value;
    var mEvent = document.getElementById('mEvent').value;
    var imageEvent;
    var stockURI = "";
    if (imageEvent = document.getElementById('imageEvent').files[0] == null) {
        stockURI = checkTypeEventImage(typeEvent);
    } else {
        imageEvent = document.getElementById('imageEvent').files[0]
        var imageName = imageEvent.name;
    }
    if (nameEvent == "" || descriptionEvent == "" || locationEvent == "" || cityEvent == "" || typeEvent ==
        "" || hourEvent == "" || dateEvent == "" || linkEvent == "") {

        window.alert("Compilare tutti i campi!");

    } else {

        if (stockURI != "") {

            inserisciStock(nameEvent, descriptionEvent, locationEvent, linkEvent, numberSpotEvent, typeEvent, priceEvent,
                hEvent, mEvent, dateEvent, hourEvent, stockURI, cityEvent);

        } else {
            inserisci(nameEvent, descriptionEvent, locationEvent, linkEvent, numberSpotEvent, typeEvent, priceEvent,
                hEvent, mEvent, dateEvent, hourEvent, imageEvent, imageName, cityEvent);
        }

    }

}

//Inserimento di un evento nel DB
function inserisci(nameEvent, descriptionEvent, locationEvent, linkEvent, numberSpotEvent, typeEvent,
    priceEvent, hEvent, mEvent, dateEvent, hourEvent, imageEvent, imageName, cityEvent) {

    var db = firebase.firestore();
    var storage = firebase.storage();
    var storageRef = storage.ref();


    // Aggiungo un nuovo documento con un ID generato automaticamente.

    db.collection("eventi").add({

            ID_CREATORE: localStorage.getItem("adminID"),
            descrizione: descriptionEvent,
            luogo: locationEvent,
            posti_disponibili: parseInt(numberSpotEvent),
            titolo: nameEvent,
            link: linkEvent,
            categorie: typeEvent,
            prezzo: priceEvent,
            ora_inizio: hourEvent,
            ore: hEvent,
            minuti: mEvent,
            data: dateEvent.substring(8, 10) + "/" + dateEvent.substring(5, 7) + "/" + dateEvent
                .substring(0, 4),
            photoURI: "",
            città_evento: cityEvent

        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            var storageRef = firebase.storage().ref('ImmaginiEventi/' + docRef.id + "/" + imageName);
            var uploadTask = storageRef.put(imageEvent);
            docRef.update({
                photoURI: "ImmaginiEventi/" + docRef.id + "/" + imageName
            })
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    window.alert("Evento inserito correttamente!");
    timeout("new-event.html");
}

//Inserimento di un evento nel DB con immagine di stock

function inserisciStock(nameEvent, descriptionEvent, locationEvent, linkEvent, numberSpotEvent, typeEvent,
    priceEvent, hEvent, mEvent, dateEvent, hourEvent, stockURI, cityEvent) {

    var db = firebase.firestore();
    var storage = firebase.storage();
    var storageRef = storage.ref();
    // Aggiungo un nuovo documento con un ID generato automaticamente.

    db.collection("eventi").add({

            ID_CREATORE: localStorage.getItem("adminID"),
            descrizione: descriptionEvent,
            luogo: locationEvent,
            posti_disponibili: parseInt(numberSpotEvent),
            titolo: nameEvent,
            link: linkEvent,
            categorie: typeEvent,
            prezzo: priceEvent,
            ora_inizio: hourEvent,
            ore: hEvent,
            minuti: mEvent,
            data: dateEvent.substring(8, 10) + "/" + dateEvent.substring(5, 7) + "/" + dateEvent
                .substring(0, 4),
            photoURI: "",
            città_evento: cityEvent
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            docRef.update({
                photoURI: stockURI
            })
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    window.alert("Evento inserito correttamente!");
    timeout("new-event.html");
}


function loadEvent() {
    verifyUser();
    var db = firebase.firestore();
    var count = 0;
    document.getElementById('nameEvent').disabled = true;
    db.collection("eventi").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().titolo != "Evento di stock") {
                renderEvent(doc);
                count++;
            }
        });
        if (count == 0) {
            window.alert("Nessun evento presente nel DB!\r\nInserirne uno.");
            window.open("new-event.html", "_self");
        } else {
            document.getElementById('nameEvent').disabled = false;
        }
    });
}

//Riempio il dropdown con gli eventi presenti nel db
function renderEvent(doc) {
    const eventList = document.querySelector('#nameEvent');
    let option = document.createElement('option');
    option.setAttribute('id-event', doc.id);
    option.textContent = doc.data().titolo;
    eventList.appendChild(option);
}

//Cancello l'evento dal DB
function deleteEvent() {

    var db = firebase.firestore();
    var event = document.getElementById('nameEvent').value
    if (confirm("Sei sicuro di voler eliminare l'evento selezionato?") == true) {
        db.collection("eventi").get().then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                if (doc.data().titolo == event) {
                    if (doc.data().photoURI == "ImmaginiStock/evento-spettacolo.jpg" || doc.data().photoURI == "ImmaginiStock/evento-convegno.jpg" || doc.data().photoURI == "ImmaginiStock/evento-workshop.jpg" || doc.data().photoURI == "ImmaginiStock/evento-beneficenza.jpg" || doc.data().photoURI == "ImmaginiStock/evento-sportivo.jpg" || doc.data().photoURI == "ImmaginiStock/evento-conferenzaStampa.jpg") {
                        db.collection("eventi").doc(doc.id).delete();
                        window.alert("Evento eliminato correttamente");
                    } else {
                        deletePhoto(doc.data().photoURI);
                        db.collection("eventi").doc(doc.id).delete();
                        window.alert("Evento eliminato correttamente");
                    }

                    timeout("delete-event.html");

                }
            });
        });
    }
}

//Funzione per generare un timeout
function timeout(page) {

    setTimeout(function () {
        window.open(page, "_self");
    }, 500);

}

//Cancello la foto associata all'evento all'interno dello storage del DB
function deletePhoto(url) {

    var storageRef = firebase.storage().ref();
    storageRef = firebase.storage().ref(url);
    // Delete the file
    storageRef.delete().then(() => {}).catch((error) => {

        console.log(error);

    });
}

function checkTypeEventImage(typeEvent) {
    stockURI = "";
    if (typeEvent == "Spettacolo") {
        stockURI = "ImmaginiStock/evento-spettacolo.jpg";
    } else {
        if (typeEvent == "Convegno") {
            stockURI = "ImmaginiStock/evento-convegno.jpg";
        } else {
            if (typeEvent == "Workshop") {
                stockURI = "ImmaginiStock/evento-workshop.jpg";
            } else {
                if (typeEvent == "Beneficenza") {
                    stockURI = "ImmaginiStock/evento-beneficenza.jpg";
                } else {
                    if (typeEvent == "Sportivo") {
                        stockURI = "ImmaginiStock/evento-sportivo.jpg";
                    } else {
                        if (typeEvent == "Conferenza stampa") {
                            stockURI = "ImmaginiStock/evento-conferenzaStampa.jpg";
                        }
                    }
                }
            }
        }

    }
    return stockURI;
}


function showDiv() {
    loadCity();
    var evento = localStorage.getItem("eventoID");
    var db = firebase.firestore();

    db.collection("eventi").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.id == evento) {
                document.getElementsByName('titleEvent')[0].value = doc.data().titolo;
                document.getElementsByName('descriptionEvent')[0].value = doc.data().descrizione;
                document.getElementsByName('locationEvent')[0].value = doc.data().luogo;
                document.getElementsByName('hourEvent')[0].value = doc.data().ora_inizio;
                document.getElementsByName('linkEvent')[0].value = doc.data().link;
                document.getElementsByName('hour')[0].value = doc.data().ore;
                document.getElementsByName('minute')[0].value = doc.data().minuti;
                document.getElementsByName('spot')[0].value = doc.data().posti_disponibili;
                document.getElementsByName('price')[0].value = doc.data().prezzo;
                const text = doc.data().città_evento;
                const $select = document.querySelector('#cityEvent');
                const $options = Array.from($select.options);
                const optionToSelect = $options.find(item => item.text === text);
                // Here's the trick:
                $select.value = optionToSelect.value;
                const text1 = doc.data().categorie;
                const $select1 = document.querySelector('#typeEvent');
                const $options1 = Array.from($select1.options);
                const optionToSelect1 = $options1.find(item => item.text === text1);
                // Here's the trick:
                $select1.value = optionToSelect1.value;
                document.getElementById("dateEvent").value = doc.data().data.substring(6, 10) + "-" + doc.data().data.substring(3, 5) + "-" + doc.data().data.substring(0, 2);
            }
        });
    });
}


//Seleziono gli eventi da mostrare nella visualizzazione
function listEvent() {
    verifyUser();
    var db = firebase.firestore();
    var count = 0;
    /**  document.getElementById("div1").style.display = 'none';
    document.getElementById("div2").style.display = 'none';
    document.getElementById("div3").style.display = 'none';
    document.getElementById("div4").style.display = 'none';
    document.getElementById("div5").style.display = 'none';
    document.getElementById("div6").style.display = 'none';*/
   
    db.collection("eventi").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().titolo != "Evento di stock") {

                renderEventList(doc);
                count++;
            }
        });
        if (count == 0) {
            window.alert("Nessun evento presente nel DB!\r\nInserirne uno.");
            window.open("new-event.html", "_self");
        }
    });
}

//Riempio la lista con gli avvisi presenti nel db
function renderEventList(doc) {

    const beneficenza = document.querySelector('#event-list-beneficenza');
    const conferenza = document.querySelector('#event-list-conferenzaStampa');
    const convegno = document.querySelector('#event-list-convegno');
    const spettacolo = document.querySelector('#event-list-spettacolo');
    const sportivo = document.querySelector('#event-list-sportivo');
    const workshop = document.querySelector('#event-list-workshop');
    let btn1 = document.createElement('button');
    btn1.setAttribute('type', 'showbutton');
    btn1.textContent = "Dettagli";
    let btn2 = document.createElement('button');
    btn2.setAttribute('type', 'showbutton');
    btn2.textContent = "Modifica";
    let btn3 = document.createElement('button');
    btn3.setAttribute('type', 'showbutton');
    btn3.textContent = "Elimina";

    if (doc.data().categorie == "Beneficenza") {

        let li = document.createElement('li');
        li.textContent = doc.data().titolo + " - ";
        btn1.setAttribute('id', doc.id);
        btn1.setAttribute('onclick', 'buttonDetails(this)');
        btn2.setAttribute('id', doc.id);
        btn2.setAttribute('onclick', 'buttonModify(this)');
        btn3.setAttribute('id', doc.id);
        btn3.setAttribute('onclick', 'buttonDelete(this)');
        li.setAttribute('class', 'list-group-item');
        li.appendChild(btn1);
        li.appendChild(btn2);
        li.appendChild(btn3);
        beneficenza.appendChild(li);


    } else {
        if (doc.data().categorie == "Conferenza stampa") {

            let li = document.createElement('li');
            li.textContent = doc.data().titolo + " - ";
            btn1.setAttribute('id', doc.id);
            btn1.setAttribute('onclick', 'buttonDetails(this)');
            btn2.setAttribute('id', doc.id);
            btn2.setAttribute('onclick', 'buttonModify(this)');
            btn3.setAttribute('id', doc.id);
            btn3.setAttribute('onclick', 'buttonDelete(this)');
            li.setAttribute('class', 'list-group-item');
            li.appendChild(btn1);
            li.appendChild(btn2);
            li.appendChild(btn3);
            conferenza.appendChild(li);

        } else {
            if (doc.data().categorie == "Convegno") {

                let li = document.createElement('li');
                li.textContent = doc.data().titolo + " - ";
                btn1.setAttribute('id', doc.id);
                btn1.setAttribute('onclick', 'buttonDetails(this)');
                btn2.setAttribute('id', doc.id);
                btn2.setAttribute('onclick', 'buttonModify(this)');
                btn3.setAttribute('id', doc.id);
                btn3.setAttribute('onclick', 'buttonDelete(this)');
                li.setAttribute('class', 'list-group-item');
                li.appendChild(btn1);
                li.appendChild(btn2);
                li.appendChild(btn3);
                convegno.appendChild(li);


            } else {
                if (doc.data().categorie == "Spettacolo") {

                    let li = document.createElement('li');
                    li.textContent = doc.data().titolo + " - ";
                    btn1.setAttribute('id', doc.id);
                    btn1.setAttribute('onclick', 'buttonDetails(this)');
                    btn2.setAttribute('id', doc.id);
                    btn2.setAttribute('onclick', 'buttonModify(this)');
                    btn3.setAttribute('id', doc.id);
                    btn3.setAttribute('onclick', 'buttonDelete(this)');
                    li.setAttribute('class', 'list-group-item');
                    li.appendChild(btn1);
                    li.appendChild(btn2);
                    li.appendChild(btn3);
                    spettacolo.appendChild(li);

                } else {
                    if (doc.data().categorie == "Sportivo") {

                        let li = document.createElement('li');
                        li.textContent = doc.data().titolo + " - ";
                        btn1.setAttribute('id', doc.id);
                        btn1.setAttribute('onclick', 'buttonDetails(this)');
                        btn2.setAttribute('id', doc.id);
                        btn2.setAttribute('onclick', 'buttonModify(this)');
                        btn3.setAttribute('id', doc.id);
                        btn3.setAttribute('onclick', 'buttonDelete(this)');
                        li.setAttribute('class', 'list-group-item');
                        li.appendChild(btn1);
                        li.appendChild(btn2);
                        li.appendChild(btn3);
                        sportivo.appendChild(li);

                    } else {
                        if (doc.data().categorie == "Workshop") {

                            let li = document.createElement('li');
                            li.textContent = doc.data().titolo + " - ";
                            btn1.setAttribute('id', doc.id);
                            btn1.setAttribute('onclick', 'buttonDetails(this)');
                            btn2.setAttribute('id', doc.id);
                            btn2.setAttribute('onclick', 'buttonModify(this)');
                            btn3.setAttribute('id', doc.id);
                            btn3.setAttribute('onclick', 'buttonDelete(this)');
                            li.setAttribute('class', 'list-group-item');
                            li.appendChild(btn1);
                            li.appendChild(btn2);
                            li.appendChild(btn3);
                            workshop.appendChild(li);

                        }
                    }
                }
            }
        }
    }
}




function buttonDelete(bottone){

    var db = firebase.firestore();
    if (confirm("Sei sicuro di voler eliminare l'evento selezionato?") == true) {
        db.collection("eventi").get().then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                if (doc.id == bottone.getAttribute("id")) {
                    if (doc.data().photoURI == "ImmaginiStock/evento-spettacolo.jpg" || doc.data().photoURI == "ImmaginiStock/evento-convegno.jpg" || doc.data().photoURI == "ImmaginiStock/evento-workshop.jpg" || doc.data().photoURI == "ImmaginiStock/evento-beneficenza.jpg" || doc.data().photoURI == "ImmaginiStock/evento-sportivo.jpg" || doc.data().photoURI == "ImmaginiStock/evento-conferenzaStampa.jpg") {
                        db.collection("eventi").doc(doc.id).delete();
                        window.alert("Evento eliminato correttamente");
                    } else {
                        deletePhoto(doc.data().photoURI);
                        db.collection("eventi").doc(doc.id).delete();
                        window.alert("Evento eliminato correttamente");
                    }
                    timeout("show-events.html");
                }
            });
        });
    }
}

//Apro la pagina per modificare l'evento passando l'ID per trovarlo nelDB
function buttonModify(bottone) {
    localStorage.setItem("eventoID", bottone.getAttribute("id"));
    window.open("modify-event.html", "_self");

}


function buttonDetails(bottone){

    localStorage.setItem("eventoID", bottone.getAttribute("id"));
    window.open("event-details-admin.html", "_self");

}

var url;

//Creo la sezione portfolio con gli eventi presenti nel DB
function selectEvent() {

    var db = firebase.firestore();
    var storage = firebase.storage();
    const row = document.querySelector('#rowEvents');
    db.collection("eventi").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            if (doc.data().titolo != "Evento di stock") {

                var divColonna = document.createElement('div');
                var divItem = document.createElement('div');
                var imgEvent = document.createElement('img');
                var divInfo = document.createElement('div');
                var h3 = document.createElement('h3');
                var linkPage = document.createElement('a');
                var linkIcon = document.createElement('i');
                var divLink = document.createElement('i');
                if (doc.data().categorie == "Conferenza stampa") {
                    var classDivColonna = "col-lg-4 col-md-6 portfolio-wrap filter-ConferenzaStampa";
                } else {

                    var classDivColonna = "col-lg-4 col-md-6 portfolio-wrap filter-" + doc.data().categorie;
                }
                h3.textContent = doc.data().titolo;
                divItem.appendChild(imgEvent);
                divItem.appendChild(divInfo);
                divColonna.appendChild(divItem);
                divInfo.appendChild(h3);
                divItem.setAttribute("class", "portfolio-item");
                divColonna.setAttribute("class", classDivColonna);
                divInfo.setAttribute("class", "portfolio-info");
                imgEvent.setAttribute("class", "img-fluid");
                imgEvent.setAttribute("alt", "");
                linkPage.appendChild(linkIcon);
                divLink.appendChild(linkPage);
                divInfo.appendChild(divLink);
                linkIcon.setAttribute("class", "bx bx-link");
                linkPage.setAttribute("href", "event-details.html");
                linkPage.setAttribute("id", doc.id);
                linkPage.setAttribute("onclick", "stampaOK(this)");
                storage.ref().getDownloadURL();
                storage.ref(doc.data().photoURI).getDownloadURL()
                    .then((url) => {
                        imgEvent.setAttribute("src", url);
                    });
                row.appendChild(divColonna);
                row.removeAttribute("style");
            }

        });
    });
}


function stampaOK(oggetto) {

    localStorage.setItem("eventoID", oggetto.getAttribute("id"));

}


function detailsEvent() {

    const h3TitleEvent = document.querySelector('#titleEvent');
    const liCity = document.querySelector('#cityEvent');
    const liDate = document.querySelector('#dateEvent');
    const pDescription = document.querySelector('#descriptionEvent');
    const liPlace = document.querySelector('#placeEvent');
    const liTime = document.querySelector('#timeEvent');
    const liDuration = document.querySelector('#durationEvent');
    const liNumberSpot = document.querySelector('#numberSpotEvent');
    const liPrice = document.querySelector('#priceEvent');
    const linkEvent = document.querySelector('#linkEvent');
    const imageEvent = document.querySelector('#imageEvent');
    var db = firebase.firestore();
    var storage = firebase.storage();
    db.collection("eventi").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            if (doc.id == localStorage.getItem("eventoID")) {

                h3TitleEvent.textContent = doc.data().titolo;
                liCity.textContent = doc.data().città_evento;
                liDate.textContent = doc.data().data;
                liPlace.textContent = doc.data().luogo;
                liTime.textContent = doc.data().ora_inizio;
                liDuration.textContent = doc.data().ore + "h e " + doc.data().minuti + "m";
                liNumberSpot.textContent = doc.data().posti_disponibili;
                liPrice.textContent = doc.data().prezzo + "€";
                pDescription.textContent = doc.data().descrizione;
                linkEvent.textContent = doc.data().link;
                linkEvent.setAttribute("href", doc.data().link);
                storage.ref().getDownloadURL();
                storage.ref(doc.data().photoURI).getDownloadURL()
                    .then((url) => {
                        imageEvent.setAttribute("src", url);
                    });
            }

        });
    });

}



//Applico le modifiche apportate all'evento 
function updateEvent() {

    var evento = localStorage.getItem("eventoID");
    var db = firebase.firestore();
    if (document.getElementById('titleEvent').value == "" || document.getElementById('descriptionEvent').value == "" ||
        document.getElementById('locationEvent').value == "" || document.getElementById('cityEvent').value == "" ||
        document.getElementById('typeEvent').value == "" || document.getElementById('hourEvent').value == "" ||
        document.getElementById('dateEvent').value == "" || document.getElementById('hEvent').value == "" ||
        document.getElementById('mEvent').value == "" || document.getElementById('numberSpotEvent').value == "" ||
        document.getElementById('priceEvent').value == "" || document.getElementById('linkEvent').value == "") {
        window.alert("Compilare tutti i campi!");
    } else {
        db.collection("eventi").doc(evento).update({
                descrizione: document.getElementById('descriptionEvent').value,
                luogo: document.getElementById('locationEvent').value,
                posti_disponibili: parseInt(document.getElementById('numberSpotEvent').value),
                titolo: document.getElementById('titleEvent').value,
                link: document.getElementById('linkEvent').value,
                categorie: document.getElementById('typeEvent').value,
                prezzo: document.getElementById('priceEvent').value,
                ora_inizio: document.getElementById('hourEvent').value,
                ore: document.getElementById('hEvent').value,
                minuti: document.getElementById('mEvent').value,
                data: document.getElementById('dateEvent').value.substring(8, 10) + "/" + document.getElementById('dateEvent').value.substring(5, 7) + "/" + document.getElementById('dateEvent').value
                    .substring(0, 4),
                città_evento: document.getElementById('cityEvent').value
            })
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });

        window.alert("Evento modificato correttamente");
        timeout("show-events.html");
    }

}