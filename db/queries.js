const pool = require("./pool");

async function getAllCount() {
  try {
    const [authorCountResult, animeCountResult, genreCountResult] =
      await Promise.all([
        pool.query("SELECT COUNT(AuthorName) AS author_count FROM Author"),
        pool.query("SELECT COUNT(AnimeName) AS anime_count FROM Anime"),
        pool.query("SELECT COUNT(GenreName)AS genre_count FROM Genre"),
      ]);
    const authorCount = parseInt(authorCountResult.rows[0].author_count, 10);
    const animeCount = parseInt(animeCountResult.rows[0].anime_count, 10);
    const genreCount = parseInt(genreCountResult.rows[0].genre_count, 10);

    return [
      { entity: "Author", count: authorCount },
      { entity: "Anime", count: animeCount },
      { entity: "Genre", count: genreCount },
    ];
  } catch (error) {
    console.error("Error Fetching counts:", error);
    throw error;
  }
}

async function getAllAnime(){
    try{
        const { rows } = await pool.query("SELECT id, AnimeName AS Anime FROM Anime ")
        return rows;
    }catch(error) {
        console.error("Error while Getting results: ", error)
    }
}
async function getAllAuthor(){
    try{
        const { rows } = await pool.query('SELECT  Author_ID, AuthorName AS Author FROM Author ')
        return rows;
    }catch(error) {
        console.error("Error while Getting results: ", error)
    }
}

async function getAllGenre(){
    try{
        const { rows } = await pool.query("SELECT id, GenreName AS Genre FROM Genre ")
        return rows;
    }catch(error) {
        console.error("Error while Getting results: ", error)
    }
}


async function getAnimeData(id){
    try{
        const query = "SELECT Anime.id AS AnimeID, AnimeName AS Anime, Author.AuthorName AS Author, Anime.Description AS Summary, STRING_AGG(Genre.GenreName, ',') AS Genre FROM Anime JOIN Author ON Anime.Author_ID = Author.Author_ID JOIN GenreOfAnime ON Anime.id = GenreOfAnime.AnimeID JOIN Genre ON Genre.id = GenreOfAnime.GenreID WHERE Anime.id = $1 GROUP BY Anime.id, Anime.AnimeName, Author.AuthorName, Anime.Description"
        const { rows } = await pool.query(query, [id])
        return rows;
    }catch(error) {
        console.error("Error while Getting results: ", error)
    }
}

async function getAnimeByName(name) {
  try {
    const query = "SELECT * FROM Anime WHERE AnimeName = $1"
    const { rows } = await pool.query(query, [name]);
    return rows.length > 0 ? rows[0] : null ;
  } catch (error) {
    console.error("Error while checking for existing anime:" , error)
    throw error
  }
}

async function getAuthorData(id) {
  try {
    const authorQuery =
      "SELECT Author_ID, AuthorName AS Author FROM Author WHERE Author_ID = $1";
    const animeQuery =
      "SELECT id, AnimeName AS Anime FROM Anime WHERE Author_ID = $1";
    const [result1, result2] = await Promise.all([
      pool.query(authorQuery, [id]),
      pool.query(animeQuery, [id]),
    ]);
    const authorData = result1.rows;
    const animeData = result2.rows;
    return { authorData, animeData};
  } catch (error) {
    console.error("Error While Getting Results:", error);
  }
}

async function getAuthorByName(name) {
  try {
    const query = "SELECT * FROM Author WHERE AuthorName = $1";
    const { rows } = await pool.query(query, [name]);
    return rows.length > 0 ? rows[0] : null ;
  } catch (error) {
    console.error("Error while retrieving Author name", error)
    throw error;
    
  }
}

async function getGenreData(id) {
  try {
    const genreQuery =
      "SELECT id, GenreName AS Genre, Description FROM Genre WHERE id = $1";
    const animeQuery =
      "SELECT Anime.id AS id, AnimeName AS Anime FROM Anime JOIN GenreOfAnime ON Anime.id = GenreOfAnime.AnimeID JOIN Genre ON Genre.id = GenreOfAnime.GenreID WHERE Genre.id = $1";
    const [result1, result2] = await Promise.all([
      pool.query(genreQuery, [id]),
      pool.query(animeQuery, [id]),
    ]);
    const genreData = result1.rows;
    const animeData = result2.rows;
    return {
      genreData,
      animeData,
    };
  } catch (error) {
    console.error("Error While Getting Results:", error);
  }
}

async function getGenreByName(name) {
  try {
    const query = "SELECT * FROM Genre WHERE GenreName = $1";
    const { rows } = await pool.query(query, [name]);
    return rows.length > 0 ? rows[0] : null ;
  } catch (error) {
    console.error("Error while retrieving Genre name", error)
    throw error;
    
  }
}
// queries for getting id's
// async function getAnimeId(name) {
//   try {
//     const query = "SELECT id FROM Anime Where AnimeName = '$1'"
//     const { rows } = pool.query(query, [name])
//     console.log("rows:",rows);
//     if(rows.length > 0) {
//       return rows[0];
//     }else {
//       return null;
//     }
   
//   } catch (error) {
//     console.log(error)
//     return false;
//   }
  
  
// }



async function createNewAnime(name,description,authId) {
  try {
    const query = "INSERT INTO Anime (AnimeName, Description, Author_ID) VALUES($1, $2, $3) RETURNING id"
    const { rows } = await pool.query(query, [name,description,authId])
    console.log(rows[0])
    return rows[0];
  } catch (error) {
    console.error("Error While adding data:", error);
    return null;
  } 
}

async function createNewAuthor(name) {
  try {
    const query = "INSERT INTO Author (AuthorName) VALUES($1)"
    const { rows } = await pool.query(query, [name])
    return true
  } catch (error) {
    console.error("Error While adding data:", error);
    return null;
  } 
}
async function createNewGenre(name,  description) {
  try {
    const query = "INSERT INTO Genre (GenreName, Description) VALUES($1, $2)"
    const { rows } = await pool.query(query, [name, description])
    return true
  } catch (error) {
    console.error("Error While adding data:", error);
    return null;
  } 
}

async function insertIntoGenreAnime (genreId, animeId) {
  try {
    const query = "INSERT INTO GenreOfAnime(GenreID, AnimeID) VALUES ($1, $2) ";
    await pool.query(query, [genreId, animeId])
    return true;
  } catch (error) {
    console.error("Error While adding data:", error)
  }
}

module.exports = {
  getAllCount,
  getAllAnime,
  getAllAuthor,
  getAllGenre,
  getAnimeData,
  getAnimeByName,
  getAuthorData,
  getAuthorByName,
  getGenreData,
  getGenreByName,
  createNewAnime,
  createNewAuthor,
  createNewGenre,
  insertIntoGenreAnime
};
