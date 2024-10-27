const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
// display count of item's available
exports.getAllInfo = asyncHandler(async (req, res) => {
  const allCount = await db.getAllCount();
  console.log(allCount);
  res.render("index", {
    title: "Anime Catalog HOME",
    totalCount: allCount,
  });
});

// display all catalog data with links
exports.getCatalog = asyncHandler(async (req, res) => {
  res.render("catalog", { title: "Anime Catalog" });
});

// display all animes
exports.getAllAnimes = asyncHandler(async (req, res) => {
  const allAnime = await db.getAllAnime();
  res.render("animeList", {
    title: "Anime List",
    animeList: allAnime,
  });
});

// display all authors
exports.getAllAuthors = asyncHandler(async (req, res) => {
  const allAuthor = await db.getAllAuthor();
  res.render("authorList", {
    title: "Author List",
    authorList: allAuthor,
  });
});

// display all genre's
exports.getAllGenres = asyncHandler(async (req, res) => {
  const allGenre = await db.getAllGenre();
  res.render("genreList", {
    title: "Genre List",
    genreList: allGenre,
  });
});

// display single anime
exports.getAnime = asyncHandler(async (req, res) => {
  const animeData = await db.getAnimeData(req.params.id);
  res.render("animeInfo", {
    title: "Anime info",
    animeInfo: animeData,
  });
  console.log(animeData)
});

// display single author
exports.getAuthor = asyncHandler(async (req, res) => {
  const authorData = await db.getAuthorData(req.params.id);
  res.render("authorInfo", {
    title: "Author Info",
    authorInfo: authorData,
  });
  
});

// display single genre
exports.getGenre = asyncHandler(async (req, res) => {
  const genreData = await db.getGenreData(req.params.id);
  res.render("genreInfo", {
    title: "Genre Info",
    genreInfo: genreData,
  });
});

// get request to display create anime form
exports.getCreateNewAnime = asyncHandler(async (req, res) => {
  const allAuthor = await db.getAllAuthor();
  const allGenre = await db.getAllGenre();

  res.render("createAnime", {
    title: "Add new Anime",
    authorList: allAuthor,
    genreList: allGenre,
    errors: []
  });
});

// get request to display create author form
exports.getCreateNewAuthor = asyncHandler(async (req, res) => {
  res.render("createAuthor", {
     title: "Add new Anime",
     errors: []
  });
});
// get request to display create genre form
exports.getCreateNewGenre = asyncHandler(async (req, res) => {
  res.render("createGenre", {
    title: "Add new Genre",
    errors: []
 });
});

// post request for creating new anime
exports.postCreateAnime = [
  body("animeName")
    .trim()
    .notEmpty()
    .withMessage("Anime Name Cannot be empty.")
    .isLength({ min: 2, max: 30 })
    .escape(),

  body("animeDescription")
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ min: 20, })
    .escape(),

  body("authorId")
    .trim()
    .notEmpty()
    .withMessage("author cannot be empty")
    .isInt()
    .escape(),

  body("genre").trim().notEmpty().withMessage("Genre cannot be empty").escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const allAuthor = await db.getAllAuthor();
      const allGenre = await db.getAllGenre();
      return res.render("createAnime", {
        title: "Create new Anime",
        authorList: allAuthor,
        genreList: allGenre,
        errors: errors.array(),
      });
    } else {
      const anime = req.body.animeName;
      const description = req.body.animeDescription;
      const authorId = parseInt(req.body.authorId, 10);
      const genre = Array.isArray(req.body.genre) ? req.body.genre : [req.body.genre];
      console.log(genre);
      try {
        const existingAnime =  await db.getAnimeByName(anime);
        if(existingAnime) {
          const allAuthor = await db.getAllAuthor();
          const allGenre = await db.getAllGenre();
          return res.render("createAnime", {
            title: "Create new Anime",
            authorList: allAuthor,
            genreList: allGenre,
            errors:[{msg: "Anime with this name already exists."}]
          })
        
        }else {
            // create new anime
            const result = await db.createNewAnime(anime, description, authorId);
            console.log(result);
            if(result) {
              for(const genreId of genre) {
                await db.insertIntoGenreAnime(parseInt(genreId, 10),result.id)
              }
              return res.redirect(`/catalog/anime/${result.id}`)
            }else {
              return res.json({ message: "Anime ID not found" });
            }
        }
      } catch(error) {
        console.error("Transaction failed", error);
      }
      }
  }),
];

// post request for creating new Author

exports.postCreateAuthor = [
  body("authorName")
    .trim()
    .notEmpty()
    .withMessage("Anime Name Cannot be empty.")
    .isLength({ min: 2, max: 30 })
    .escape(),


    asyncHandler(async( req, res ) => {
      const errors = validationResult(req);
      const authorName = req.body.authorName;
      if(!errors.isEmpty) {
        return res.render("createAuthor", {
          title: "Create Author",
          error: errors.array(),
        })
      } else {
        
        const existingAuthor = await db.getAuthorByName(authorName);
        if(existingAuthor) {
          res.render("createAuthor" ,{
            title: "Create Author ",
            errors:[{msg: "Author with this name already exists."}]
          })
        }else {
          const addAuthor = await db.createNewAuthor(authorName);
          res.redirect("/catalog/author");
        }
      }
    }),
]

// post request for creating new genre
exports.postCreateAuthor = [
  body("genreName")
    .trim()
    .notEmpty()
    .withMessage("genre Cannot be empty.")
    .isLength({ min: 2, max: 30 })
    .escape(),


    asyncHandler(async( req, res ) => {
      const errors = validationResult(req);
      const genreName = req.body.genreName;
      const genreDescription = req.body.genreDescription;
      if(!errors.isEmpty) {
        return res.render("createGenre", {
          title: "Add Genre",
          error: errors.array(),
        })
      } else {
        
        const existingGenre = await db.getGenreByName(genreName);
        if(existingGenre) {
          res.render("createGenre" ,{
            title: "Add Genre ",
            errors:[{msg: "Genre with this name already exists."}]
          })
        }else {
          const addGenre = await db.createNewGenre(genreName, genreDescription);
          res.redirect("/catalog/genre");
        }
      }
    }),
]

// get request for deleting anime
exports.getDeleteAnime = asyncHandler(async (req, res) => {
const id = req.params.id
res.send(`Deleting ${id} anime`) 
})

// get request for deleting author
exports.getDeleteAuthor = asyncHandler(async (req, res) => {
const id = req.params.id
res.send(`Deleting ${id} author`) 
})

// get request for deleting anime
exports.getDeleteAuthor = asyncHandler(async (req, res) => {
const id = req.params.id
res.send(`Deleting ${id} genre`) 
})