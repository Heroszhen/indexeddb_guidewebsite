function openDB() {
    let db = null;
    let openrequest = window.indexedDB.open("guide", 1);
    return new Promise((resolve, reject) => {
        openrequest.onupgradeneeded = function () {
            db = openrequest.result;
            if (!db.objectStoreNames.contains("link")) {
                db.createObjectStore("link", { keyPath: 'id', autoIncrement: true })
                    .createIndex('id', 'id', { unique: true });
            }
            if (!db.objectStoreNames.contains("user")) {
                let objectStore = db.createObjectStore("user", { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('id', 'id', { unique: true });
                objectStore.createIndex('email', 'email', { unique: true });
            }
            if (!db.objectStoreNames.contains("category")) {
                db.createObjectStore("category", { keyPath: 'id', autoIncrement: true })
                    .createIndex('id', 'id', { unique: true });
            }
            if (!db.objectStoreNames.contains("website")) {
                db.createObjectStore("website", { keyPath: 'id', autoIncrement: true })
                    .createIndex('id', 'id', { unique: true });
            }
            resolve(db);
        }
        openrequest.onsuccess = function () {
            db = openrequest.result;
            resolve(db);
        }
    });
}

function getAll(db, table) {
    return new Promise((resolve, reject) => {
        let objectStore = db.transaction(table).objectStore(table);
        let tab = [];
        objectStore.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                tab.push(JSON.parse(JSON.stringify(cursor.value)));
                cursor.continue();
            } else {
                resolve(tab);
            }
        }
    });
}

function getById(db, table, id) {
    return new Promise((resolve, reject) => {
        let request = db.transaction([table], "readonly")
            .objectStore(table)
            .index("id")
            .get(id);
        request.onsuccess = (e) => {
            resolve(request.result);
        }
    });
}

/**
 * @param {*} db 
 * @param {string} table 
 * @param {object} data 
 * @returns id
 */
function add(db, table, data) {
    return new Promise((resolve, reject) => {
        let request = db.transaction([table], 'readwrite')
            .objectStore(table)
            .add(data);
        request.onsuccess = (e) => {
            resolve(request.result);
        }
    });
}

function put(db, table, data) {

}

function deleteById(db, table, id) {
    let transaction = db.transaction([table], 'readwrite')
        .objectStore(table)
        .delete(parseInt(id));
}


//init
async function delDB() {
    return new Promise((resolve, reject) => {
        const DBDeleteRequest = window.indexedDB.deleteDatabase("guide");
        DBDeleteRequest.onerror = (event) => {
            resolve(event);
        };

        DBDeleteRequest.onsuccess = (event) => {
            resolve(event);
        };
    });
}
async function init(db) {
    //add user
    add(db, "user", { name: "hero", email: "hero@gmail.com", bgimage: "" });

    //add links
    await add(db, "link", { title: "google", url: "https://www.google.fr/", order: 0 });
    await add(db, "link", { title: "youtube", url: "https://www.youtube.com/", order: 1 });

    let categories = ["film", "informatique", "mangas", "sport", "art martial"];
    for (let entry of categories) add(db, "category", { title: entry })

    let sites = getWebsites();
    for (let entry of sites) add(db, "website", entry);
}



function getWebsites() {
    return [
        { title: "Netflix", categoryid: 1, url: "https://www.netflix.com/fr-en/", photo: "https://play-lh.googleusercontent.com/384jx3OL4_tqtCGZrfIB6Q5TehM0Q7TLYFsenRPfeT8f-3vicWH2BYbvaEAneaPFMMM" },
        { title: "Movies2Watch", categoryid: 1, url: "https://movies2watch.ru/movies", photo: "https://s1.bunnycdn.ru/assets/sites/movies2watch/logo.png" },
        { title: "vimeo", categoryid: 1, url: "https://vimeo.com/watch", photo: "https://www.numerama.com/wp-content/uploads/2021/09/vimeo.jpg" },
        { title: "French Stream", categoryid: 1, url: "https://frenchstream.tube/complet-gratuit/", photo: "https://frenchstream.tube/templates/frenchstream/images/logo.png" },
        { title: "Film Streaming", categoryid: 1, url: "https://www.filmstreaming.al/", photo: "https://www.filmstreaming.al/templates/filmstreaming/images/logo.jpg" },
        { title: "Film VF", categoryid: 1, url: "https://filmvf-streaming.net/", photo: "https://d1fdloi71mui9q.cloudfront.net/JPC1BLkQh2FCZDALFGJG_zTk78UiSi756kdZ7" },
        { title: "Design Patterns in PHP", categoryid: 2, url: "https://refactoring.guru/design-patterns/php", photo: "https://refactoring.guru/images/content-public/logos/logo-plain.png" },
        { title: "Symfony", categoryid: 2, url: "https://symfony.com/", photo: "https://www.a5sys.com/wp-content/uploads/2021/10/symfony_logo_vertical.png" },
        { title: "SvelteKit", categoryid: 2, url: "https://kit.svelte.dev/", photo: "https://res.cloudinary.com/practicaldev/image/fetch/s--JqiGMO_w--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p3nn57r52krvpdieblta.png" },
        { title: "L'Attaque des Titans", categoryid: 3, url: "https://www.maofly.com/manga/15325.html", photo: "https://chocobonplan.com/wp-content/uploads/2016/12/avis-attaque-des-titans.png" },
    ];
}