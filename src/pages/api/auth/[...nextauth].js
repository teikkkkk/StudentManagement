import axios from "axios";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.email = user.email;
        try {
          const response = await axios.post('http://localhost:8000/api/login-social/google', { access_token: token.accessToken });
          token.name = response.data.user.name;
          token.role=response.data.user.role;
        } catch (error) {
          console.error('Error during API call:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log(session);
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/Home",
    error: "/auth/error",
  },
  debug: true,
};

export default NextAuth(authOptions);