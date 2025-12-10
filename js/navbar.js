gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

const navbar = document.querySelector('nav');
const list = navbar.querySelector('ul');
const selectedSection = navbar.querySelector('#selected-section');
const navbarButton = selectedSection.querySelector('p');
let selectedPage;

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

let navbarTimelines = {};
let isMenuDisplayed = false;
let selectedSectionInfo = {};

navbarTimelines = initNavbarTimelines();

function initNavbarTimelines() {
    return {
        mobile: getMobileTimeline(),
        transitionNavbarHome,
        transitionNavbarNotHome
    }
}






////////// STARTS HERE ///////////

export default function initNavbar(page) {
    selectedPage = page;
    if (selectedPage === 'index') navbarTimelines.transitionNavbarHome();
    else navbarTimelines.transitionNavbarNotHome();
    if (window.innerWidth < 770) initNavbarMobile()
    else initNavbarDesktop();
}

function transitionNavbarHome() {
    navbarButton.innerHTML = dots;
    navbarButton.style.color = colors.white;

    const links = navbar.querySelectorAll('a');
    const lines = navbar.querySelectorAll('[class*="line"]');
    const svgDots = navbar.querySelector('.home-icon-dots');

    const initHomeTimeline = gsap.timeline();

    initHomeTimeline
        .add(() => navbarTimelines.mobile.reverse())
        .to(navbar, { backgroundColor: 'transparent', duration: 0 })
        .to(svgDots, { fill: colors.white, duration: 0.1 })
        .to(lines, { backgroundColor: colors.white, duration: 0.1 })
        .to(links, { color: colors.white, duration: 0.1 })

    isMenuDisplayed = false;

    return initHomeTimeline;
}

function transitionNavbarNotHome() {
    handleMenuDisplay()
    navbarButton.innerHTML = selectedPage;

    const links = navbar.querySelectorAll('a');
    const lines = navbar.querySelectorAll('[class*="line"]');
    const initNotHomeTimeline = gsap.timeline();

    initNotHomeTimeline
        .add(() => navbarTimelines.mobile.reverse())
        .to(navbar, { backgroundColor: colors.white, duration: 0 })
        .to(navbarButton, { color: colors.black, duration: 0.1 })
        .to(lines, { backgroundColor: colors.black, duration: 0.1 })
        .to(links, { color: colors.black, duration: 0.1 })

    isMenuDisplayed = false;

    return initNotHomeTimeline;
}

function initNavbarMobile() {
    console.log('handle display')
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
    const listHeight = list.getBoundingClientRect().height;
    const line = navbar.querySelector('.line-vertical');

    const tl = gsap.timeline({ paused: true });
    tl.to(line, {
        height: listHeight + 'px',
        duration: 0.2
    })
        .to(options, {
            stagger: { amount: 0.2 },
            opacity: 1
        }, 0)

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
    list.addEventListener('mouseleave', showSelectedSection);
    const links = list.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('mouseenter', handleSectionNameDisplay);
    })
}

function showSelectedSection() {
    const tl = gsap.timeline({ paused: true });
    const name = selectedSection.querySelector('p');
    const selectedSectionInnerHTML = selectedPage === 'index' ? dots : selectedPage;

    tl
        .to(selectedSection, { width: 16, duration: 0.2 })
        .to(name, { opacity: 0, duration: 0.2 }, 0.05)
        .add(() => { name.innerHTML = selectedSectionInnerHTML })
        .to(name, { yPercent: 0, opacity: 1, duration: 0 }, '>0.1')
        .from(name, { xPercent: 100, opacity: 0, duration: 0.3 });

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