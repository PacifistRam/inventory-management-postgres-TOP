const { Router } = require("express");
const inventoryController = require("../controllers/inventoryController")

const inventoryRouter = Router();
// get routes to display all data
inventoryRouter.get("/", inventoryController.getAllInfo);
inventoryRouter.get("/catalog", inventoryController.getCatalog);
inventoryRouter.get("/catalog/anime", inventoryController.getAllAnimes);
inventoryRouter.get("/catalog/author", inventoryController.getAllAuthors);
inventoryRouter.get("/catalog/genre", inventoryController.getAllGenres);

// get routes for individual item
inventoryRouter.get("/catalog/anime/:id", inventoryController.getAnime);
inventoryRouter.get("/catalog/author/:id", inventoryController.getAuthor);
inventoryRouter.get("/catalog/genre/:id", inventoryController.getGenre);


// Get Routes for new data
inventoryRouter.get("/catalog/create-anime", inventoryController.getCreateNewAnime);
inventoryRouter.get("/catalog/create-author", inventoryController.getCreateNewAuthor);
inventoryRouter.get("/catalog/create-genre", inventoryController.getCreateNewGenre);

// Post Routes for new data
inventoryRouter.post("/catalog/create-anime", inventoryController.postCreateAnime);
inventoryRouter.post("/catalog/create-author", inventoryController.postCreateAuthor);
inventoryRouter.post("/catalog/create-genre", inventoryController.postCreateAuthor);

// get route for deleting data
inventoryRouter.get("/catalog/anime/:id/delete", inventoryController.getDeleteAnime);
inventoryRouter.get("/catalog/author/:id/delete", inventoryController.getDeleteAnime);
inventoryRouter.get("/catalog/genre/:id/delete", inventoryController.getDeleteAnime);

module.exports = inventoryRouter;