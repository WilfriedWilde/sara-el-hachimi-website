gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

const navbar = document.querySelector('nav');
const list = navbar.querySelector('ul');
const selectedSection = navbar.querySelector('#selected-section');
const navbarButton = selectedSection.querySelector('p');

const dots = ` 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="home-icon-dots">
        <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
    </svg>
`;
const colorNames = ['white', 'white-transparent', 'black', 'gray'];
const colors = getComputedColors();

function getComputedColors() {
    return Object.fromEntries(colorNames.map((name => {
        return [name, getColor(name)];
    })))
};

function getColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
}

let selectedPage;
let navbarTimelines = {}, selectedSectionInfo = {};
let isMenuDisplayed = false, isMobile = false, isNavbarHidden = false;
let lastY = 0;

function initNavbarTimelines() {
    return {
        mobile: getMobileTimeline(),
        transitionNavbarHome,
        transitionNavbarNotHome
    }
}

////////// STARTS HERE ///////////

export default function initNavbar(page) {
    selectedPage = page; console.log('init:', selectedPage)
    navbarTimelines = initNavbarTimelines();

    if (selectedPage === 'index') navbarTimelines.transitionNavbarHome();
    else navbarTimelines.transitionNavbarNotHome();

    isMobile = window.innerWidth < 770 ? true : false;

    if (isMobile) closeMenu();

    if (isMobile) initNavbarMobile()
    else initNavbarDesktop();

    updateSectionsList();
}

function closeMenu() {
    isMenuDisplayed = false;

    const sectionsContainer = navbar.querySelector('#navbar-sections-container');
    const line = navbar.querySelector('.line-vertical');
    const options = list.querySelectorAll('a');

    gsap.to(line, { height: 0, duration: 0.2 });
    gsap.to(sectionsContainer, { height: 0, duration: 0.15 });
    gsap.to(options, { opacity: 0, duration: 0 });
}

function transitionNavbarHome() {
    navbarButton.innerHTML = dots;
    navbarButton.style.color = colors.white;

    const links = navbar.querySelectorAll('a');
    const lines = navbar.querySelectorAll('[class*="line"]');
    const svgDots = navbar.querySelector('.home-icon-dots');
    const sectionsContainer = navbar.querySelector('#navbar-sections-container');

    const initHomeTimeline = gsap.timeline();

    initHomeTimeline
        .to(sectionsContainer, { backgroundColor: 'transparent', duration: 0 })
        .to(navbar, { backgroundColor: 'transparent', duration: 0 })
        .to(svgDots, { fill: colors.white, duration: 0.1 })
        .to(lines, { backgroundColor: colors.white, duration: 0.1 })
        .add(() => {
            const tl = gsap.timeline();

            links.forEach((link, i) => {
                const split = SplitText.create(link, { type: "chars" });

                tl.to(split.chars, {
                    color: colors.white,
                    stagger: { amount: 0.1 },
                }, i * 0.15);
            });
        })

    return initHomeTimeline;
}

function transitionNavbarNotHome() {
    navbarButton.innerHTML = selectedPage;

    const links = navbar.querySelectorAll('a');
    const lines = navbar.querySelectorAll('[class*="line"]');
    const sectionsContainer = navbar.querySelector('#navbar-sections-container');

    const initNotHomeTimeline = gsap.timeline();

    initNotHomeTimeline
        .to(sectionsContainer, { backgroundColor: colors.white, duration: 0 })
        .to(navbar, { backgroundColor: colors.white, duration: 0 })
        .to(navbarButton, { color: colors.black, duration: 0.1 })
        .to(lines, { backgroundColor: colors.black, duration: 0.1 })
        .add(() => {
            const tl = gsap.timeline();

            links.forEach((link, i) => {
                const split = SplitText.create(link, { type: "chars" });

                tl.to(split.chars, {
                    color: colors.black,
                    stagger: { amount: 0.1 },
                }, i * 0.15);
            });
        })

    return initNotHomeTimeline;
}

function initNavbarMobile() {
    const navbarButton = selectedSection.querySelector('p');
    navbarButton.addEventListener('click', handleMenuDisplay);
}

function handleMenuDisplay() {
    if (!isMenuDisplayed) navbarTimelines.mobile.play();
    else navbarTimelines.mobile.reverse();
    isMenuDisplayed = !isMenuDisplayed;
}

function getMobileTimeline() {
    const options = Array.from(list.querySelectorAll('a'));
    const sectionsContainer = navbar.querySelector('#navbar-sections-container');
    const line = navbar.querySelector('.line-vertical');

    const tl = gsap.timeline({ paused: true });

    tl.to(line, {
        height: 160,
        duration: 0.1
    })
        .to(sectionsContainer, {
            height: 170,
            duration: 0.2
        }, '>0.05')

        .to(options, {
            stagger: { amount: 0.2 },
            opacity: 1
        }, '>0.05')


    return tl;
}

function getDesktopTimeline() {
    const tl = gsap.timeline({ paused: true });
    const name = selectedSection.querySelector('p');

    tl
        .to(selectedSection, { width: selectedSectionInfo.width, duration: 0.15 })
        .to(name, {
            yPercent: -25,
            duration: 0.15,
            opacity: 0
        }, 0)
        .add(() => {
            name.innerHTML = selectedSectionInfo.name;

            gsap.fromTo(name, {
                yPercent: 25,
                opacity: 0,

            }, {
                yPercent: 0,
                opacity: 1,
                duration: 0.15,
            })
        })

    return tl;
}

function initNavbarDesktop() {
    document.addEventListener('scroll', handleNavbarDisplayOnScroll);
    list.addEventListener('mouseleave', showSelectedSection);
    const links = list.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('mouseenter', handleSectionNameDisplay);
    })
}

function handleNavbarDisplayOnScroll() {
    if (window.scrollY > lastY) hideNavbar();
    else showNavbar();

    lastY = window.scrollY;
}

function hideNavbar() {
    if (isNavbarHidden) return;
    isNavbarHidden = true;
    gsap.to(navbar, { yPercent: -100, duration: 0.4 })
}

function showNavbar() {
    if (!isNavbarHidden) return;
    isNavbarHidden = false;
    gsap.to(navbar, { yPercent: 0, opacity: 1, duration: 0.5 })
}

function showSelectedSection() {
    const tl = gsap.timeline({ paused: true });
    const name = selectedSection.querySelector('p');
    const selectedSectionInnerHTML = selectedPage === 'index' ? dots : selectedPage;

    tl
        .to(selectedSection, { width: 16, duration: 0.2 })
        .add(() => { name.innerHTML = selectedSectionInnerHTML })

    tl.restart();
}

function handleSectionNameDisplay(event) {
    selectedSectionInfo = getSelectedSectionInfo(event);
    navbarTimelines.desktop = getDesktopTimeline();
    navbarTimelines.desktop.restart();
}

function getSelectedSectionInfo(event) {
    return {
        name: event.currentTarget.innerText,
        width: event.currentTarget.getBoundingClientRect().width
    }
}

function updateSectionsList() {
    const links = navbar.querySelectorAll('a');
    for (const link of links) {
        if (link.innerText === selectedPage) {
            link.parentNode.style.display = 'none';
        } else {
            link.parentNode.style.display = 'inline';
        }
    }
}