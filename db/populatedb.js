#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS Author (
  Author_ID INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  AuthorName VARCHAR ( 255 ) NOT NULL
);
  
CREATE TABLE IF NOT EXISTS Anime (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  AnimeName VARCHAR ( 255 ) NOT NULL,
  Description TEXT NOT NULL,
  Author_ID INTEGER,
  FOREIGN KEY (Author_ID) REFERENCES Author(Author_ID)  
);
CREATE TABLE IF NOT EXISTS Genre (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  GenreName VARCHAR ( 255 ) NOT NULL,
  Description TEXT NOT NULL 
);

CREATE TABLE GenreOfAnime (
GenreID INT,
AnimeID INT,
PRIMARY KEY (GenreID, AnimeID),
FOREIGN KEY (AnimeID) REFERENCES Anime(id),
FOREIGN KEY (GenreID) REFERENCES Genre(id)
);

INSERT INTO Author (AuthorName) 
VALUES
  ('Fujiko Fujio'),
  ('Osamu Tezuka'),
  ('Takao Aoki');

INSERT INTO Anime (AnimeName, Description, Author_ID ) 
VALUES
('Astro Boy', 'The story follows Astro Boy, an android young boy with human emotions who is created by Umataro Tenma after the recent death of his son Tobio. Eventually, Astro is sold to a robot circus run by Hamegg, but is saved from his servitude by Professor Ochanomizu. Astro becomes a surrogate son to,Ochanomizu who creates a robotic family for Astro and helps him to live a normal life like an average human boy, while accompanying him on adventures.', 2),
  ('Doraemon', 'The misadventures of Doraemon, a robot cat from the future, who with his gadgets, is sent back in time to help make Nobita Nobi, a boy without much talent, a better person.', 1),
  ('Beyblade', 'The story follows the adventure of a team, the Bladebreakers, who try to win the world beyblade championship, consisting of a spinning tops sport phenomenon. The tops, called beyblades, may hold bit-beasts inside, ancient sacred beasts that can boost their power and ability.', 3);

  INSERT INTO Genre(GenreName, Description) VALUES (
 'Action', ' Action anime is all about fast-paced, adrenaline-fueled action scenes. It features high-stakes battles, dynamic fight scenes, and exciting chases' ),

  INSERT INTO GenreOfAnime(GenreID, AnimeID) VALUES
  (3,4),
  (2,4),
  (2,5);

  SELECT AnimeName AS Anime, GenreName AS Genre FROM Anime JOIN GenreOfAnime ON Anime.id = genreOfAnime.AnimeID JOIN Genre ON GenreOfAnime.GenreID  = Genre.id;


`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: "postgresql://'pacifist-ram':mydb@localhost:5432/top_users",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
