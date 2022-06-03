import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad";

export default NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope:  `${process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_SCOPES} openid`
        }
      }
    })
  ],
  secret: '8sggRh+wwsjZI5QtWTtZDR7TyV1H6LXT+j2lV8aSjHY=',
  callbacks: {
    jwt: async ({token, profile, account}) => {
      profile && (token.user = profile);
      account && (token.account = account);
      return token;
    },
    session: async ({ session, token }) => {
      session.account = token.account;
      session.user = token.user
      return session;
    }
  }
});
