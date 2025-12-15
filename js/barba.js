import initNavbar from "./navbar.js";
import initIndex from "./index.js";
import initConcerts from "./concerts.js";
import initProjects from "./projects.js";

const pageInits = {
    index: initIndex,
    concerts: initConcerts,
    projects: initProjects,
}

let lastPage = null;

export default function initBarba() {
    barba.init({
        views: [{
            namespace: null,
            beforeEnter({ next }) {
                const container = next.container
                const page = next.container.dataset.namespace;

                initUI(page, container);
            },
            afterEnter() {
                setCopyrightText();
            }
        }],
        transitions: [{
            name: 'page-transition',

            once() {
                const container = document.querySelector("[data-barba='container']");
                const page = container.dataset.namespace;
                initUI(page, container);
            },
            beforeEnter({ current }) {
                window.scrollTo(0, 0);
                current.container.style.position = 'absolute';
            },
            enter({ current }) {
                return gsap.to(current.container, {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power1.out'
                });
            },
        }]
    })
}

function initUI(page, container) {
    if (page === lastPage) return;
    lastPage = page;

    initNavbar(page);
    setCopyrightText();
    initPage(page, container);
}

function initPage(page, container) {
    if (pageInits[page]) pageInits[page](container);
}

function setCopyrightText() {
    const copyright = document.getElementById('footer-copyright');
    const year = new Date().getFullYear();
    copyright.innerHTML = `<p>© ${year} Sara El Hachimi.</p><p>All rights reserved.</p>`;
}
