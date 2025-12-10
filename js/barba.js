import initNavbar from "./navbar.js";
import initAbout from "./about.js";
import initConcerts from "./concerts.js";
import initProjects from "./projects.js";
import initMedias from "./medias.js";
import initContact from "./contact.js";

const pageInits = {
    about: initAbout,
    concerts: initConcerts,
    projects: initProjects,
    medias: initMedias,
    contact: initContact
}

let lastPage = null;

export default function initBarba() {
    barba.init({
        views: [{
            namespace: null,
            beforeEnter({ next }) {
                const container = next.container.querySelector("[data-barba='container']");
                const page = next.container.dataset.namespace;console.log('next page:', page)
                initUI(page, container)
            }
        }],
        transitions: [{
            name: 'page-transition',
            once() {
                const container = document.querySelector("[data-barba='container']");
                const page = container.dataset.namespace;
                initUI(page, container);
            },
        }]
    })
}

function initUI(page, container) {
    if (page === lastPage) return;
    lastPage = page;

    initNavbar(page);
    initPage(page, container);
}

function initPage(page, container) {
    if (pageInits[page]) pageInits[page](container);
}