const svgHTML = {
    more: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M480-120 300-300l58-58 122 122 122-122 58 58-180 180ZM358-598l-58-58 180-180 180 180-58 58-122-122-122 122Z" />
        </svg>
        `,
    less: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="m356-160-56-56 180-180 180 180-56 56-124-124-124 124Zm124-404L300-744l56-56 124 124 124-124 56 56-180 180Z" />
        </svg>
    `
}

let projectHeaders = [];

export default function initProjects(barbaContainer) {
    projectHeaders = Array.from(barbaContainer.querySelectorAll('.project-header'));

    attachEventListeners();
}

function attachEventListeners() {
    projectHeaders.forEach(header => header.addEventListener('click', handleDisplayProject));
}

function handleDisplayProject(event) {
    const header = event.currentTarget;
    const content = header.parentNode.querySelector('.project-content');

    if (!content.classList.contains('project-selected')) handleShowProject(header, content);
    else handleHideProject(header, content);
}

function handleShowProject(header, content) {
    const button = header.querySelector('.project-button');
    button.innerHTML = svgHTML.less;

    content.classList.add('project-selected');

    content.style.height = 'auto';
    const targetHeight = content.getBoundingClientRect().height;
    content.style.height = '0px';

    const project = content.parentNode;
    const circle = header.querySelector('.icon-circle');
    const title = header.querySelector('.project-title');
    const lines = project.querySelectorAll('.project-line-horizontal');
    const icon = button.querySelector('svg');

    gsap.timeline()
        .to(title, { color: 'var(--color-black)', duration: 1 })
        .to(circle, { fill: 'var(--color-black)', duration: 1 }, 0)
        .to(project, { backgroundColor: 'var(--color-white)', duration: 0.5 }, 0)
        .to(lines, { backgroundColor: 'var(--color-black)', duration: 1 }, 0)
        .to(content, { opacity: 1, duration: 0.1 }, 0)
        .to(icon, { fill: 'var(--color-black)', duration: 1 }, 0)
        .to(content, {
            height: targetHeight,
            duration: 1,
            ease: 'power3.in'
        }, 0);
}

function handleHideProject(header, content) {
    const button = header.querySelector('.project-button');
    button.innerHTML = svgHTML.more;

    content.classList.remove('project-selected')

    const project = content.parentNode;
    const circle = header.querySelector('.icon-circle');
    const title = header.querySelector('.project-title');
    const lines = project.querySelectorAll('.project-line-horizontal');
    const icon = button.querySelector('svg');

    const hideTimeline = gsap.timeline();
    hideTimeline
        .to(title, { color: 'var(--color-white)', duration: 1 })
        .to(circle, { fill: 'var(--color-white)', duration: 1 }, 0)
        .to(project, { backgroundColor: 'transparent', duration: 0.8 }, 0)
        .to(content, { opacity: 0, duration: 1 }, 0)
        .to(lines, { backgroundColor: 'var(--color-white)', duration: 1 }, 0)
        .to(icon, { fill: 'var(--color-white)', duration: 1 }, 0)
        .to(content, {
            height: 0,
            duration: 1.2,
            ease: 'power3.out'
        }, 0)
}