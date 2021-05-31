import newsFeed from './newsFeed';

const cronJob = (hours: number, job: () => void) => {
  const scheduleJob = () => {
    job();
    setTimeout(() => {
      scheduleJob();
    }, hours * 1000)
  }
  scheduleJob();
}

const cron = () => {
  cronJob(12, newsFeed.parse);
};

export default cron;
