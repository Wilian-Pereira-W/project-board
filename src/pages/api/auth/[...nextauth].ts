import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        return {
          ...session,
          id: token.sub,
        };
      } catch (error) {
        return {
          ...session,
          id: null,
        };
      }
    },
    async signIn() {
      try {
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});
