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
('123',	'$2a$10$vYp7j2KrUdGYCgKUF5T5m.DcpSzIK2qJJ029UdlOPqkDzdCM1cJCe',	'331378bb-8e22-48e6-ac07-c5121bc70e41',	NULL,	NULL,	NULL,	'2024-04-16 15:13:09',	NULL),
('123123',	'$2a$10$OGVn4S8oXGYGlfb6qkEn4OTYh9MFoAvWCLoBUcVNoNkQs3mvss2fe',	'0c223403-599d-4e84-afe2-d292c4254030',	'2fae3dac-6d3e-4065-9e40-6716388b5374',	'6f154b33-0763-48ed-83a2-6de51e8fe15f',	NULL,	'2024-05-08 16:11:46',	NULL),
('admin',	'$2a$10$GjVoaKjp1SUehyXMYkRRGOMm/vTfXxGXa.j2J7tIG7G/VU0ZR/X9m',	'6f154b33-0763-48ed-83a2-6de51e8fe15f',	'1f4c1832-6765-47ee-b2d0-7a958a638414',	NULL,	NULL,	'2024-04-13 02:47:08',	NULL),
('admin1',	'$2a$10$2tOaI3rbwjcB9LCwwC07RO2KisbQvrfKrmYpCR8DJqD9R1GDSi8Ay',	'cb804886-3ead-4324-82de-bc1485ac2939',	'e7d9d715-7c00-4f50-9b67-8425e8bf8272',	NULL,	NULL,	'2024-04-24 15:26:52',	NULL),
('chauvanloc',	'$2a$10$dvqQ72o5hZyucYtZgDblHuDrMo/.E.QH6ml3f9XLNPMoNCJOR.97.',	'5dfccbc6-a03b-4f98-857b-5a89868e5e93',	'70602fbf-0bab-45b8-a702-baf8197ceaa7',	'6f154b33-0763-48ed-83a2-6de51e8fe15f',	NULL,	'2024-05-08 14:05:26',	NULL),
('employee1',	'$2a$10$c3JOkVtwOqP2j7HhgKncHuaSbdGI80DUZnlcYZZqI4TrC6/znkflO',	'7d6c1268-fdd3-4a47-8e96-f7b01d7c9ea1',	'9062e012-3b16-4c79-9bbe-2b0c13395c33',	'a226f227-c629-4c75-98ca-e56a3dab016e',	NULL,	'2024-04-13 02:45:09',	NULL),
('kientran',	'$2a$10$W2Jfs26RHt7uT.pk9w61F.epVDj89dCRTiSGsJ/TVNgUX7JdJW/va',	'45d9b1e5-7b76-4fb0-98fe-c5fc84256389',	'0a8f0852-ac0d-4ee7-88c3-1c4c06ef9f35',	'6f154b33-0763-48ed-83a2-6de51e8fe15f',	NULL,	'2024-05-09 13:07:00',	NULL),
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
('user9',	'$2a$10$eDwCyXLUOR79AQPEJv0IKu05r4IQVvElkHJNbn5bdCBS/SDK6mSYK',	'a666dc45-29aa-4301-87bb-18cc547386be',	'edcd2e1f-dad5-4bb3-ad5b-366d538059d0',	NULL,	NULL,	'2024-04-09 16:19:39',	NULL),
('vanlcoemp10',	'$2a$10$Pzrt1zM6BDOTbNTtRRcTLeRSbZ7MjUub4UJwCF5d9Lpgk1Xyk5OQO',	'40e8001d-79f8-4c8b-be63-0e6ca5ad4dd8',	'd42eec7c-1360-4c32-9d0f-7a2527d333eb',	'6f154b33-0763-48ed-83a2-6de51e8fe15f',	NULL,	'2024-05-08 16:10:50',	NULL),
('vanloc',	'$2a$10$xA52wI1fZ4RMzoJZQfTneuBshowDiVjbuBiZvLI9F.NrZ.19soAAC',	'2fd195ec-9f6d-4a63-bd59-c6a0d3c9e74e',	'2f4adc8c-ff6d-4a7e-9225-2b7c344fe74f',	'6f154b33-0763-48ed-83a2-6de51e8fe15f',	NULL,	'2024-05-08 14:07:29',	NULL),
('vanloc1',	'$2a$10$xtShV4uh2pXPAxQypfHHYuWO66ZetOWFBK2Fvh6YT2vHLpbHgxPxG',	'262dc0c4-a50a-4f39-a40f-0d7c1fe1cadd',	'adf00690-bc3f-4a6c-babc-23acc44158dd',	NULL,	NULL,	'2024-04-25 05:53:08',	NULL),
('vanloc2',	'$2a$10$iAkHAZgtppHLad90RCO5rOAvAp6q11jDBTaMX402ZWi4xihdcfFDW',	'3b22935a-3e5a-438e-a0eb-0375a890cab4',	'3da29260-b9f0-41a2-a9db-e827d0638999',	NULL,	NULL,	'2024-04-25 06:19:15',	NULL),
('vanloc3',	'$2a$10$HGAXDb5COUXTSkAVCjM9ruu.x6YGwarP46hkBeCY85b0aW9fIIn9i',	'5fb9f276-62c0-46e6-8757-cc8067cb0f87',	'ed750eeb-51b4-49ce-85c4-a78967bc06f2',	NULL,	NULL,	'2024-04-25 06:21:31',	NULL),
('vanloc4',	'$2a$10$APSueIGhnEbmxaYq3I7ClOdnJJa5LElMvN9nOSVrl.3cUm74TBrTG',	'e9951249-ec77-4faf-9d3d-f0ee119091bd',	'1594229a-ecdf-4f38-82ef-71de658bc014',	NULL,	NULL,	'2024-04-26 17:06:01',	NULL),
('vanloc5',	'$2a$10$zSRbWbYGcDDBuq9bj9Jzdu5auwRv3Xwb4HLDGkErndY1mBzkUu4ay',	'187af660-ad6c-4256-a90f-e463dc9081de',	'2bfaa212-b0e7-41f9-912c-fda4ac9884b5',	NULL,	NULL,	'2024-04-27 16:59:43',	NULL),
('vanlocemp1',	'$2a$10$UubBkT/T4xFmnNUpV/IaremfBQBV7gAPSYoanKBz5crrkfIrH0B/G',	'e13a9da0-51c8-489c-ac8d-a16e82869eca',	'378b529e-6459-4144-a324-f95fc2c3451b',	'6f154b33-0763-48ed-83a2-6de51e8fe15f',	NULL,	'2024-05-08 14:08:31',	NULL),
('vanlocemp2',	'$2a$10$lwT3Dw9vQZm2QWfRShUzVuKB84yC8ZQTO8hxGJ2A8jJFvd.rfHMn2',	'6ade4f20-e5cc-4271-af3a-2b47affd1491',	'53afec0e-603c-4df2-a225-9d3d37f26e95',	'6f154b33-0763-48ed-83a2-6de51e8fe15f',	NULL,	'2024-05-08 16:08:04',	NULL),
('vanlocemp3',	'$2a$10$YANoTg1aRefODwa0mIn5iuScWteU.icyOaS35RUGs/AiWViGIkfGC',	'e0de0145-d868-4d5b-8c39-2979d9e6d551',	'475ab915-1130-4ac3-8a9f-c99c30df88f7',	'6f154b33-0763-48ed-83a2-6de51e8fe15f',	NULL,	'2024-05-08 16:08:36',	NULL),
('vanlocemp4',	'$2a$10$n3xOQUOY5pKo6Fjz1KRI6ee3SOSUv4ju8X8pjtg9wbZ5gOPIxmlVO',	'fb438fb4-859d-4769-b618-c895d1cf7d43',	'1a2820d4-7165-4432-a30f-aaa6cb37aa33',	'6f154b33-0763-48ed-83a2-6de51e8fe15f',	NULL,	'2024-05-08 16:15:24',	NULL)
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

