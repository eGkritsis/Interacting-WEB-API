// Fetch categories and subcategories from the API and render them on the page
function fetchCategories() {
    fetch('https://wiki-shop.onrender.com/categories/', {
		Method: 'GET'
	}).then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      console.log("error");
    }
  }).then(categories => {

        // Compile the Handlebars template
        const template = Handlebars.compile(
          document.getElementById('category-template').innerHTML
        );
        // Render the template with the fetched categories
        const html = template({categories});
        // Insert the rendered HTML into the page
        document.getElementById('categories').innerHTML = html;
      }).catch(error => {
        console.log(error);
      });
}

fetchCategories();





