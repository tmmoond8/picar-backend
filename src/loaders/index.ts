import expressLoader from './express';
import Logger from './logger';
//We have to import at least all the events once so they can be triggered

export default async (app: any) => {
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app });
  Logger.info('✌️ Express loaded');
};
