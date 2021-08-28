import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
// import Adapters from 'next-auth/adapters';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    // Providers.Email({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    // Providers.GitHub({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    //   // https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
    //   scope: 'read:user',
    // }),
    // Providers.Google({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',

      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@hot.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const res = await validateUser(credentials);
        const user = res.user;
        if (res.ok && user) {
          return user;
        }
        throw new Error(res.message);
        // console.log(res);
        //return null;
      },
    }),
  ],

  // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
  // https://next-auth.js.org/configuration/databases
  //
  // Notes:
  // * You must install an appropriate node_module for your database
  // * The Email provider requires a database (OAuth providers do not)
  database: process.env.DATABASE_URL,

  // adapter: Adapters.TypeORM.Adapter({
  //   type: 'sqlite',
  //   database: ':memory:',
  //   synchronize: true,
  // }),

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  // secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 24 * 60 * 60, // 1 hora

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.SECRET_JWT,
    // signingKey: {
    //   'kty': 'oct',
    //   'kid': 'UoWTmoyD1rBBqp-IhJ8QaPk4WBDKAgU0L9zB-DjPgFY',
    //   'alg': 'HS512',
    //   'k': '-6QwNTrBiwy78CnNsyjBFt5F1s8tcvAAWwVBjmbM3ufUa6qkR2oFfzkskmZgKm4noagW9PaGutZluj32DVh4vg',
    // },
    // verificationOptions: {
    //   algorithms: ['HS256'],
    // },
    // Set to true to use encryption (default: false)
    // encryption: true,
    // encryptionKey: '',
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin', // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn(user, account, profile) {
    //   const isAllowedToSignIn = true;
    //   if (isAllowedToSignIn) {
    //     return true;
    //   } else {
    //     // Return false to display a default error message
    //     return false;
    //     // Or you can return a URL to redirect to:
    //     // return '/unauthorized'
    //   }
    // },
    // async signIn(user, account, profile) { return true },
    // async redirect(url, baseUrl) {
    //   // console.log(url);
    //   // console.log(baseUrl);
    //   // return url.startsWith(baseUrl) ? url : baseUrl;
    // },
    // async session(session, user) { return session },
    // async jwt(token, user, account, profile, isNewUser) { return token }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  theme: 'light',

  // Enable debug messages in the console if you are having problems
  debug: false,
});

const validateUser = async (credentials) => {
  const { email, password } = credentials;
  try {
    const response = await fetch(`${process.env.API_URL}/graphql`, {
      method: 'POST',
      // credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation authenticateUserII($authenticateUserInput: AuthenticateInput!) {
            authenticateUserII(input: $authenticateUserInput) {
              id
              name
              email
            }
          }
        `,
        variables: {
          'authenticateUserInput': {
            email,
            password,
          },
        },
      }),
    });
    const { data, errors } = await response.json();

    if (errors) throw new Error(errors[0].message.toString());
    return { ok: true, user: { ...data.authenticateUserII } };
  } catch (error) {
    return { ok: false, message: error.message };
  }
};
