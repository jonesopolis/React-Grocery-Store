import { AccountInfo } from "@azure/msal-browser";

class UserAuthService {
    public static userIsShopkeep(account: AccountInfo | null) : boolean {
        return (account
                && account.idTokenClaims 
                && account.idTokenClaims.roles
                && account.idTokenClaims.roles.includes('Shopkeep'))
                ?? false;
    }
}

export default UserAuthService;