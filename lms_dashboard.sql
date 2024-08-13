-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2023 at 01:42 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms dashboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `assign`
--

CREATE TABLE `assign` (
  `id` int(11) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `course_code` int(11) NOT NULL,
  `instructor_id` int(11) NOT NULL,
  `instructor_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assign`
--

INSERT INTO `assign` (`id`, `course_name`, `course_code`, `instructor_id`, `instructor_name`) VALUES
(3, 'history', 24, 19, 'mohsen '),
(4, 'arabic', 23, 18, 'alaa mohamed'),
(5, 'Math', 22, 17, 'ahmed kamal'),
(6, 'english 3', 99, 21, 'mohamed abdallah ');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'inactive',
  `code` int(10) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `status`, `code`, `image_url`, `Description`) VALUES
(1, 'Math', 'active', 22, '1681494539302.webp', 'blablbalblablablablabablab math'),
(4, 'arabic', 'active', 23, '1681581753771.jpg', 'blbalblalbalblablalbab arabic'),
(6, 'history', 'active', 24, '1681595998218.jpg', 'bablbalblablalblablalbalbla history'),
(18, 'english 3', 'active', 99, '1682685433153.jpg', 'babalbalblablabalbalblalb english 3'),
(19, 'pharmacy 1', 'inactive', 35, '1683416460943.webp', 'balbalblablalbalblablalblablalbllba not pharmacy');

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `Field` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `activity` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 => not assigned to course\r\n1=> assigned to course'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructor`
--

