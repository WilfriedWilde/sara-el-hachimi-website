const sheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQz1m8omBD4zgIXJclpL7NyZwFJv-hWGCaxc1g8Bk6naACqaUqhF_rMKF5mDUOfv4r2hMlDNaaUzLih/pub?gid=722645748&single=true&output=csv';
const months = ['jan.', 'feb.', 'mar.', 'apr.', 'may', 'jun.', 'jul.', 'aug.', 'sep.', 'oct.', 'nov.', 'dec.'];
let upcomingConcertsData = [], pastConcertsData = [], upcomingConcertsList, pastConcertsList;

export default async function initConcerts(barbaContainer) {
    upcomingConcertsList = barbaContainer.querySelector('#upcoming-concerts-list');
    pastConcertsList = barbaContainer.querySelector('#past-concerts-list');

    upcomingConcertsList.innerHTML = '';
    pastConcertsList.innerHTML = '';
    upcomingConcertsData = [];
    pastConcertsData = [];

    const concertsData = await getConcertsData();
    populateConcertsLists(concertsData);

    if (concertsData.length > 0) {
        displayEmptyConcertsListMessage();
    }
}

async function getConcertsData() {
    const data = await fetchSheetsData(sheetsURL);
    if (!data || data.length === 0) {
        displayNoConcertsMessage();
        return;
    }

    return data;
}

export async function fetchSheetsData(url) {
    const CACHE_KEY = "concertsCache";
    const CACHE_TIME_KEY = "concertsCacheTime";
    const TEN_MINUTES = 3 * 60 * 1000;

    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIME_KEY);

    const isFresh = cached && timestamp && (Date.now() - timestamp) < TEN_MINUTES;

    if (isFresh) {
        return JSON.parse(cached);
    }

    try {
        const response = await fetch(url);
        const text = await response.text();
        const rows = text.split(/\r?\n/).map(row => row.split(","));
        const headers = rows[0];

        const data = rows.slice(1).map(row => {
            return Object.fromEntries(
                headers.map((header, i) => {
                    const cell = row[i];
                    return [header.toLowerCase().split(' ')[0], cell];
                })
            );
        });

        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, Date.now());

        return data;

    } catch (error) {
        console.log('Error fetching sheets data', error);
        return [];
    }
};

export function displayNoConcertsMessage() {
    const messageContainer = document.getElementById('no-concerts-message');
    messageContainer.style.display = 'block';
}

function populateConcertsLists(data) {
    if (!data) return;

    for (let i = 0; i < data.length; i++) {
        if (isConcertUpcoming(data, i)) upcomingConcertsData.push(data[i]);
        else pastConcertsData.push(data[i]);
    }

    upcomingConcertsData = getChronologicallySortedData(upcomingConcertsData);
    pastConcertsData = getChronologicallyReversedSortedData(pastConcertsData); console.log('upcoming', upcomingConcertsData, 'past', pastConcertsData)

    for (let i = 0; i < upcomingConcertsData.length; i++) {
        upcomingConcertsList.appendChild(buildConcertHTML(upcomingConcertsData, i));
    }

    for (let i = 0; i < pastConcertsData.length; i++) {
        pastConcertsList.appendChild(buildConcertHTML(pastConcertsData, i));
    }
}

function getChronologicallySortedData(data) {
    return [...data].sort((a, b) => parseDDMMYYYY(a.date) - parseDDMMYYYY(b.date));
}

function getChronologicallyReversedSortedData(data) {
    return [...data].sort((a, b) => parseDDMMYYYY(b.date) - parseDDMMYYYY(a.date));
}

function parseDDMMYYYY(dateStr) {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function isConcertUpcoming(data, index) {
    const concertDate = new Date(formatDate(data[index].date, 'us')).getTime();
    const now = Date.now();
    return concertDate > now;
};

function formatDate(date, format) {
    if (format === 'us') {
        return date.split('-')[0].length < 4 ? date.split('-').reverse().join('-') : date;
    }
    else if (format === 'eu') {
        return date.split('-')[0].length === 4 ? date.split('-').reverse().join('.') : date.split('-').join('.');
    }
}

function buildConcertHTML(data, index) {
    const { band, city, country, date, lineup, venue, venueurl } = data[index];
    const concertDate = getFormatedConcertDate(date);
    const concertLineUp = getFormatedConcertLineup(lineup);

    const concertTemplate = `
        <div class="concert-date">${concertDate}</div> 
        <div class="concert-band">
            <p class="concert-band-name">${band}</p>
            <div class="concert-lineup">${concertLineUp}</div>
        </div>
        <div class="concert-location">
            <p class="concert-venue">
                <a href="${venueurl}">${venue}</a>
            </p>
            <div class="concert-city-country-container">
                <p>${city}</p>
                <p>&mdash;</p>
                <p>${country}</p>
            </div> 
        </div>
    `;

    const concert = document.createElement('div');
    concert.classList.add('concert');
    concert.id = `concert-${index}`;
    concert.innerHTML = concertTemplate;

    return concert;
}

function getFormatedConcertDate(date) {
    let concertDate = {};
    const splitDate = date.split('-');
    concertDate.day = splitDate[0].trim();
    concertDate.month = getMonthName(splitDate[1].trim());
    concertDate.year = splitDate[2].trim();

    return getConcertDateHTML(concertDate);
}

export function getMonthName(monthNumber) {
    return months[parseInt(monthNumber) - 1];
}

function getConcertDateHTML(concertDate) {
    const { day, month, year } = concertDate;
    return `
        <p class="concert-month">${month}</p>
        <p class="concert-day">${parseInt(day)}<span class="concert-day-suffix">${getDateSuffix(day)}</span></p>
        <p class="concert-year">${year}</p>
    `;
}

function getDateSuffix(day) {
    const splitDay = day.split('');
    if (splitDay[0] === '1') return 'th';

    if (splitDay[1] === '1') return 'st';
    else if (splitDay[1] === '2') return 'nd';
    else if (splitDay[1] === '3') return 'rd';
    else return 'th';
}

function getFormatedConcertLineup(lineup) {
    if (!lineup) return '';

    const splitLineup = lineup.split('|');
    let lineupHTML = '';

    for (const feature of splitLineup) {
        lineupHTML += `<p class="concert-musician">${feature.trim()}</p>`;
    }
    return lineupHTML;
}

function displayEmptyConcertsListMessage() {
    [upcomingConcertsList, pastConcertsList].forEach(list => {
        if (list.children.length < 2) list.innerHTML = getEmptyConcertsListMessage(list);
    })
    return;
}

function getEmptyConcertsListMessage(list) {
    const listName = list.id.split('-')[0];
    const messages = {
        upcoming: 'No concerts scheduled :)',
        past: 'No previous concerts :)'
    }

    return `<p class="concerts-list-empty-message">${messages[listName]}</p>`
}