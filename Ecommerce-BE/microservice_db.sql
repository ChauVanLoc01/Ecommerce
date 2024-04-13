-- Adminer 4.8.1 MySQL 8.3.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Account`;
CREATE TABLE `Account` (
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `storeRoleId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`username`),
  KEY `createdBy` (`createdBy`),
  KEY `storeRoleId` (`storeRoleId`),
  KEY `updatedBy` (`updatedBy`),
  KEY `userId` (`userId`),
  CONSTRAINT `Account_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
  CONSTRAINT `Account_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`),
  CONSTRAINT `Account_ibfk_3` FOREIGN KEY (`updatedBy`) REFERENCES `User` (`id`),
  CONSTRAINT `Account_ibfk_4` FOREIGN KEY (`storeRoleId`) REFERENCES `StoreRole` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Account` (`username`, `password`, `userId`, `storeRoleId`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`) VALUES
('user0',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'd2873926-c2f1-4408-b6c2-dc18436429f0',	'a7c6ef4f-63ab-4841-9eb5-51705ee8289a',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL),
('user1',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'a226f227-c629-4c75-98ca-e56a3dab016e',	'f1945fb7-3199-4df9-9bcf-66d52af445e3',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL),
('user10',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'abdf677a-71ff-4f81-a2c5-6615a04bedfe',	'b29021dd-7d54-492b-b02a-85b25cdfce1f',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL),
('user2',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'0f9a0d3c-c666-4851-835e-59c6dc035218',	'825be1f9-3cf8-46f7-9c17-b019ae54a238',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL),
('user3',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'4fbaeb18-6d87-40e3-80cd-5dbf57f963a7',	'0ed0661b-ab71-411c-bce1-3f61941e9969',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL),
('user4',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'6c868791-2b31-46aa-b24f-9442084f260a',	'166a08cc-3f76-47f2-a465-79e61b423f73',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL),
('user5',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'a3816a2a-93c2-49a9-b5af-16e25615b2c1',	'7d8936a0-7991-464c-b97a-582496a468eb',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL),
('user6',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'f82a04b9-c41e-4d24-bc0b-3be0538a603b',	'7b5e893f-8eed-466f-b44e-267053c4de48',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL),
('user7',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'e9307983-16bd-42ce-a3bf-7e12dc89fae6',	'e87c9a4c-00cb-46de-8607-d71524aa4547',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL),
('user8',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'05044440-aad0-4223-b9c6-d29394a4d871',	'4a7037f3-e565-446c-b8a3-e85c03550c0c',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL),
('user9',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'a666dc45-29aa-4301-87bb-18cc547386be',	'edcd2e1f-dad5-4bb3-ad5b-366d538059d0',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL)
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`), `password` = VALUES(`password`), `userId` = VALUES(`userId`), `storeRoleId` = VALUES(`storeRoleId`), `createdBy` = VALUES(`createdBy`), `updatedBy` = VALUES(`updatedBy`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);

DROP TABLE IF EXISTS `Category`;
CREATE TABLE `Category` (
  `shortname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`shortname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Category` (`shortname`, `name`, `description`) VALUES
('bachhoaonline',	'Bách Hóa Online',	NULL),
('dienthoai&phukien',	'Điện Thoại & Phụ Kiện',	NULL),
('dongho',	'Đồng Hồ',	NULL),
('giaydepnam',	'Giày Dép Nam',	NULL),
('giaydepnu',	'Giày Dép Nữ',	NULL),
('mayanh&mayquayphim',	'Máy Ảnh & Máy Quay Phim',	NULL),
('maytinh&laptop',	'Máy Tính & Laptop',	NULL),
('me&be',	'Mẹ & Bé',	NULL),
('nhacua&doisong',	'Nhà Cửa & Đời Sống',	NULL),
('phukien&trangsucnu',	'Phụ Kiện & Trang Sức Nữ',	NULL),
('sacdep',	'Sắc Đẹp',	NULL),
('suckhoe',	'Sức Khỏe',	NULL),
('thethao&dulich',	'Thể Thao & Du Lịch',	NULL),
('thietbidiengiadung',	'Thiết Bị Điện Gia Dụng',	NULL),
('thietbidientu',	'Thiết Bị Điện Tử',	NULL),
('thoitrangnam',	'Thời Trang Nam',	NULL),
('thoitrangnu',	'Thời Trang Nữ',	NULL),
('tuivinu',	'Túi Ví Nữ',	NULL)
ON DUPLICATE KEY UPDATE `shortname` = VALUES(`shortname`), `name` = VALUES(`name`), `description` = VALUES(`description`);

DROP TABLE IF EXISTS `DeliveryInformation`;
CREATE TABLE `DeliveryInformation` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `isPrimary` tinyint(1) NOT NULL DEFAULT '0',
  `userId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `DeliveryInformation_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `Order`;
CREATE TABLE `Order` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `storeId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total` float NOT NULL,
  `discount` float DEFAULT NULL,
  `pay` float NOT NULL,
  `note` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `voucherId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveryInformationId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `voucherId` (`voucherId`),
  KEY `storeId` (`storeId`),
  KEY `deliveryInformationId` (`deliveryInformationId`),
  CONSTRAINT `Order_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`),
  CONSTRAINT `Order_ibfk_2` FOREIGN KEY (`voucherId`) REFERENCES `Voucher` (`id`),
  CONSTRAINT `Order_ibfk_3` FOREIGN KEY (`storeId`) REFERENCES `Store` (`id`),
  CONSTRAINT `Order_ibfk_4` FOREIGN KEY (`deliveryInformationId`) REFERENCES `DeliveryInformation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `Payment`;
CREATE TABLE `Payment` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` float NOT NULL,
  `status` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `method` int NOT NULL,
  `transactionId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orderID` (`orderID`),
  CONSTRAINT `Payment_ibfk_1` FOREIGN KEY (`orderID`) REFERENCES `Order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `Product`;
CREATE TABLE `Product` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priceBefore` float NOT NULL,
  `priceAfter` float DEFAULT NULL,
  `initQuantity` int NOT NULL,
  `currentQuantity` int NOT NULL,
  `sold` int NOT NULL DEFAULT '0',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `storeId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `voucherId` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rate` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  KEY `createdBy` (`createdBy`),
  KEY `deletedBy` (`deletedBy`),
  KEY `storeId` (`storeId`),
  KEY `updatedBy` (`updatedBy`),
  KEY `voucherId` (`voucherId`),
  CONSTRAINT `Product_ibfk_1` FOREIGN KEY (`category`) REFERENCES `Category` (`shortname`),
  CONSTRAINT `Product_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`),
  CONSTRAINT `Product_ibfk_3` FOREIGN KEY (`updatedBy`) REFERENCES `User` (`id`),
  CONSTRAINT `Product_ibfk_4` FOREIGN KEY (`storeId`) REFERENCES `Store` (`id`),
  CONSTRAINT `Product_ibfk_5` FOREIGN KEY (`deletedBy`) REFERENCES `User` (`id`),
  CONSTRAINT `Product_ibfk_6` FOREIGN KEY (`voucherId`) REFERENCES `Voucher` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
