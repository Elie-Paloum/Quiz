-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Jun 22, 2025 at 02:08 PM
-- Server version: 10.9.8-MariaDB-1:10.9.8+maria~ubu2204
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `basetest`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `id` int(11) NOT NULL,
  `historian_id` int(11) DEFAULT NULL,
  `text` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`id`, `historian_id`, `text`) VALUES
(1, 1, 'Wrote the first algorithm intended to be processed by a machine'),
(2, 1, 'Recognized the potential of computers beyond pure calculation'),
(3, 1, 'Published detailed notes on the Analytical Engine'),
(4, 1, 'Considered the first computer programmer'),
(5, 2, 'Developed the Turing machine concept'),
(6, 2, 'Led the team that broke the Enigma code during WWII'),
(7, 2, 'Created the Turing Test for artificial intelligence'),
(8, 2, 'Made fundamental contributions to computer science theory'),
(9, 3, 'Developed the first compiler for a computer programming language'),
(10, 3, 'Created COBOL, one of the first high-level programming languages'),
(11, 3, 'Coined the term \'debugging\''),
(12, 3, 'Pioneered the concept of machine-independent programming languages'),
(13, 4, 'Invented the World Wide Web'),
(14, 4, 'Created the first web browser and editor'),
(15, 4, 'Founded the World Wide Web Consortium (W3C)'),
(16, 4, 'Developed the first web server');

-- --------------------------------------------------------

--
-- Table structure for table `historians`
--

CREATE TABLE `historians` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `birth_death` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `historians`
--

INSERT INTO `historians` (`id`, `name`, `image`, `role`, `description`, `birth_death`) VALUES
(1, 'Ada Lovelace', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Ada_Byron_daguerreotype_by_Antoine_Claudet_1843_or_1850.jpg', 'First Computer Programmer', 'Ada Lovelace was an English mathematician and writer, chiefly known for her work on Charles Babbage\'s proposed mechanical general-purpose computer, the Analytical Engine. She was the first to recognize that the machine had applications beyond pure calculation, and published the first algorithm intended to be carried out by such a machine.', '1815-1852'),
(2, 'Alan Turing', 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg', 'Father of Computer Science', 'Alan Turing was an English mathematician, computer scientist, logician, cryptanalyst, philosopher, and theoretical biologist. He was highly influential in the development of theoretical computer science, providing a formalisation of the concepts of algorithm and computation with the Turing machine, which can be considered a model of a general-purpose computer.', '1912-1954'),
(3, 'Grace Hopper', 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg', 'Pioneer of Computer Programming', 'Grace Hopper was an American computer scientist and United States Navy rear admiral. One of the first programmers of the Harvard Mark I computer, she was a pioneer of computer programming who invented one of the first linkers. She popularized the idea of machine-independent programming languages, which led to the development of COBOL.', '1906-1992'),
(4, 'Tim Berners-Lee', 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Sir_Tim_Berners-Lee_%28cropped%29.jpg', 'Inventor of the World Wide Web', 'Sir Tim Berners-Lee is an English computer scientist best known as the inventor of the World Wide Web. He is a Professorial Fellow of Computer Science at the University of Oxford and a professor at the Massachusetts Institute of Technology. He made the first proposal for the World Wide Web in 1989 while working at CERN.', '1955-Present');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `imageurl` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `imageurl`) VALUES
(1, 'Laptop', '100', 'c-1.png'),
(2, 'Drone', '200', 'c-2.png'),
(3, 'VR', '300', 'c-3.png'),
(4, 'Tablet', '50', 'c-5.png'),
(5, 'Watch', '90', 'c-6.png'),
(6, 'Phone Covers', '20', 'c-7.png'),
(7, 'Phone', '80', 'c-8.png'),
(8, 'Laptop', '150', 'c-4.png');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `street_number` varchar(50) DEFAULT NULL,
  `street_name` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `full_address` text DEFAULT NULL,
  `accept_terms` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `dob`, `gender`, `street_number`, `street_name`, `postal_code`, `city`, `state`, `country`, `full_address`, `accept_terms`, `created_at`, `role`) VALUES
(30, 'rgwrgrwg', 'efrwgwrg', 'ewfwwef@gmail.com', '$2y$10$RPu.JSk/HwSskOYvMC7yn.LdrrBDxLyP8ygTxddwqtd8eBShokIM6', '2025-05-31', 'Other', '1', 'Lebuh Bandar Utama', '47800', 'Petaling Jaya', 'Selangor', 'Malaysia', '1 Utama Shopping Centre, Lebuh Bandar Utama, Bandar Utama, Petaling Jaya, Selangor, Malaysia', 1, '2025-06-16 12:24:01', 'user'),
(35, 'dob', 'dob', 'dob@gmail.com', '$2y$10$ElWxEvGO.IsUT5de/y1UzusfmL.CjwCw5UtitirhKCRX5DFwE6Td2', '2007-06-18', 'Other', '', '', '', '', 'Delhi', 'India', 'Delhi, India', 1, '2025-06-20 16:55:09', 'user'),
(36, 'Elie', 'Bou Zeid', 'eliebouzeidd@gmail.com', '$2y$10$3sY7q2r/3En1Ys5o0SBB1.uegRioNT8KO5ncxhPtJFppoVa0LkxSi', '2004-03-21', 'Male', '10', 'Rue des Forgettes', '76000', 'Rouen', 'Normandie', 'France', '10 Rue des Forgettes, Rouen, France', 1, '2025-06-20 22:21:53', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `historian_id` (`historian_id`);

--
-- Indexes for table `historians`
--
ALTER TABLE `historians`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `achievements`
--
ALTER TABLE `achievements`
  ADD CONSTRAINT `achievements_ibfk_1` FOREIGN KEY (`historian_id`) REFERENCES `historians` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
