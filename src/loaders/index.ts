import expressLoader from './express';
import Logger from './logger';
import typeorm from './typeorm';
import User, { createUser } from '../entity/User';
//We have to import at least all the events once so they can be triggered

export default async (app: any) => {
  try {
    const dbConnection = await typeorm();
    const user = createUser({
      name: 'ken',
      email: 'test@test.com',
      provider: 'google',
      snsId: '23131321',
    });
    console.log(dbConnection, user);
    const kk = await dbConnection.getRepository(User).save(user);
    console.log(kk);
  } catch (error: unknown) {
    console.log(error);
  }

  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app });
  Logger.info('✌️ Express loaded');
};
