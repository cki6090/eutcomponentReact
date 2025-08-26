import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId:
        process.env.GOOGLE_ID ||
        "357935893847-tvcesb0gclqkaabaicu7e7varliie0ga.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_SECRET || "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",
    }),
    // ...add more providers here
  ],

  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
