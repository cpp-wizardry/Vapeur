const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path"); 
const {hbs} = require("hbs");
const app = express();
const PORT = 3005;
const prisma = new PrismaClient();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.set("view engine", "hbs"); 
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


app.get("/", async (req, res) => {
    const GamesPriority = await prisma.Game.findMany({
        where: { priority: true}
    }); 
    res.render("landing",{GamesPriority});
});

app.post("/GamesView/:id/Priority", async (req, res)=>{
    const id = parseInt(req.params.id)
    try{
        const game = await prisma.Game.update({
            where: {id: id},
            data : {priority: true}    
        });
        res.redirect("/");}
    catch(error){
        res.status(500).send("internal server error: there was an error with the forwarding of the game");
    }
});


app.post("/GamesView/:id/noPriority", async (req, res)=>{
    const param = parseInt(req.params.id)
    try{
        const game = await prisma.Game.update({
            where: {id: param},
            data : {priority: false}      
        });
        res.redirect("/");    
    }
    catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

app.get("/GamesView", async (req, res) => {
    const Games = await prisma.Game.findMany({
        orderBy: { title: 'asc' } 
    });
    res.render("GamesView/index", { Games });
});

app.get("/Genres", async (req,res)=> { 
    const genres = await prisma.Genre.findMany();
    res.render("Genres/index", {genres}); 
});

app.get("/Publishers", async (req,res)=> { 
    const Publishers = await prisma.Publisher.findMany(); 
    res.render("Publishers/index", {Publishers}); 
});

app.get("/GamesView/Create", async (req, res) => {
    const genres = await prisma.Genre.findMany();
    const Publishers = await prisma.Publisher.findMany();
    res.render("GamesView/CreateGame", { genres, Publishers });
    
});


app.post("/GamesView/Create", async (req, res) => {
    const { title, description, releaseDate, genreId, PublisherId } = req.body;
    try {
        await prisma.Game.create({
            data: {
                title,
                description,
                releaseDate: new Date(releaseDate),
                genreId: parseInt(genreId),
                PublisherId: parseInt(PublisherId),
            }
        });
        res.redirect("/");
        alert("game created successfully");
    } 
    catch (error) {
        console.error(error);
        res.status(500).send("internal server error: error during game creation");
    }
});



app.get("/GamesView/:id/edit", async (req, res) => {
    const gameId = parseInt(req.params.id); 
    try {
        const game = await prisma.Game.findUnique({
            where: { id: gameId },
        });

        if (!game) {
            return res.status(404).send("error the game has not been found");
        }
        const genres = await prisma.Genre.findMany();
        const Publishers = await prisma.Publisher.findMany();
        res.render("GamesView/EditGame", { game, genres, Publishers });
    } 
    catch (error) {
        res.status(500).send("internal server error");
    }
});

app.post("/GamesView/:id/edit", async (req, res) => {
    const gameId = parseInt(req.params.id); 
    const { title, description, releaseDate, genreId, PublisherId } = req.body;

    try {
        await prisma.Game.update({
            where: { id: gameId },
            data: {
                title: title.trim(),
                description: description.trim(),
                releaseDate: new Date(releaseDate),
                genreId: parseInt(genreId),
                PublisherId: parseInt(PublisherId),
            }
        });

        res.redirect("/Games");
        alert("Games was updated successfully");
    } 
    catch (error) {
        res.status(500).send("internal server error: couldn't update the game");
    }
});


app.get("/Publishers/CreatePublisher", (req, res) => {
    res.render("Publishers/CreatePublisher"); 
});

app.post("/Publishers/CreatePublisher", async (req, res) => {
    const { name } = req.body;

    try {
        await prisma.Publisher.create({
            data: { name },
        });

        res.redirect("/Publishers");
        alert("Publisher created successfully");
    } catch (err) {
        res.status(500).send("internal server error: couldn't create the publisher");
    }
});



app.get("/Publishers/:id/EditPublisher", async (req, res) => {
    const PublisherId = parseInt(req.params.id);

    try {
        const Publisher = await prisma.Publisher.findUnique({
            where: { id: PublisherId },
        });

        if (!Publisher) {
            return res.status(404).send("publisher is not valid");
        }

        res.render("Publishers/EditPublisher", { Publisher });
    } catch (error) {
        res.status(500).send("internal server error");
    }
});

app.post("/Publishers/:id/EditPublisher", async (req, res) => {
    const PublisherId = parseInt(req.params.id);
    const { name } = req.body;

    try {  
        await prisma.Publisher.update({
            where: { id: PublisherId },
            data: {
                name: name,
            },
        });

        res.redirect("/Publishers");
        alert("Publisher was updated successfully");
    } catch (error) {
        res.status(500).send("internal servver error: couldn't update the publisher");
    }
});


app.get("/GamesView/:id/GamesDetails", async (req, res) => {
    const id = parseInt(req.params.id); 

    const game = await prisma.Game.findUnique({ 
        where: { id },
        include: { 
            genre: true,  
            Publisher: true 
        }
    });   
    if (!game) {
        return res.status(404).send("Game not found"); 
    }
    
    res.render("GamesView/GamesDetails", { game });
});

app.post("/GamesView/:id/delete", async (req, res) => {
    try {
        const id = parseInt(req.params.id); 

        await prisma.Game.delete({
            where: { id }
        });
        res.redirect("/");
        alert("Game deleted successfully");

    } catch (error) {
        res.status(500).send("internal server error: couldn't delete the game");
    }
});



app.get("/Genres/:id/gameByGenre", async (req,res)=> { 
    const id = parseInt(req.params.id);
    const game = await prisma.Game.findMany({where: {genreId: id }});
    res.render("Genres/index", {game});
})

app.get("/Publishers/:id/gameByPublisher", async (req,res)=> {
    const id = parseInt(req.params.id);
    const game = await prisma.Game.findMany({where: {PublisherId: id}}); 
    res.render("Publishers/index", {game});
})


app.post("/Publishers/:id/delete", async (req, res) => {
    try {
        const id = parseInt(req.params.id); 

        await prisma.Publisher.delete({
            where: { id }
        });

        res.redirect("/Publishers"); 
        alert("Publisher deleted successfully")
    }
     catch (error) {
        res.status(500).send("internal server error: couldn't delete the publisher or update the games");
    }
});

