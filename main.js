const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const hbs = require("hbs");
const prisma = new PrismaClient();
const path = require("path");
const PORT = 3005;
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "Views"));

app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', async (req, res) => {
    try{
        const games = await prisma.game.findMany({
            where: {priority : true}}); 
        res.json(games);
    }
     catch (error) {
        console.error("Error fetching games:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
});

app.get('/games/', async (req, res) => {
    try {
        const games = await prisma.game.findMany(); 
        res.json(games);
    } catch (error) {
        console.error("Error fetching games:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get('/games/:id', async (req, res) => {
    const { id } = req.params;
try{
    const ThisGame = await prisma.game.findUnique({
        where: { id: parseInt(id) }
    });
    if (!ThisGame) {
        return res.status(404).json({ error: "Game not found" });
    }
    else
    {
        res.json(ThisGame);
    }
}
catch
{
    console.error("Error fetching game with id:", id);
    res.status(404).json({ error: "Game not found" });
}});


app.get('/CreateGame',(req, res) => {
    res.render("CreateGame");
});

//app.post('/CreateGame', async (req, res) => {
//    try {
//        const { title, description, price, priority } = req.body;
//        const newGame = await prisma.game.create({
//            data: { title, description, price, priority },
//        });
//        res.json(newGame);
//    } catch (error) {
//        console.error("Error creating game:", error);
//        res.status(500).json({ error: "Internal Server Error" });
//    }
//});

app.post('/CreateGame', async (req, res) => {
    try {
        const { title, description, date, priority } = req.body;
        
        // Convert priority to boolean
        const isPriority = priority === "on"; // Checkbox returns "on" if checked

        const newGame = await prisma.game.create({
            data: {
                title,
                description,
                releaseDate: new Date(date), // Ensure `date` is properly formatted
                priority: isPriority,
            },
        });

        res.redirect('/'); // Redirect to home or game list after success
    } catch (error) {
        console.error("Error creating game:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
