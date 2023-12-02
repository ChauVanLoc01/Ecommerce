create database microservice;

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
    location nvarchar(100) not null,
    description nvarchar(1000) not null,
    status int not null,
    createdBy varchar(50) not null,
    updatedBy varchar(50) null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    foreign key (location) references City(name)
);

create table User (
    id varchar(50) not null primary key,
    full_name nvarchar(100) not null,
    birthday timestamp null,
    email varchar(255) not null,
    rankId varchar(50) null,
    role int not null,
    status int not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    foreign key (rankId) references `Rank`(id)
);

create table StoreRole (
    id varchar(50) not null primary key,
    storeId varchar(50) not null,
    status int not null,
    role int not null,
    createdBy varchar(50) not null,
    updatedBy varchar(50) null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    foreign key (storeId) references Store(id),
    foreign key (createdBy) references User(id),
    foreign key (updatedBy) references User(id)
);

create table Account (
    username varchar(100) not null primary key,
    password varchar(255) not null,
    userId varchar(50) not null,
    storeRoleId varchar(50) null,
    createdBy varchar(50) null,
    updatedBy varchar(50) null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    foreign key (userId) references User(id),
    foreign key (createdBy) references User(id),
    foreign key (updatedBy) references User(id),
    foreign key (storeRoleId) references StoreRole(id)
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


/* ----------------------------------------------------------------------- */
/* MỚI UPDATE TỚI ĐÂY THÔI - BÊN DƯỚI CHƯA CÓ UPDATE NHA */
/* ----------------------------------------------------------------------- */


create table Product (
    id varchar(50) not null primary key,
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
    storeId varchar(50) not null,
    foreign key (createdBy) references User(id),
    foreign key (updatedBy) references User(id),
    foreign key (storeId) references Store(id)
);

CREATE TABLE Category (
    shortname varchar(50) not null primary key,
    name nvarchar(255) NOT NULL,
    description TEXT
);

Create table ProductCategory(
	product_id varchar(50) not null,
    category_id varchar(50) not null,
    createdBy varchar(50) not null,
    updatedBy varchar(50) not null,
    foreign key (product_id) references Product(id),
    foreign key (category_id) references Category(shortname),
    foreign key (createdBy) references User(id),
    foreign key (updatedBy) references User(id)
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

create table Voucher (
    id varchar(50) not null primary key,
    code int not null,
    name nvarchar(255) not null,
    description text not null,
    initQuantity int not null,
    currentQuantity int not null,
    status int not null,
    type int not null,
    storeId varchar(50) not null,
    startDate timestamp not null,
    endDate timestamp not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    foreign key (storeId) references Store(id)
);

create table `Order` (
    id varchar(50) not null primary key,
    userId varchar(50) not null,
    address varchar(50) not null,
    total float not null,
    discount float,
    score int,
    pay float not null,
    voucherId varchar(50),
    status int not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp null,
    foreign key (address) references Address(id),
    foreign key (userId) references User(id),
    foreign key (voucherId) references Voucher(id)
);

create table ProductOrder (
    id varchar(50) not null primary key,
    productId varchar(50) not null,
    quantity int not null,
    priceBefore float not null,
    priceAfter float,
    orderId varchar(50) not null,
    note nvarchar(255) null,
    foreign key (productId) references Product(id),
    foreign key (orderId) references `Order`(id)
);

create table UserScore(
	userId varchar(50) not null,
    storeId varchar(50) not null,
    quantity int,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp,
    primary key (userId, storeId)
);
