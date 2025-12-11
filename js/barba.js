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
                const page = next.container.dataset.namespace;

                initUI(page, container)
            }
        }],
        transitions: [{
            name: 'page-transition',
            once() {
                const container = document.querySelector("[data-barba='container']");
                const page = container.dataset.namespace;
                initUI(page, container);

                endNavigation();
            },
            leave({ current }) {
                gsap.to(current.container, { autoAlpha: 0, duration: 0.5 });
            },
            enter({ next }) {
                gsap.from(next.container, { autoAlpha: 0, duration: 0.5 });
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