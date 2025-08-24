create table customers (
    id serial primary key,
    name varchar(255) not null,
    document varchar(20) not null unique,
    email varchar(255) not null unique,
    phone varchar(20),
    created_at timestamp default current_timestamp
);

create table orders (
    id serial primary key,
    customer_id integer,
    order_number varchar(50) not null unique,
    total_value numeric(10, 2) not null,
    status varchar(20) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp

    constraint fk_orders foreign key (customer_id) references customers(id)
);

create table order_items (
    id serial primary key,
    order_id integer,
    product_name varchar(255) not null,
    quantity integer not null,
    unit_value numeric(10, 2) not null

    constraint fk_order_items foreign key (order_id) references orders(id)
);

create table notification_logs(
    id serial primary key,
    order_id integer references orders(id),
    old_status varchar(20) not null,
    new_status varchar(20) not null,
    message text not null,
    created_at timestamp default current_timestamp
);


customers: id, name, document, email, phone, created_at
orders: id, customer_id, order_number, total_value, status, created_at, updated_at
order_items: id, order_id, product_name, quantity, unit_value
notification_logs: id, order_id, old_status, new_status, message, created_at