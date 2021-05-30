import newsParser from './newsParser';

const cron = () => {
  newsParser.parse();
};

export default cron;
