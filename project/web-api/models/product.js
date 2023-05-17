class Product {
    constructor(id, title, subcategoryId, description, cost, image) {
        this.id = id;
        this.title = title;
        this.subcategoryId = subcategoryId;
        this.description = description;
        this.cost = cost;
        this.image = image;
      }
    
    getId() {
    return this.id;
    }

    setId(id) {
    this.id = id;
    }

    getTitle() {
    return this.title;
    }

    setTitle(title) {
    this.title = title;
    }

    getSubcategoryId() {
    return this.subcategoryId;
    }

    setSubcategoryId(subcategoryId) {
    this.subcategoryId = subcategoryId;
    }

    getDescription() {
    return this.description;
    }

    setDescription(description) {
    this.description = description;
    }

    getCost() {
    return this.cost;
    }

    setCost(cost) {
    this.cost = cost;
    }

    getImage() {
    return this.image;
    }

    setImage(image) {
    this.image = image;
    }
}

module.exports = Product;