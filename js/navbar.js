const navbar = document.querySelector('nav');
const list = navbar.querySelector('ul');
const selectedSection = navbar.querySelector('#selected-section');
const dots = ` 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="home-icon-dots">
        <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
    </svg>
`;

let navbarTimelines = {};
let isMenuDisplayed = false;
let selectedSectionInfo = {};

export default function initNavbar() {
    if (window.innerWidth < 770) initNavbarMobile()
    else initNavbarDesktop();
}

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)
    navbarTimelines = initNavbarTimelines();
});

function initNavbarTimelines() {
    return { mobile: getMobileTimeline() }
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
        .to(selectedSection, { width: selectedSectionInfo.width, duration: 0.2 })
        .add(() => { name.innerHTML = selectedSectionInfo.name })

    return tl;
}

function initNavbarMobile() {
    const navbarButton = navbar.querySelector('.navbar-home-icon');
    navbarButton.addEventListener('click', handleMenuDisplay);
}

function handleMenuDisplay() {
    console.log(navbarTimelines.mobile)
    if (!isMenuDisplayed) navbarTimelines.mobile.play();
    else navbarTimelines.mobile.reverse();

    isMenuDisplayed = !isMenuDisplayed;
}

function initNavbarDesktop() {
    list.addEventListener('mouseleave', showDots);
    const links = list.querySelectorAll('a');
    links.forEach(link => link.addEventListener('mouseenter', handleSectionNameDisplay))
}

function showDots() {
    const tl = gsap.timeline({ paused: true });
    const name = selectedSection.querySelector('p');

    tl
        .to(selectedSection, { width: 16, duration: 0.2 })
        .add(() => { name.innerHTML = dots })

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