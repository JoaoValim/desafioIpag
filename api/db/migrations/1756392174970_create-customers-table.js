/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

export const up = pgm => {
  pgm.sql(`
    CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      document VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

export const down = pgm => {
  pgm.sql(`DROP TABLE customers;`);
};
