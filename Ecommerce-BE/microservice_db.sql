use microservice;

create table District (
	name nvarchar(100) not null primary key
);

create table City (
	name nvarchar(100) not null primary key
);

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

create table StorePermission (
	id varchar(50) not null primary key,
    accountId varchar(50) not null,
    storeId varchar(50) not null,
    role int not null,
    foreign key (storeId) references Store(id),
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
	id varchar(50) not null primary key,
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
    foreign key (createdBy) references Account(id)
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

create table `Order` (
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

create table Vourcher (
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



























