const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123',
    database: 'postgres'
});

async function setup() {
    const client = await pool.connect();
    try {
        await client.query(`CREATE DATABASE SparkyDB`);
        console.log(' Database SparkyDB created');
    } catch (err) {
        if (err.code === '42P04') {
            console.log('ℹ Database SparkyDB already exists');
        } else {
            console.error(' Database error:', err.message);
        }
    } finally {
        client.release();
    }

    const sparkyPool = new Pool({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '123',
        database: 'SparkyDB'
    });

    const sparkyClient = await sparkyPool.connect();
    try {
        await sparkyClient.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                cart_products JSONB DEFAULT '[]'::jsonb
            );
        `);
        console.log(' Table users created');
        const result = await sparkyClient.query(`\dt`);
        console.log(' Tables:', result.rows.map(r => r.Tablename));
    } catch (err) {
        console.error(' Table error:', err.message);
    } finally {
        sparkyClient.release();
        await sparkyPool.end();
        await pool.end();
    }
}

setup();
