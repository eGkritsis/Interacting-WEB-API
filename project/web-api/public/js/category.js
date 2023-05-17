function fetchProducts() {
	let params = new URLSearchParams(window.location.search);
	let categoryId = params.get('categoryId');
    let base_url = 'http://127.0.0.1:5000/https://wiki-shop.onrender.com/categories/';
    let url = base_url + categoryId + '/products/';

    fetch(url, {
      method: 'GET',
    }).then(response => {
      	if (response.status >= 200 && response.status < 300) {
        	return response.json();
      	} else {
        	console.log("error");
      	}
    }).then(products => {
		// Compile the Handlebars template
        const template = Handlebars.compile(
            document.getElementById('product-template').innerHTML
        );
        // Render the template with the fetched categories
        const html = template({products});
        // Insert the rendered HTML into the page
        document.getElementById('products').innerHTML = html;

    }).catch(error => {
        console.log(error);
    });
}

function fetchSubcategories() {
    let params = new URLSearchParams(window.location.search);
	let categoryId = params.get('categoryId');
    let base_url = 'http://127.0.0.1:5000/https://wiki-shop.onrender.com/categories/';
    let url = base_url + categoryId + '/subcategories/';

    fetch(url, {
      method: 'GET',
    }).then(response => {
      	if (response.status >= 200 && response.status < 300) {
        	return response.json();
      	} else {
        	console.log("error");
      	}
    }).then(subcategories => {
		// Compile the Handlebars template
        const template = Handlebars.compile(
            document.getElementById('filter-template').innerHTML
        );
        // Render the template with the fetched categories
        const html = template({subcategories});
        // Insert the rendered HTML into the page
        document.getElementById('filter-radio').innerHTML = html;
    }).catch(error => {
        console.log(error);
    });
}

function filterProducts(value) {

	console.log("Inside filterProducts");
	// Get the currently displayed products
	const displayedProducts = document.querySelectorAll('.product');

	// Check if there are any products on the page
	if (displayedProducts.length === 0) {
		console.error('No product elements found on the page');
		return;
	} 

	// Hide all products
	displayedProducts.forEach(product => product.style.display = 'none');

	if (value === 'all') {
		displayedProducts.forEach(product => product.style.display = 'block');
	} else {
		displayedProducts.forEach(product => {
			if (product.dataset.subcategory_id === value) {
				product.style.display = 'block';
			}
		})
	}
}

const form = document.getElementById('login-form');
form.addEventListener('submit', LS);


let sessionId = null;
let globalUsername = null;

// Login Service - LS
function LS(event) {
	console.log("Inside LS");
	// Prevent the default form submission behavior
	event.preventDefault();
	
	const formData = new FormData(form);
	const username = formData.get('username');
	const password = formData.get('password');
	console.log("Credentials received: ", username, password);

	// Send a POST request to the '/LoginService' route
	fetch('http://127.0.0.1:8080/LoginService', {
		method: 'POST',
		body: JSON.stringify({ username, password }),
		headers: {
			'Content-Type': 'application/json',
			 Accept: "application/json",
		}
	})
	.then(response => {
		if (response.status >= 200 && response.status < 300) {
			return response.json();
		} else {
			throw new Error('Failed to login');
		}
	})
	.then(data => {
		// Logs the sessionId e.g. { sessionId: "7b3e2313-8553-4cba-88d3-7d3dfd9020b0" }
		console.log(data); 
		sessionId = data.sessionId;
		globalUsername = formData.get('username');

		// Display a successful login message
		const messageSection = document.getElementById('message');
		// Success message displayed in green
		messageSection.style.color = 'darkgreen';
		messageSection.innerHTML = 'Successful login';
		messageSection.classList.add('success');
	}).catch(error => {
		console.log(error);

		// Display a failed login message
		const messageSection = document.getElementById('message');
		// Success message displayed in red
		messageSection.style.color = 'red';
		messageSection.innerHTML = 'Failed to login';
		messageSection.classList.add('error');
	});
}

