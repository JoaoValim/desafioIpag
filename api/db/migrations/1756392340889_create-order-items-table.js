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
    CREATE TABLE order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER,
      product_name VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      unit_value NUMERIC(10, 2) NOT NULL,
      CONSTRAINT fk_order_items FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = pgm => {
  pgm.sql(`DROP TABLE order_items;`);
};
