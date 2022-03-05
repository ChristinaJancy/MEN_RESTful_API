const router = require("express").Router();
const product = require("../models/product");
const { verifyToken} = require("../validation");

// CRUD operations for products 

// CREATE product (post) - /api/products 
router.post("/", verifyToken, (req, res) => {
    data = req.body;
    product.insertMany(data)
        .then(data => { res.send(data) })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
});

// READ all products (get)  - /api/products
router.get("/", (req, res) => {
    product.find()
        .then(data => {
            // the mapArray function is used to map the data to the required format
            // see function bottom of this file
            res.send(mapArrayProducts(data))

        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
});


//READ all products in stock (get)  - /api/products/inStock:status
//:status checks if the product is in stock using true/false
router.get("/instock/:status", (req, res) => {
    product.find({ inStock: req.params.status })
        .then(data => {
            res.send(mapArrayInStock(data))
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
});

//Read specific product based on id (get) - /api/products/:id
router.get("/:id", (req, res) => {
    product.findById(req.params.id)
        .then(data => { res.send(data) })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
});

// UPDATE specific product (put) - /api/products/:id 
router.put("/:id", (req, res) => {

    const id = req.params.id;
    product.findByIdAndUpdate(id, req.body)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Cannot update product with id=" + id + ". Maybe the product was not found!" });
            }
            else {
                res.send({ message: "Product was successfully updated." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating product with id=" + id })
        })
});

// Delete specific product (delete)-  /api/products/:id 
router.delete("/:id", (req, res) => {

    const id = req.params.id;
    product.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Cannot delete product with id=" + id + ". Maybe the product was not found!" });
            }
            else {
                res.send({ message: "Product was successfully deleted." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error deleting product with id=" + id })
        })
});

router.get("/price/:operator/:price", (req, res) => {

    const operator = req.params.operator;
    const price = req.params.price;
    let filterExpr = {};

    if (operator === "gt") {
        filterExpr = { $gt: req.params.price };
    }
    else if (operator === "gte") {
        filterExpr = { $gte: req.params.price };
    }
    else if (operator === "lt") {
        filterExpr = { $lt: req.params.price };
    }
    else if (operator === "lte") {
        filterExpr = { $lte: req.params.price };
    }

    product.find({ price: filterExpr })

        .then(data => { res.send(data) })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
})

// Function to map the data to the required format
function mapArrayInStock(arr) {
    let outputArray = arr.map(
        element => {
            return {
                id: element._id,
                name: element.name,
                description: element.description,
                price: element.price,
                //link url
                uri: `http://localhost:4000/api/products/${element._id}`
            }
        }
    )
    return outputArray;
}

function mapArrayProducts(arr) {
    let outputArray = arr.map(
        element => {
            return {
                id: element._id,
                name: element.name,
                description: element.description,
                price: element.price,
                inStock: element.inStock,
                //link url
                uri: `http://localhost:4000/api/products/${element._id}`
            }
        }
    )
    return outputArray;
}



module.exports = router;