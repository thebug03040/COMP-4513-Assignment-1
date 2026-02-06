// Goal of File: Export function that allows for SQL queries to run

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDB() {
    return open({
        filename: './data/songs-2026.db',
        driver: sqlite3.Database
    });
    test
}

