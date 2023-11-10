-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 10, 2023 at 01:30 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kingura`
--

-- --------------------------------------------------------

--
-- Table structure for table `contents`
--

CREATE TABLE `contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL CHECK (octet_length(`title`) >= 5),
  `description` varchar(255) NOT NULL CHECK (octet_length(`description`) >= 10),
  `contentType` enum('Book','Audio Book','Video','Podcast','Article') DEFAULT 'Book',
  `price` varchar(255) DEFAULT NULL CHECK (`price` regexp '^[0-9]{1,10}$'),
  `content` varchar(255) NOT NULL,
  `instructorId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Pending','Approved','Disapproved','Removed') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contents`
--

INSERT INTO `contents` (`id`, `title`, `description`, `contentType`, `price`, `content`, `instructorId`, `createdAt`, `updatedAt`, `status`) VALUES
(1, 'Rire et chanson', 'How can i explain this feeling yet it\'s unexplainable', 'Book', '11', 'Welcome to ABC Agent Banking.Your account opening request is waiting for approval.Your application reference no: 940664. After approval you will get SMS with account number details. Welcome to ABC Age', 1, '2023-09-17 11:20:23', '2023-09-18 09:55:39', 'Pending'),
(2, 'Tear and Rain', 'How can i explain this feeling yet it\'s unexplainable', 'Audio Book', '29', 'Welcome to ABC Agent Banking.Your account opening request is waiting for approval.Your application reference no: 940664. After approval you will get SMS with account number details. Welcome to ABC Age', 2, '2023-09-17 11:36:55', '2023-09-17 11:43:27', 'Approved'),
(3, 'Fasting and Prayer', 'How can i explain this feeling yet it\'s unexplainable', 'Video', '49', 'Welcome to ABC Agent Banking.Your account opening request is waiting for approval.Your application reference no: 940664. After approval you will get SMS with account number details. Welcome to ABC Age', 6, '2023-09-17 11:36:57', '2023-09-17 11:36:57', 'Pending'),
(4, 'Honesty before everyting', 'How can i explain this feeling yet it\'s unexplainable', 'Podcast', '40', 'Welcome to ABC Agent Banking.Your account opening request is waiting for approval.Your application reference no: 940664. After approval you will get SMS with account number details. Welcome to ABC Age', 3, '2023-09-17 11:36:58', '2023-09-17 11:47:14', 'Approved'),
(5, 'Rire et chanson', 'How can i explain this feeling yet it\'s unexplainable', 'Article', '61', 'Welcome to ABC Agent Banking.Your account opening request is waiting for approval.Your application reference no: 940664. After approval you will get SMS with account number details. Welcome to ABC Age', 5, '2023-09-17 11:36:59', '2023-09-17 12:05:27', 'Approved'),
(6, 'Rire et chanson', 'How can i explain this feeling yet it\'s unexplainable', 'Book', '26', 'Welcome to ABC Agent Banking.Your account opening request is waiting for approval.Your application reference no: 940664. After approval you will get SMS with account number details. Welcome to ABC Age', 10, '2023-09-17 11:37:00', '2023-09-18 10:39:07', 'Removed'),
(7, 'Rire et chanson', 'How can i explain this feeling yet it\'s unexplainable', 'Audio Book', '32', 'Welcome to ABC Agent Banking.Your account opening request is waiting for approval.Your application reference no: 940664. After approval you will get SMS with account number details. Welcome to ABC Age', 11, '2023-09-17 11:37:01', '2023-09-17 12:14:26', 'Disapproved'),
(8, 'Rire et chanson', 'How can i explain this feeling yet it\'s unexplainable', 'Video', '25', 'Welcome to ABC Agent Banking.Your account opening request is waiting for approval.Your application reference no: 940664. After approval you will get SMS with account number details. Welcome to ABC Age', 14, '2023-09-17 11:37:01', '2023-09-17 11:37:01', 'Pending'),
(9, 'Rire et chanson', 'How can i explain this feeling yet it\'s unexplainable', 'Podcast', '38', 'Welcome to ABC Agent Banking.Your account opening request is waiting for approval.Your application reference no: 940664. After approval you will get SMS with account number details. Welcome to ABC Age', 1, '2023-09-17 11:37:02', '2023-09-17 12:02:06', 'Pending'),
(10, 'Rire et chanson', 'How can i explain this feeling yet it\'s unexplainable', 'Article', '21', 'Welcome to ABC Agent Banking.Your account opening request is waiting for approval.Your application reference no: 940664. After approval you will get SMS with account number details. Welcome to ABC Age', 3, '2023-09-17 11:37:04', '2023-09-17 11:37:04', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `id` int(11) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `countryCode` varchar(5) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `language` varchar(255) NOT NULL,
  `section` varchar(255) NOT NULL,
  `picture` varchar(255) DEFAULT 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/02/02/20/22-Black-Teacher-Corbis.jpg',
  `status` enum('Active','Banned','Pending') DEFAULT 'Active',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`id`, `fname`, `email`, `countryCode`, `phoneNumber`, `language`, `section`, `picture`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Kalume Ernest', 'aryaristote1@gmail.com', '+243', '990413130', 'Yuruba', 'course', 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/02/02/20/22-Black-Teacher-Corbis.jpg', 'Active', '2023-09-12 09:52:49', '2023-09-24 11:26:45'),
