const personCredits = {
    dylan: {
        name: 'dylan james moore',
        link: 'https://www.instagram.com/thingsbydylan/'
    },
    reto: {
        name: 'reto andreoli',
        link: 'https://retoandreoli.ch/'
    },
    helena: {
        name: 'helena bella avila',
        link: 'https://www.instagram.com/helenatambien/'
    },
    alexandr: {
        name: 'alexandr prikhodko',
        link: 'https://www.instagram.com/pluqsa/'
    }
}

const pageCredits = {
    index: personCredits.dylan,
    about: personCredits.dylan,
    concerts: personCredits.dylan,
    projects: personCredits.dylan,
    contact: personCredits.helena
}

export default function initFooter(page, container) {
    if (page === 'medias') hideFooterCredits()
    else initFooterCredits(page);

    setCopyrightText();
    setPhotoCredits(container);
}

function hideFooterCredits() {
    const footerCredits = document.querySelector('.credit-photo');
    footerCredits.parentNode.style.display = 'none';
}

function initFooterCredits(page) {
    const footerCredits = document.querySelector('.credit-photo');
    footerCredits.parentNode.style.display = 'inline';
    footerCredits.href = pageCredits[page].link;
    footerCredits.textContent = pageCredits[page].name;
}

function setCopyrightText() {
    const copyright = document.getElementById('footer-copyright');
    const year = new Date().getFullYear();
    copyright.innerHTML = `<p>© ${year} Sara El Hachimi.</p><p>All rights reserved.</p>`;
}

export function setPhotoCredits(container) {
    const images = container.querySelectorAll('[data-credits]');
    if (!images.length) return;

    images.forEach(image => appendCredits(image));
}

function appendCredits(image) {
    const figure = document.createElement('figure');
    const caption = document.createElement('figcaption');
    const link = document.createElement('a');
    
    link.innerText = `© ${personCredits[image.dataset.credits].name}`;
    link.href = personCredits[image.dataset.credits].link;
    
    caption.appendChild(link);
    
    image.parentNode.insertBefore(figure, image);
    figure.appendChild(image);
    figure.appendChild(caption);
}
