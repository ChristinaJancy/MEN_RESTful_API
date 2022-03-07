const router = require("express").Router();
const game = require("../models/game");
const { verifyToken } = require("../validation");

// Create new game 
router.post("/", verifyToken, (req, res) => {
    //router.post("/", (req, res) => {
    const data = req.body;
    game.insertMany(data)
        .then(data => { res.status(201).send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

router.get("/", (req, res) => {
    //advanced query by name 
    const name = req.query.name;

    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
    game.find(condition)
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

// Retrieve games based on stock 
router.get("/instock", verifyToken, (req, res) => {
    game.find({ inStock: true })
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err }); })
});

router.get("/:id", (req, res) => {
    game.findById(req.params.id)
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

// Update game using id
router.put("/:id", verifyToken, (req, res) => {
    //router.put("/:id", (req, res) => { 
    const id = req.params.id;

    game.findByIdAndUpdate(id, req.body)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Cannot update game with id=" + id + ". Maybe game was not found!" });
            else
                res.send({ message: "game was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating game with id=" + id });
        });

});

// Delete game using id
//router.delete("/:id", (req, res) => {
router.delete("/:id", verifyToken, (req, res) => {
    const id = req.params.id;

    game.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Movie with id=${id}. Maybe game was not found!`
                });
            }
            else { res.send({ message: "game was deleted successfully!" }); }
        })
        .catch(err => {
            res.status(500).send({ message: "Could not delete game with id=" + id });
        });
});

module.exports = router;