(2, 'John chishugi', 'jkchishugi@gmail.com', '+243', '9904131234', 'English', 'Book', 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/02/02/20/22-Black-Teacher-Corbis.jpg', 'Banned', '2023-09-12 09:54:12', '2023-09-24 11:11:24'),
(3, 'David Nsengimana', 'nsengimanaDav23@gmail.com', '+250', '736399234', 'Kinyarwanda', 'Book', 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/02/02/20/22-Black-Teacher-Corbis.jpg', 'Banned', '2023-09-12 09:55:06', '2023-09-17 11:05:45'),
(5, 'Grace keza', 'kezaG28@gmail.com', '+250', '784453123', 'Swahili', 'Courses', 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/02/02/20/22-Black-Teacher-Corbis.jpg', 'Banned', '2023-09-12 09:56:17', '2023-09-14 12:19:52'),
(6, 'Arsene Murhonyi', 'mutarushwaArsene@gmail.com', '+250', '734544123', 'French', 'Books', 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/02/02/20/22-Black-Teacher-Corbis.jpg', 'Banned', '2023-09-12 10:30:14', '2023-09-17 11:05:31'),
(10, 'Kalume Ernest Aristote', 'aryaristote@gmail.com', '+243', '990413132', 'English', 'Audio Book', 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/02/02/20/22-Black-Teacher-Corbis.jpg', 'Banned', '2023-09-14 10:09:40', '2023-09-17 11:05:37'),
(11, 'test', 'test@test.com', '+243', '452566362', 'English', 'Audio Book', 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/02/02/20/22-Black-Teacher-Corbis.jpg', 'Active', '2023-09-14 10:10:58', '2023-09-14 12:08:36'),
(14, 'Kalume Ernest Aristote', 'aryaristote212@gmail.com', '+243', '9904132324', 'English', 'Audio Book', 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/02/02/20/22-Black-Teacher-Corbis.jpg', 'Active', '2023-09-14 10:12:07', '2023-09-14 10:12:07');

-- --------------------------------------------------------

--
-- Table structure for table `stripepayments`
--

CREATE TABLE `stripepayments` (
  `id` int(11) NOT NULL,
  `instructorId` int(11) NOT NULL,
  `amount` float NOT NULL,
  `currency` varchar(255) NOT NULL,
  `type` enum('momo','bank') DEFAULT 'momo',
  `number` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stripepayments`
--

INSERT INTO `stripepayments` (`id`, `instructorId`, `amount`, `currency`, `type`, `number`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 1, 250, 'Rwf', 'momo', 2147483647, NULL, '2023-09-28 09:34:51', '2023-09-28 09:34:51'),
(2, 1, 250, 'Rwf', 'momo', 2147483647, NULL, '2023-09-28 09:36:47', '2023-09-28 09:36:47'),
(3, 1, 400, 'NGN', 'momo', 2147483647, NULL, '2023-09-28 10:33:39', '2023-09-28 10:33:39'),
(21, 5, 12000, 'rwf', '', 45566, 'love in air', '2023-10-12 12:16:19', '2023-10-12 12:16:19'),
(22, 5, 12000, 'rwf', '', 45566, 'love in air', '2023-10-12 12:32:54', '2023-10-12 12:32:54'),
(23, 3, 345, 'rwf', '', 567822, 'Love in air second version', '2023-10-12 16:28:19', '2023-10-12 16:28:19'),
(24, 3, 345, 'rwf', '', 567822, 'Love in air second version', '2023-10-12 16:28:51', '2023-10-12 16:28:51'),
(25, 3, 345, 'rwf', '', 567822, 'Love in air second version', '2023-10-12 16:31:02', '2023-10-12 16:31:02'),
(26, 3, 345, 'rwf', '', 567822, 'Love in air second version', '2023-10-12 16:31:17', '2023-10-12 16:31:17'),
(27, 3, 345, 'rwf', '', 567822, 'Love in air second version', '2023-10-12 16:35:00', '2023-10-12 16:35:00'),
(28, 6, 63553, 'usd', 'bank', 56789, 'Love in air', '2023-10-12 16:39:14', '2023-10-12 16:39:14'),
(29, 6, 63553, 'usd', 'bank', 56789, 'Love in air', '2023-10-12 16:40:04', '2023-10-12 16:40:04'),
(30, 1, 2343540, 'rwf', '', 2147483647, 'dsjdsjdsjdsjkjkds', '2023-10-12 16:49:05', '2023-10-12 16:49:05'),
(31, 1, 23424, 'usd', 'bank', 3736363, 'Kalume ernest aristote', '2023-10-12 17:28:45', '2023-10-12 17:28:45'),
(32, 1, 3535, 'rwf', 'bank', 0, 'Kalume ernest ernest', '2023-10-12 17:29:44', '2023-10-12 17:29:44'),
(33, 1, 63663, 'rwf', '', 5356363, 'ksjshdhdhd dhdhdhjejejds', '2023-10-12 17:32:21', '2023-10-12 17:32:21'),
(34, 1, 54, 'eur', 'bank', 6363636, 'kalume ernest asrisnds', '2023-10-12 17:35:36', '2023-10-12 17:35:36'),
(35, 1, 111, 'rwf', 'bank', 2147483647, 'kajhd dhdhdbdn djdjd', '2023-10-12 17:41:50', '2023-10-12 17:41:50'),
(36, 1, 21, 'usd', 'momo', 2147483647, 'amapiano mix logic love', '2023-10-12 17:46:25', '2023-10-12 17:46:25'),
(37, 1, 5353, 'rwf', 'bank', 46464, 'kalume ernest ernest', '2023-10-12 17:59:51', '2023-10-12 17:59:51');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `userId`, `token`, `createdAt`, `updatedAt`) VALUES
(169, 44, 'a1200db7-2b27-4be9-a4b1-2a8b93043c05', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `countryCode` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `picture` varchar(255) NOT NULL,
  `provider` tinyint(1) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `resetToken` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fname`, `email`, `countryCode`, `phoneNumber`, `picture`, `provider`, `password`, `verified`, `createdAt`, `updatedAt`, `resetToken`) VALUES
(44, 'Kalume Ernest Aristote', 'aryaristote@gmail.com', '+243', '990413132', 'https://firefoxusercontent.com/00000000000000000000000000000000', 0, '$2b$10$c9KPZa4oGDiPsbMrz.UKVujHyk8yC4do5Sr3GAKee3J2B/.BngVXC', 0, '2023-09-06 10:55:37', '2023-09-06 10:57:11', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contents`
--
ALTER TABLE `contents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phoneNumber` (`phoneNumber`);

--
-- Indexes for table `stripepayments`
--
ALTER TABLE `stripepayments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `instructorId` (`instructorId`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phoneNumber` (`phoneNumber`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contents`
--
ALTER TABLE `contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `instructors`
--
ALTER TABLE `instructors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `stripepayments`
--
ALTER TABLE `stripepayments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `stripepayments`
--
ALTER TABLE `stripepayments`
  ADD CONSTRAINT `stripepayments_ibfk_1` FOREIGN KEY (`instructorId`) REFERENCES `instructors` (`id`);

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
