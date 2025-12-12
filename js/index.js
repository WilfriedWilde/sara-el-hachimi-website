import { fetchSheetsData } from "./concerts.js";

const sheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQz1m8omBD4zgIXJclpL7NyZwFJv-hWGCaxc1g8Bk6naACqaUqhF_rMKF5mDUOfv4r2hMlDNaaUzLih/pub?gid=722645748&single=true&output=csv';

export default async function initIndex() {
    fetchSheetsData(sheetsURL);
}