// Cart Item Service - CIS
function CIS(event, productElement) {
	console.log("Inside CIS");
	// Prevent the default form submission behavior
	event.preventDefault();

	// Retrieve product's information
	const image = productElement.querySelector("#product-image").getAttribute('data-value');
	const title = productElement.querySelector("#product-title").dataset.value;
	const productId = productElement.querySelector("#product-id").dataset.value;
	const subcategoryId = productElement.querySelector("#product-subcategory").dataset.value;
	const description = productElement.querySelector("#product-description").dataset.value;
	const cost = productElement.querySelector("#product-cost").dataset.value;
	
	// Send a POST request to the '/CIS' route
	fetch('http://127.0.0.1:8080/CIS', {
		method: 'POST',
		// ** TODO: Add username + sessionId to the request body **
		body: JSON.stringify({ sessionId, globalUsername, productId, title, subcategoryId, description, cost, image }), // + sessionId + username 
		headers: {
			'Content-Type': 'application/json',
			 Accept: 'application/json',
		}
	})
	.then(response => {
		if (response.status >= 200 && response.status < 300) {
			return response.json();
		} else {
			throw new Error('Failed to add product to Cart' + response.statusText);
		}
	})
	.then(data => {
		// Logs 
		console.log(data); 

		// Display a successful login message
		const messageSection = document.getElementById('cart-msg');

		messageSection.innerHTML = 'Product added to your Cart!';
		messageSection.style.visibility = ("visible");
		messageSection.style.opacity = ("1");
		// Update the cart size
		CSS();
		messageSection.classList.add('success');
		// Fade out the message after 2 seconds
		setTimeout(() => {
			messageSection.style.opacity = ("0");
		}, 1500)

		setTimeout(() => {
			messageSection.style.visibility = ("0");
			messageSection.innerHTML = '';
		}, 2000)		
	}).catch(error => {
		console.log(error);

		// Display a failed login message
		const messageSection = document.getElementById('cart-msg');

		if (sessionId === null){
			//This means the purchase failed because the user has not logged-in yet.
			messageSection.innerHTML = 'You must log-in first';
		}else{
			//This means that some other error has occurred, so we display a more
			//generic message. 
			messageSection.innerHTML = 'Failed to add product to your Cart';
		}
		
		messageSection.style.visibility = ("visible");
		messageSection.style.opacity = ("1");
		messageSection.classList.add('error');
		// Fade out the message after 2 seconds
		setTimeout(() => {
			messageSection.style.opacity = ("0");
		}, 1500)

		setTimeout(() => {
			messageSection.style.visibility = ("0");
			messageSection.innerHTML = '';
		}, 2000)	
	});
}

// Cart Size Service - CSS
function CSS() {
	console.log("Inside CSS");
	
	// Send a POST request to the '/CSS' route
	fetch('http://127.0.0.1:8080/CSS', {
		method: 'POST',

		body: JSON.stringify({ sessionId, globalUsername}), // + sessionId + username 
		headers: {
			'Content-Type': 'application/json',
			 Accept: 'application/json',
		}
	})
	.then(response => {
		// Check if everything went smoothly
		if (response.status >= 200 && response.status < 300) {
			return response.json();
		} else {
			throw new Error('Cart size could not be retrieved' + response.statusText);
		}
	})
	.then(data => {
		// If everything went OK, update the cart size.
		const cartSize = document.getElementById("cart-count");
		cartSize.innerHTML = data.size;
	})
	.catch((error) => {
		console.error(error);
	});
}


// Triggered upon clicking the cart icon
function retrieveCart() {
	// Add user & session info to the url & redirect to cart
	window.location.href = '/cart.html?username=' + globalUsername + '&sessionId=' + sessionId ;
}

fetchSubcategories();
fetchProducts();