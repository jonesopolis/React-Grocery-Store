
export const userAuth = {
    userIsShopkeep: userIsShopkeep
};

function userIsShopkeep(account) {
    return account
             && account.idTokenClaims 
             && account.idTokenClaims.roles
             && account.idTokenClaims.roles.includes('Shopkeep')
}