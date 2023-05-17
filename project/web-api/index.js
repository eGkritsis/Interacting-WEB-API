const express = require('express');
const path = require('path');
const uuid = require('uuid');
const app = express();
const port = 8080;
const User = require('./models/user');
const Product = require('./models/product');
const activeUsers = require('./models/activeUsers');
const Cart = require('./models/cart');

app.listen(port)

/* 
    Serve static content from directory "public",
    it will be accessible under path /, 
    e.g. http://127.0.0.1:8080/index.html
*/

app.use(express.static('public'))

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }))

// parse application/json content from body
app.use(express.json())

// serve index.html as content root
app.get('/', function(req, res){

    var options = {
        root: path.join(__dirname, 'public')
    }

    res.sendFile('index.html', options, function(err){
        console.log(err)
    })
})


// Upon starting the application, a series of users with specific usernames and passwords will be automatically created 
const users = [];
const active = new activeUsers();

const user1 = new User('user1', 'password1');
const user2 = new User('user2', 'password2');
const user3 = new User('user3', 'password3');
const user4 = new User('admin', 'admin');

users.push(user1, user2, user3, user4);

// Route: /LoginService
app.post('/LoginService', (req, res) => {
	console.log("Received login service request");
	const username = req.body.username;
	const password = req.body.password;

	// Validates the input to make sure that both 'username' and 'password' are provided.
	// If either of them is missing, it returns a 400 Bad Request response with an error message.
	if (!username || !password) {
		return res.status(400).json({ error:'Invalid input' });
	}

	// Search the 'users' array for a user with matching 'username' and 'password'
	const user = users.find(user => user.username === username && user.password === password);

	if (!user) {
		// If user is not found, return 401 Unauthorized response with an error message
		return res.status(401).json({ error: "Invalid username or password" });
	} else {

		// If user is found, generate a new session ID and return 200 OK response 
		const sessionId = uuid.v4();
		
		// Make user the active user 
		active.addUser(user, sessionId);

		// Create user's cart
		let cart = new Cart();
		cart.user = user;

		return res.status(200).json({ sessionId });
	}	
})


// Route: /CIS
app.post('/CIS', (req, res) => {
	console.log("Received Cart Input Service request");
	if (active.noOneIsActive()) {
		return res.status(401).json({ error: "401 Unauthorized, Not logged in"});
	} else {

		// na xrhsimopoiithei edw h isActive(username, sessionId) aplws dn exoume perasei to username kai to sessionId

		const username = req.body.globalUsername; 
		const sessionId = req.body.sessionId; 

		if (!active.isActive(username, sessionId)) {
			return res.status(401).json({ error: "401 Unauthorized, username does not match sessionId"});
		} 

		// Create a Product instance 
		const product = new Product(req.body.productId, req.body.title, req.body.subcategoryId, req.body.description, req.body.cost, req.body.image);

		// Check if the user already has a cart in the Active object
		let cart = active.getCart();
		
		if (!cart) {
			// If not, create a new Cart instance and store it in the Active object
			let user = active.getActiveUser
			cart = new Cart(user);
			active.setCart(cart);
		}

		// Add product to user's cart
		cart.addProduct(product);
		console.log(cart.getSize());
		console.log(cart.getProducts());

		return res.status(200).json({ Response: "Product successfully added to user's cart"});
	}
})


// Route: /CSS
app.post('/CSS', (req, res) => {
	console.log("Received Cart Size Service request");
	if (active.noOneIsActive()) {
		return res.status(401).json({ error: "401 Unauthorized, Not logged in"});
	} else {
		const username = req.body.globalUsername; 
		const sessionId = req.body.sessionId; 

		if (!active.isActive(username, sessionId)) {
			return res.status(401).json({ error: "401 Unauthorized, username does not match sessionId"});
		} 

		// Check if the user already has a cart in the Active object
		let cart = active.getCart();
		cartSize = cart.getSize();
		console.log(cartSize);
		
		return res.status(200).json(cartSize);
	}
})

// Route: /CRS
app.post('/CRS', (req, res) => {
	console.log("Received Cart Retrieval Service request");
	if (active.noOneIsActive()) {
		return res.status(401).json({ error: "401 Unauthorized, Not logged in"});
	} else {
		const username = req.body.globalUsername; 
		const sessionId = req.body.sessionId; 

		console.log(username)
		console.log(sessionId)
		if (!active.isActive(username, sessionId)) {
			return res.status(401).json({ error: "401 Unauthorized, username does not match sessionId"});
		} 

		// Check if the user already has a cart in the Active object
		let cart = active.getCart();
		let products = cart.getProducts();
		console.log(products);


		// Get all the unique product ids from the cart. 
		let ids = new Set();
		for (const product of products){
			ids.add(product.getId());
			console.log(product.getId());
		}
		
		// Array of (title, cost, quantity) pairs
		let cartItems = [];

		let totalCost = 0;

		// For each id, get the count of items in the cart
		for (const id of ids.values()){
			console.log(id);
			let quantity = 0;
			let cost = 0;
			let title = null;

			for (const product of products){
				if (product.getId() == id){
					quantity += 1;
					cost = product.getCost();
					title = product.getTitle();
				}
			}

			// Add to the total price
			totalCost += cost * quantity;
			// Add to the grouped products
			cartItems.push({"title": title, "cost": cost, "quantity": quantity});
		}

		// Create the Cart Retrieval Service response.
		let crs_response = {"cartItems": cartItems, "totalCost": totalCost}
		console.log(crs_response);
		
		return res.status(200).json(crs_response);
	}
})