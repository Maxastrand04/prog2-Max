-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 24 maj 2023 kl 09:39
-- Serverversion: 10.4.27-MariaDB
-- PHP-version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `reservationer restaurang`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `reservationer`
--

CREATE TABLE `reservationer` (
  `Id` int(11) NOT NULL,
  `Efternamn` varchar(50) NOT NULL,
  `Tid` time NOT NULL,
  `Antal` int(2) NOT NULL,
  `Veckodag` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `reservationer`
--

INSERT INTO `reservationer` (`Id`, `Efternamn`, `Tid`, `Antal`, `Veckodag`) VALUES
(1, 'Åstrand', '11:00:00', 6, 'Måndag'),
(2, 'Ladhe', '13:00:00', 5, 'Tisdag');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
