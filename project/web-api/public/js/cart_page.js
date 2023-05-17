function fetchUserInfo() {
	let params = new URLSearchParams(window.location.search);
	let username = params.get('username');
	let sessionId = params.get('sessionId');


}


// Cart Retrieval Service - CRS
function CRS() {
	let params = new URLSearchParams(window.location.search);
	let globalUsername = params.get('username');
	let sessionId = params.get('sessionId');

	console.log("Called CRS");
	
	// Send a POST request to the '/CSS' route
	fetch('http://127.0.0.1:8080/CRS', {
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
			// Get the response from the server and read it
			return response.json();
		} else {
			throw new Error('Cart content could not be retrieved' + response.statusText);
		}
	})
	.then(data => {
		// If everything went OK, read the cart items and total price.
		const cartItems = data.cartItems;
		const totalCost = data.totalCost;

		// Add the items list to the document via Handlebars
		const template = Handlebars.compile(
			document.getElementById('products-list-template').innerHTML
		);
		const html = template({cartItems});
		document.getElementById("products-list").innerHTML = html;
		
		// Add the total price to the document
		document.getElementById("cart-price").innerHTML = totalCost;
		
	})
	.catch((error) => {
		console.error(error);
	});
}

// Function that pop a message when you go to purchase
function purchase(){
	alert("Hurray! Purchase Complete!");

}

//Call Cart Retrieval Service
CRS();