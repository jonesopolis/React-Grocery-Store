import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
        aud: string,
        iss: string,
        iat: number,
        nbf: number,
        exp: number,
        aio: string,
        email: string,
        family_name: string,
        given_name: string,
        idp: string,
        name: string,
        oid: string,
        preferred_username: string,
        rh: string,
        roles: string[],
        sub: string,
        tid: string,
        uti: string,
        ver: number
    } & DefaultSession["user"],
    account: {
      provider: string,
      type: string,
      providerAccountId: string,
      token_type: string,
      scope: string,
      expires_at: number,
      ext_expires_in: number,
      access_token: string,
      id_token: string,
      session_state: string
    }
  }
}