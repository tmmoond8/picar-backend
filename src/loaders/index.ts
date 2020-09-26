import expressLoader from './express';
import Logger from './logger';
import typeorm from './typeorm';
//We have to import at least all the events once so they can be triggered

export default async (app: any) => {
  Logger.info('✌️ Dependency Injector loaded');
  try {
    await typeorm();
    Logger.info('✌️ MySQL connected');
  } catch (error: unknown) {
    console.log(error);
  }

  await expressLoader({ app });
  Logger.info('✌️ Express loaded');
};
