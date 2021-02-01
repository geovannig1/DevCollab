import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import User, { IUser } from '../models/User';

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(undefined, existingUser);
        }

        const { name, emails, photos, id } = profile;

        if (name?.familyName && name.givenName && emails?.[0].value) {
          const user = await User.create({
            googleId: id,
            firstName: name?.givenName,
            lastName: name?.familyName,
            email: emails?.[0].value,
            avatar: photos?.[0].value,
            havePassword: false,
          });

          done(undefined, user);
        }
      } catch (err) {
        done(err, false, err.message);
      }
    }
  )
);

export default passport;
