function loadCity() {
    verifyUser();
    var db = firebase.firestore();
    db.collection("comuni").get().then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
            renderCity(doc);

        });

    });
    db.collection("categoriaEventi").get().then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
            renderCategory(doc);

        });

    });

}

//Riempio il dropdown con i comuni presenti nel db
function renderCity(doc) {

    const cityList = document.querySelector('#cityEvent');
    let option = document.createElement('option');
    option.setAttribute('id-city', doc.id);
    option.textContent = doc.data().nome;
    cityList.appendChild(option);

}

//Riempio il dropdown con le categorie presenti nel db
function renderCategory(doc) {

    const categoryList = document.querySelector('#typeEvent');
    let option = document.createElement('option');
    option.setAttribute('id-city', doc.id);
    option.textContent = doc.data().nome;
    categoryList.appendChild(option);

}



function categoryAnnouncement() {

    verifyUser();
    var db = firebase.firestore();
    db.collection("categoriaAvvisi").get().then((querySnapshot) => {

        querySnapshot.forEach((doc) => {

            renderCategoryAnnouncement(doc);

        });

    });

}

function renderCategoryAnnouncement(doc) {

    const categoryList = document.querySelector('#typeAnnouncement');
    let option = document.createElement('option');
    option.setAttribute('id-city', doc.id);
    option.textContent = doc.data().nome;
    categoryList.appendChild(option);

}