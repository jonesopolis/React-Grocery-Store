class UserAuthService {
    public static userIsShopkeep(roles: string[]) : boolean {
        return roles && roles.includes('Shopkeep');
    }
}

export default UserAuthService;