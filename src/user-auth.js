
export const userAuth = {
    userIsShopkeep: userIsShopkeep
};

function userIsShopkeep(user) {
    return user && user['https://davidsgrocerystore.com/roles']?.includes('Shopkeep')
}