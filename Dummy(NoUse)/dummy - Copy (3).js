// User class to represent a user
class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.isAdmin = false;
    }
}

// Product class to represent a product
class Product {
    constructor(id, name, description, price, quantity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
    }
}

// Order class to represent an order
class Order {
    constructor(id, user, products) {
        this.id = id;
        this.user = user;
        this.products = products; // Array of product objects
        this.status = 'Pending';
        this.createdAt = new Date();
    }

    calculateTotal() {
        return this.products.reduce((total, product) => {
            return total + product.price * product.quantity;
        }, 0);
    }

    completeOrder() {
        this.status = 'Completed';
    }
}

// InventoryManager to manage users, products, and orders
class InventoryManager {
    constructor() {
        this.users = [];
        this.products = [];
        this.orders = [];
        this.userIdCounter = 1;
        this.productIdCounter = 1;
        this.orderIdCounter = 1;
    }

    registerUser(username, email, password) {
        const newUser = new User(this.userIdCounter++, username, email, password);
        this.users.push(newUser);
        console.log(`User registered: ${username}`);
        return newUser;
    }

    authenticateUser(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            console.log(`User authenticated: ${username}`);
            return user;
        } else {
            console.error('Authentication failed.');
            return null;
        }
    }

    addProduct(name, description, price, quantity) {
        const newProduct = new Product(this.productIdCounter++, name, description, price, quantity);
        this.products.push(newProduct);
        console.log(`Product added: ${name}`);
        return newProduct;
    }

    listProducts() {
        console.log("Product List:");
        this.products.forEach(product => {
            console.log(`- ${product.name}: $${product.price} (Quantity: ${product.quantity})`);
        });
    }

    createOrder(user, productQuantities) {
        const productsToOrder = this.products.filter(product => productQuantities[product.id]);
        const order = new Order(this.orderIdCounter++, user, productsToOrder);
        this.orders.push(order);
        console.log(`Order created for ${user.username}: Order ID ${order.id}`);
        return order;
    }

    completeOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.completeOrder();
            console.log(`Order ${orderId} completed.`);
        } else {
            console.error(`Order ${orderId} not found.`);
        }
    }

    listOrders() {
        console.log("Orders:");
        this.orders.forEach(order => {
            console.log(`- Order ID: ${order.id}, User: ${order.user.username}, Status: ${order.status}, Total: $${order.calculateTotal()}`);
        });
    }

    updateProduct(id, newDetails) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            Object.assign(product, newDetails);
            console.log(`Product updated: ${product.name}`);
        } else {
            console.error(`Product with ID ${id} not found.`);
        }
    }

    removeProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            const removedProduct = this.products.splice(index, 1);
            console.log(`Product removed: ${removedProduct[0].name}`);
        } else {
            console.error(`Product with ID ${id} not found.`);
        }
    }
}

// Example usage
const inventoryManager = new InventoryManager();

// Register users
const user1 = inventoryManager.registerUser("alice", "alice@example.com", "password123");
const user2 = inventoryManager.registerUser("bob", "bob@example.com", "securepassword");

// Authenticate user
const authenticatedUser = inventoryManager.authenticateUser("alice", "password123");

// Add products
inventoryManager.addProduct("Laptop", "A high performance laptop", 999.99, 10);
inventoryManager.addProduct("Smartphone", "Latest model smartphone", 699.99, 20);
inventoryManager.addProduct("Tablet", "A lightweight tablet", 299.99, 15);

// List products
inventoryManager.listProducts();

// Create an order
const productQuantities = {
    1: 1, // Laptop
    2: 2  // Smartphone
};
const order = inventoryManager.createOrder(authenticatedUser, productQuantities);

// List orders
inventoryManager.listOrders();

// Complete the order
inventoryManager.completeOrder(order.id);

// Update product details
inventoryManager.updateProduct(1, { price: 899.99, quantity: 8 });

// Remove a product
inventoryManager.removeProduct(3); // Remove Tablet

// List products again to see updates
inventoryManager.listProducts();

// List orders again
inventoryManager.listOrders();

// Test case for authentication failure
const failedAuth = inventoryManager.authenticateUser("bob", "wrongpassword");

// Test case for creating an order with unavailable products
const invalidProductQuantities = {
    1: 5, // Laptop
    2: 25 // Exceeds available quantity of Smartphone
};
const invalidOrder = inventoryManager.createOrder(authenticatedUser, invalidProductQuantities);

// Test case for removing a non-existent product
inventoryManager.removeProduct(99);

// Test case for updating a non-existent product
inventoryManager.updateProduct(99, { price: 100.00 });
