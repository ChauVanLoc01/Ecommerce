use microservice;

create table District (name nvarchar(100) not null primary key);

create table City (name nvarchar(100) not null primary key);

create table `Rank` (
    id varchar(50) not null primary key,
    point int,
    type int not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null
);

create table Store (
    id varchar(50) not null primary key,
    name nvarchar(255) not null,
    image varchar(255) not null,
    position nvarchar(100) not null,
    description nvarchar(1000) not null,
    createdBy varchar(50) not null,
    updatedBy varchar(50),
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    foreign key (position) references City(name)
);

create table User (
    id varchar(50) not null primary key,
    roleId varchar(10) not null,
    code varchar(20) not null,
    name nvarchar(255) not null,
    email varchar(255) not null,
    birthday timestamp null,
    status int not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    deletedAt timestamp null,
    rankId varchar(50) not null,
    foreign key (rankId) references `Rank`(id)
);

create table Account (
    id varchar(50) not null primary key,
    user_name varchar(100) not null,
    password varchar(255) not null,
    status int not null,
    userId varchar(50) null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp,
    foreign key (userId) references User(id)
);

-- Bảng StoreRole dùng để chia quyền cho user
-- thuộc tính storeRole dùng để chia quyền cho user của store 
-- 1: Admin
-- 2: Moderator
create table StoreRole (
    accountId varchar(50) not null,
    storeId varchar(50) not null,
    storeRole int not null foreign key (storeId) references Store(id),
    foreign key (accountId) references Account(id)
);

create table Address (
    id varchar(50) not null primary key,
    userId varchar(50) not null,
    detailt nvarchar(1000) not null,
    district nvarchar(100) not null,
    city nvarchar(100) not null,
    isPrimary boolean default false,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    foreign key (district) references District(name),
    foreign key (city) references City(name),
    foreign key (userId) references User(id)
);

create table Product (
    product_id varchar(50) not null primary key,
    code varchar(50) not null,
    name nvarchar(100) not null,
    priceBefore float not null,
    priceAfter float not null,
    initQuantity int not null,
    currentQuantity int not null,
    description text not null,
    status int not null,
    createdBy varchar(50) not null,
    updatedBy varchar(50) null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    foreign key (createdBy) references Account(id),
    FOREIGN KEY (updatedBy) REFERENCES Account(id),
);

CREATE TABLE Category (
    category_shortname VARCHAR(50) NOT NULL primary key,
    code varchar(20) not null,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    foreign key (createdBy) references Account(id),
    FOREIGN KEY (updatedBy) REFERENCES Account(id),
);

Create table ProductCategory(
    FOREIGN KEY (product_id) REFERENCES Product(product_id),
    FOREIGN KEY (category_id) REFERENCES category(category_shortname),
    created_by
    modified_by 
    Foreign key (createdBy) references Account(id),
    FOREIGN KEY (updatedBy) REFERENCES Account(id)

);

create table ProductImage (
    id varchar(50) not null primary key,
    url nvarchar(255) not null,
    status int not null,
    createdBy varchar(50) not null,
    updatedBy varchar(50) null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    productId varchar(50) not null,
    foreign key (productId) references Product(id)
);

create table Order (
    id varchar(50) not null primary key,
    userId varchar(50) not null,
    address varchar(50) not null,
    total float not null,
    status int not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    foreign key (address) references Address(id),
    foreign key (userId) references User(id)
);

create table ProductOrder (
    id varchar(50) not null primary key,
    productId varchar(50) not null,
    quantity int not null,
    priceBefore float not null,
    priceAfter float not null,
    orderId varchar(50) not null,
    note nvarchar(255) null,
    foreign key (orderId) references `Order`(id),
    foreign key (productId) references Product(id)
);

create table Voucher (
    id varchar(50) not null primary key,
    name nvarchar(255) not null,
    description nvarchar(100) not null,
    quantity int null,
    status int not null,
    type int not null,
    isDeleted boolean default false,
    startDate timestamp not null,
    endDate timestamp not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

);

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id varchar(50) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (role_id) REFERENCES roles (id)
);
