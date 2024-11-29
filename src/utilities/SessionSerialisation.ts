import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

export class SessionSerializer extends PassportSerializer {
  // for google auth
  // when login is successful and session is valid then session is saved and  then this method is called
  constructor(@Inject(AuthService) private authService: AuthService) {
    super();
  }
  serializeUser(user: any, done: (err: Error, user?: any) => void): void {
    // when user is authenticated , save user data to session
    // console.log('Serializing User  :', user);
    // console.log('Serializing User id :', user.id);
    done(null, user.id);
  }

  deserializeUser(user: any, done: (err: Error, user?: any) => void): void {
    // when  user is logged in, we need to get user data from databas
    // console.log(`Deserializing User with ID ${user._id}`);
    this.authService
      .findUser(user._id)
      .then((user) => {
        if (!user) {
          return done(new Error('No such user found'));
        } else {
          return done(null, user);
        }
      })
      .catch((error) => done(error));
  }
}
