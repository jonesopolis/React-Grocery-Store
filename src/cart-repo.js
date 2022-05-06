const fs = require('fs');

let userCarts = require('./carts.json');

export const cartRepo = {
    getUserCart: getUserCart,
    getUserCartCount: getUserCartCount,
    addToCart: addToCart,
    deleteFromCart: deleteFromCart,
    clearUserCart: clearUserCart,
};

function getUserCart(userId) {
    let user = userCarts.find(x => x.userId === userId);

    if(!user) {
        user = create(userId);
    }

    return user.cart;
}

function create(userId) {
    let user = {
        userId: userId,
        cart: []
    };

    userCarts.push(user);
    saveData();

    return user;
}

function addToCart(userId, itemId) {
    if(!itemId) {
        return;
    }

    let cart = getUserCart(userId);

    var existingItem = cart.find(x => x.itemId === itemId);

    if (!existingItem) {
      cart.push({ itemId: itemId, count: 1 });
    } else {
      existingItem.count++;
    }

    saveData();    
    return getUserCartCount(userId);
}

function getUserCartCount(userId) {
    let cart = getUserCart(userId);
    return cart.map((x) => x.count).reduce((partialSum, a) => partialSum + a, 0);
}

function deleteFromCart(userId, itemId) {
    let cart = getUserCart(userId);

    let index = cart.findIndex(x => x.itemId === itemId);
    cart.splice(index, 1);    

    saveData();    
    return getUserCartCount(userId);
}

function clearUserCart(userId) {
    let user = userCarts.find(x => x.userId === userId);
    user.cart = [];

    saveData();
}

function saveData() {
    fs.writeFileSync('./src/carts.json', JSON.stringify(userCarts));
}