INSERT INTO `DeliveryInformation` (`id`, `full_name`, `phone`, `address`, `isPrimary`, `userId`, `createdAt`) VALUES
('0281b824-530b-4a03-9525-489b93ee77b2',	'CHAU VAN LOC',	'0346128692',	'TpHCM\nThu Duc',	0,	'a226f227-c629-4c75-98ca-e56a3dab016e',	'2024-04-13 05:42:40'),
('3ea3385f-16f7-477e-b54c-c5a9eb685b3c',	'Tu',	'1234123423',	'HCM',	0,	'187af660-ad6c-4256-a90f-e463dc9081de',	NULL),
('8bdb9d18-4994-4a79-a800-026376d49256',	'CHAU VAN LOC',	'0346128692',	'TpHCM\nThu Duc',	1,	'187af660-ad6c-4256-a90f-e463dc9081de',	'2024-04-30 10:53:19'),
('f894b550-45cc-45fa-aa3d-b1448dd662b8',	'Hien',	'123412334324',	'HCM',	0,	'187af660-ad6c-4256-a90f-e463dc9081de',	NULL)
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`), `full_name` = VALUES(`full_name`), `phone` = VALUES(`phone`), `address` = VALUES(`address`), `isPrimary` = VALUES(`isPrimary`), `userId` = VALUES(`userId`), `createdAt` = VALUES(`createdAt`);

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

INSERT INTO `Order` (`id`, `userId`, `storeId`, `total`, `discount`, `pay`, `note`, `voucherId`, `deliveryInformationId`, `status`, `createdAt`, `updatedAt`) VALUES
('033eea1e-a0b2-44ea-b3d6-ccbcbdffbbb2',	'187af660-ad6c-4256-a90f-e463dc9081de',	'a160174c-3e17-4623-8504-dea02e634036',	21400,	0,	21400,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'CANCEL',	'2024-05-04 09:19:29',	NULL),
('049576b0-8000-46f0-871c-138a2f79d510',	'187af660-ad6c-4256-a90f-e463dc9081de',	'93dd964f-2e6d-4874-9c79-009eb4d89202',	90000,	0,	90000,	NULL,	NULL,	'f894b550-45cc-45fa-aa3d-b1448dd662b8',	'WAITING_CONFIRM',	'2024-05-03 16:04:56',	NULL),
('0542b96f-2628-47f8-beec-7428aeb17fd2',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	37000,	0,	37000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:17:19',	NULL),
('0ad764d6-6eee-4677-8048-dc7afab8e59e',	'187af660-ad6c-4256-a90f-e463dc9081de',	'72e339da-c565-4a2e-97b0-1a142176e072',	239000,	0,	239000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 14:37:58',	NULL),
('2216e64d-5ca5-416f-b4b3-7fa374713027',	'187af660-ad6c-4256-a90f-e463dc9081de',	'6748c5c1-a1c7-468a-a779-0d5e0be487c4',	30000,	0,	30000,	NULL,	NULL,	'f894b550-45cc-45fa-aa3d-b1448dd662b8',	'WAITING_CONFIRM',	'2024-05-02 06:28:23',	NULL),
('2952f002-a80e-419d-969a-b7c02a2d1c39',	'187af660-ad6c-4256-a90f-e463dc9081de',	'93dd964f-2e6d-4874-9c79-009eb4d89202',	90000,	0,	90000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'CANCEL',	'2024-05-04 09:19:29',	NULL),
('29ff164e-a113-453c-b5f4-31a485f6ff7b',	'187af660-ad6c-4256-a90f-e463dc9081de',	'a160174c-3e17-4623-8504-dea02e634036',	44500,	0,	44500,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 10:33:32',	NULL),
('318fa540-676b-4a37-9345-e95a204eff4c',	'187af660-ad6c-4256-a90f-e463dc9081de',	'3eb660b5-90c7-4ae4-accf-793cac4df283',	27040,	0,	27040,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:16:15',	NULL),
('31d0f5f7-010b-4703-b4ec-8c6eba166695',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	122000,	0,	122000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-04-30 12:23:08',	NULL),
('347a8fdc-63f0-4aa6-85ee-efd7e920a248',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	292000,	0,	292000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'CANCEL',	'2024-05-04 09:19:29',	NULL),
('3845d77c-29fb-403e-9952-921a1f96e8ab',	'187af660-ad6c-4256-a90f-e463dc9081de',	'465d9c2f-cbb7-4d53-943d-0b902f51861f',	656000,	0,	656000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-04-30 14:03:04',	NULL),
('39fcc88d-4818-433a-992c-8a78e0704ad2',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	37000,	0,	37000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 15:41:55',	NULL),
('3a1bf358-063a-48e3-82ea-0dfdd0adc74d',	'187af660-ad6c-4256-a90f-e463dc9081de',	'6748c5c1-a1c7-468a-a779-0d5e0be487c4',	740000,	0,	740000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 14:37:58',	NULL),
('3ab2acbf-2194-412c-9590-0cc6cb11b223',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	37000,	0,	37000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-04-30 14:03:04',	NULL),
('40fed921-decc-4402-9118-7e7150c42f94',	'187af660-ad6c-4256-a90f-e463dc9081de',	'93dd964f-2e6d-4874-9c79-009eb4d89202',	286000,	0,	286000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:16:15',	NULL),
('591e5954-3e37-455a-8e5e-457289ecad5f',	'187af660-ad6c-4256-a90f-e463dc9081de',	'93dd964f-2e6d-4874-9c79-009eb4d89202',	286000,	0,	286000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 14:37:58',	NULL),
('5ec5b8b9-d6b8-4e79-b26c-b54ea141f03b',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	629000,	0,	629000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'CANCEL',	'2024-05-05 13:12:00',	NULL),
('5fbd629d-299e-4fd9-bfd9-cce7ab670fc8',	'187af660-ad6c-4256-a90f-e463dc9081de',	'61692e39-1edf-4eb7-b312-7a95aea194ef',	39000,	0,	39000,	NULL,	NULL,	'f894b550-45cc-45fa-aa3d-b1448dd662b8',	'WAITING_CONFIRM',	'2024-05-02 06:28:23',	NULL),
('63a23162-f0b3-4b48-ba14-efea1e4400c4',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	37000,	0,	37000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 10:34:51',	NULL),
('641d0c25-59ac-46fd-924b-e55d2b411c39',	'187af660-ad6c-4256-a90f-e463dc9081de',	'a160174c-3e17-4623-8504-dea02e634036',	21400,	0,	21400,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:16:15',	NULL),
('688d0234-ed94-4bdd-94fd-97a879931594',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	122000,	0,	122000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 14:30:50',	NULL),
('6891638a-8c5c-46d2-a65a-c18c7c56afbc',	'187af660-ad6c-4256-a90f-e463dc9081de',	'61692e39-1edf-4eb7-b312-7a95aea194ef',	89000,	0,	89000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-05 13:12:00',	NULL),
('6e90df80-81a5-4121-9bf0-1f214e0edc22',	'187af660-ad6c-4256-a90f-e463dc9081de',	'6748c5c1-a1c7-468a-a779-0d5e0be487c4',	740000,	0,	740000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:17:19',	NULL),
('74f522dc-9d82-4b4c-b459-2adaddc8cf2a',	'187af660-ad6c-4256-a90f-e463dc9081de',	'93dd964f-2e6d-4874-9c79-009eb4d89202',	720000,	0,	720000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 10:38:37',	NULL),
('7a1e5a1a-7a33-4a1c-9ae8-c60d1b6cadcb',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	74000,	0,	74000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:19:31',	NULL),
('7ccdd3b0-8d6d-4afe-96ba-5dcfbb518c55',	'187af660-ad6c-4256-a90f-e463dc9081de',	'465d9c2f-cbb7-4d53-943d-0b902f51861f',	328000,	0,	328000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 10:34:51',	NULL),
('8272dbdb-e18c-439f-85af-677342e3b403',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	39999,	0,	39999,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'CANCEL',	'2024-05-04 15:18:13',	NULL),
('88597b09-d425-45ff-840d-8c7db82245db',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	146997,	0,	146997,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-04-30 13:32:49',	NULL),
('89f34515-7335-494b-837c-fa42fbb11573',	'187af660-ad6c-4256-a90f-e463dc9081de',	'61692e39-1edf-4eb7-b312-7a95aea194ef',	39000,	0,	39000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 15:11:21',	NULL),
('8f270cc6-acc6-4d73-9f93-b6d97d8e611d',	'187af660-ad6c-4256-a90f-e463dc9081de',	'a160174c-3e17-4623-8504-dea02e634036',	12500,	0,	12500,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 10:42:55',	NULL),
('96b7e7cc-02bf-4b67-8e90-5fdd4f9133e4',	'187af660-ad6c-4256-a90f-e463dc9081de',	'61692e39-1edf-4eb7-b312-7a95aea194ef',	39000,	0,	39000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 10:34:51',	NULL),
('98531556-527e-4e88-b559-8c35be3c4ab2',	'187af660-ad6c-4256-a90f-e463dc9081de',	'f94b297d-2e44-4dbe-a161-761c32596267',	389000,	0,	389000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:16:15',	NULL),
('9a532d43-32c7-48fe-9a0e-12e4b5f28be1',	'187af660-ad6c-4256-a90f-e463dc9081de',	'72e339da-c565-4a2e-97b0-1a142176e072',	478000,	0,	478000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-02 06:11:13',	NULL),
('9b935c8c-53fc-43f1-849a-6ac250081118',	'187af660-ad6c-4256-a90f-e463dc9081de',	'465d9c2f-cbb7-4d53-943d-0b902f51861f',	387000,	0,	387000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 15:11:21',	NULL),
('a03afee7-7015-4e28-95ce-e420f90fa556',	'187af660-ad6c-4256-a90f-e463dc9081de',	'465d9c2f-cbb7-4d53-943d-0b902f51861f',	328000,	0,	328000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-04-30 13:55:40',	NULL),
('a1934f9f-1274-421f-95c2-a100d664e511',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	122000,	0,	122000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-02 06:11:13',	NULL),
('a3aff1ed-92a7-4761-83db-6a5ebf414cfe',	'187af660-ad6c-4256-a90f-e463dc9081de',	'3eb660b5-90c7-4ae4-accf-793cac4df283',	109000,	0,	109000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:18:13',	NULL),
('a5624ac5-352b-4b8f-a920-4ddf3b73a6e1',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	26500,	0,	26500,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:16:15',	NULL),
('bcc82fb2-fdd9-4b3d-a833-14b8e72405d0',	'187af660-ad6c-4256-a90f-e463dc9081de',	'72e339da-c565-4a2e-97b0-1a142176e072',	478000,	0,	478000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 14:30:50',	NULL),
('bf69e510-fbbb-4ca1-87ed-f99e4b966f17',	'187af660-ad6c-4256-a90f-e463dc9081de',	'465d9c2f-cbb7-4d53-943d-0b902f51861f',	59000,	0,	59000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:16:15',	NULL),
('c2eb0b85-a7ac-405e-8edb-33aacef07582',	'187af660-ad6c-4256-a90f-e463dc9081de',	'465d9c2f-cbb7-4d53-943d-0b902f51861f',	387000,	0,	387000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 09:19:29',	NULL),
('c762179e-22aa-4953-bfbb-4bb67c4605c7',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	122000,	0,	122000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:09:53',	NULL),
('dd01f9b8-5eac-4646-927b-a6f3275978b6',	'187af660-ad6c-4256-a90f-e463dc9081de',	'61692e39-1edf-4eb7-b312-7a95aea194ef',	39000,	0,	39000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'CANCEL',	'2024-05-04 09:19:29',	NULL),
('e8715c64-af98-4cf3-a7fb-32b94b135631',	'187af660-ad6c-4256-a90f-e463dc9081de',	'465d9c2f-cbb7-4d53-943d-0b902f51861f',	328000,	0,	328000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 15:41:55',	NULL),
('f2aad748-aae8-4739-8d7f-3ec5baeaab9f',	'187af660-ad6c-4256-a90f-e463dc9081de',	'72e339da-c565-4a2e-97b0-1a142176e072',	478000,	0,	478000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:09:53',	NULL),
('f64f9ce3-0590-42c9-8e45-d9d5f462ab2f',	'187af660-ad6c-4256-a90f-e463dc9081de',	'6748c5c1-a1c7-468a-a779-0d5e0be487c4',	30000,	0,	30000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-04 15:18:13',	NULL),
('f7aefb03-bd59-49f8-95d1-a0703f30808a',	'187af660-ad6c-4256-a90f-e463dc9081de',	'de51b1b6-ed27-49b7-a804-57b7992cbc81',	37000,	0,	37000,	NULL,	NULL,	'8bdb9d18-4994-4a79-a800-026376d49256',	'WAITING_CONFIRM',	'2024-05-03 15:11:21',	NULL)
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`), `userId` = VALUES(`userId`), `storeId` = VALUES(`storeId`), `total` = VALUES(`total`), `discount` = VALUES(`discount`), `pay` = VALUES(`pay`), `note` = VALUES(`note`), `voucherId` = VALUES(`voucherId`), `deliveryInformationId` = VALUES(`deliveryInformationId`), `status` = VALUES(`status`), `createdAt` = VALUES(`createdAt`), `updatedAt` = VALUES(`updatedAt`);