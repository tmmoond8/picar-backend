import cron from 'node-cron';
import newsFeed from './newsFeed';

const newsFeedTask = cron.schedule("0 12 1-31 * *", () => {
  newsFeed.parse();
}, { scheduled: false });

const cronJob = () => {
  newsFeedTask.start();
};

export default cronJob;
