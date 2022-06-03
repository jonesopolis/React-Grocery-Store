class UserAuthService {
    public static userIsShopkeep(roles: string[]) : boolean {
        return roles.includes('Shopkeep');
    }
}

export default UserAuthService;