import newsFeed from './newsFeed';

const cron = () => {
  newsFeed.parse();
};

export default cron;