INSERT INTO `instructor` (`id`, `user_id`, `name`, `Field`, `image_url`, `activity`) VALUES
(17, 32, 'ahmed kamal', 'math instructor bla bla bla', '1681562169344.jpg', 1),
(18, 34, 'alaa mohamed', 'arabic instructor blablablabla', '1681582089156.jpg', 1),
(19, 35, 'mohsen ', 'history instructor blablablabla', '1681582183895.jpg', 1),
(20, 36, 'mohamed mostafa', 'english instructor blablablabla', '1681646718502.jpg', 0),
(21, 41, 'mohamed abdallah ', 'english33 instructor blablablabla', '1682686048292.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `regcourse`
--

CREATE TABLE `regcourse` (
  `id` int(11) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `instructorname` varchar(255) NOT NULL,
  `grade` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `regcourse`
--

INSERT INTO `regcourse` (`id`, `student_name`, `email`, `phone`, `course_name`, `instructorname`, `grade`) VALUES
(1, 'Ahmed', 'Ahmed@student.com', '01111111111111', 'arabic', 'alaa mohamed', 55),
(7, 'mohamed', 'mohamed@student.com', '01111111111111', 'history', 'mohsen', 90),
(9, 'mohamed', 'mohaamed@student.com', '01111111111111', 'arabic', 'alaa mohamed', 35),
(10, 'ziad', 'kglegj@student.com', '0111242151361', 'english 3', 'mohamed abdallah ', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(225) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'inactive' COMMENT 'active ->login w register\r\ninactive ->logout\r\n',
  `token` varchar(255) NOT NULL,
  `role` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0=> Student\r\n1=> admin\r\n2=>instructor',
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `phone`, `status`, `token`, `role`, `name`) VALUES
(30, 'ahmed@admin.com', '$2b$10$/TETY9l.Ssjpvs9OiHeaHeKBx0Ru2JjQE/LitNV1u74Ledqf1zVQG', '0111111111', 'active', '3f57e3be4f0775ad0dffdf667fc8cd61', 1, 'ahmedmo'),
(32, 'mohy@admin.com', '$2b$10$8lceD04CprCsvOpTJD4Q.uA0UW07Hqcuw/igj7MTAGiCYHFt8FB/W', '022222222', 'active', 'dbe9c461b769a51b79a8a9e140aaae2e', 2, 'ahmedmohy'),
(34, 'mohy22@admin.com', '$2b$10$6vJaZ9OA96f5C5FG9dcFauOmVijesUs7R1iYRVZjrcUouuYkOEUDm', '0222222221', 'active', '3407d98d029c14d6354863725138f89a', 2, 'ahmedmohy0001'),
(35, 'mohiy22@admin.com', '$2b$10$2fnVu3uPF2RNPkmnm2nKheyDRH8/xw3WcLez6m4Bclhp6MB7rGiLG', '02222322221', 'active', 'fd3e25037fdf74e33ae968e32ce12fba', 2, 'ahmedmohy0101'),
(36, 'mohiiy22@admin.com', '$2b$10$sRp2TH70l5/dEUw/2hIxHOFrY/mHCjGwDo62Y7Ym4NZywz/YWhHP2', '022223221', 'active', 'cec0798dbc74710e22089cd9dfd2f8b7', 2, 'ahmedmohy101'),
(37, 'mohiyy122@admin.com', '$2b$10$LpskAGcKOnYF3E5UOyxpRefbbN5031ncM/fgvtKfXBlkeHjUFakCe', '01222322221', 'active', '168112141f395ca22e1346488b0e5941', 0, 'ahmeeedmohy0101'),
(39, 'mohaiyy122@admin.com', '$2b$10$J0A379dEzMA8soKH8Zlk3ODaisBCw0N732KCczj9XckJ7Jtk13Nki', '012322221', 'active', '79c6d3555dc0db1ff29ba3eb0624cfa2', 1, 'ahmeaeedmohy0101'),
(40, 'mohaiyy13322@admin.com', '$2b$10$akM5Vdu8tNpiPnjUWOWVVegqs1E6ZYOeCxJkmW61Nel3b4jn4PUXW', '0123532522221', 'inactive', '7c3d996c47f4f7fd08458c81628e1f96', 2, 'ahmeaeedmohyii0101'),
(41, 'mohaiyaay13322@admin.com', '$2b$10$Voa4IgnhZHID/Jlj6f7zg.rwwe24irw9lv.nI7sYOKCoqP9MM4EhS', '0123532122221', 'active', '786e6a3946f146801c192e4c648641ce', 2, 'ahedmohyii0101'),
(42, 'mohaiyazay13322@admin.com', '$2b$10$zf1E2yA1R37mDnNLZE.VFevWFQQiD7QZ5xG/5wfQoiOPNmmN4FbOC', '01235352122221', 'active', '89fec5fb634130f05527620acc5a84af', 0, 'ahedmohzyii0101');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assign`
--
ALTER TABLE `assign`
  ADD PRIMARY KEY (`id`),
  ADD KEY `constrain course name` (`course_name`),
  ADD KEY `constrain course code` (`course_code`),
  ADD KEY `constrain instructor id` (`instructor_id`),
  ADD KEY `constrain instructor name` (`instructor_name`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `instructor constraint` (`user_id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `regcourse`
--
ALTER TABLE `regcourse`
  ADD PRIMARY KEY (`id`),
  ADD KEY `constrain course nameee` (`course_name`),
  ADD KEY `inss` (`instructorname`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assign`
--
ALTER TABLE `assign`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `instructor`
--
ALTER TABLE `instructor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `regcourse`
--
ALTER TABLE `regcourse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assign`
--
ALTER TABLE `assign`
  ADD CONSTRAINT `constrain course code` FOREIGN KEY (`course_code`) REFERENCES `courses` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `constrain course name` FOREIGN KEY (`course_name`) REFERENCES `courses` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `constrain instructor id` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `constrain instructor name` FOREIGN KEY (`instructor_name`) REFERENCES `instructor` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `instructor`
--
ALTER TABLE `instructor`
  ADD CONSTRAINT `instructor constraint` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `regcourse`
--
ALTER TABLE `regcourse`
  ADD CONSTRAINT `constrain course nameee` FOREIGN KEY (`course_name`) REFERENCES `assign` (`course_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inss` FOREIGN KEY (`instructorname`) REFERENCES `assign` (`instructor_name`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
