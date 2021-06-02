import RssParser from 'rss-parser';
import { NewsFeed } from '../types/NewsFeed';
import feedManager from '../lib/feedManager';
import { format } from 'date-fns';

const rssParser = new RssParser();

const keywords = ['전기차',];
const reg = new RegExp(`(${keywords.join('|')})`, 'g');

const filter = (feeds: NewsFeed[]) => (
  feeds.filter((feed) => feed.title.match(reg)) ||
  feeds.filter((feed) => feed.content.match(reg)).length > 2
)

const generateID = (dateStr: string) => format(new Date(dateStr), 'yyyy-MM-dd:hh');

const parseHeraldNews = async () => {
  const publisher = 'Herald News';
  const { items } = await rssParser.parseURL('http://biz.heraldcorp.com/common_prog/rssdisp.php?ct=010501000000.xml');
  const feeds: NewsFeed[] = (items as Record<string, string>[]).map((rawData => ({
    publisher,
    author: rawData.author,
    title: rawData.title,
    content: rawData.contentSnippet,
    link: rawData.link,
    pubDate: rawData.pubDate,
    id: `${publisher}_${generateID(rawData.pubDate)}`,
  })))
  return filter(feeds);
}

const parseHMG = async () => {
  const publisher = 'HyundaiMotorGroup';
  const items: Record<string, string>[] = await Promise.all([
    rssParser.parseURL('http://news.hmgjournal.com/rss/HmgJournalAll'),
    rssParser.parseURL('http://news.hmgjournal.com/rss/HmgJournalTech'),
    rssParser.parseURL('http://news.hmgjournal.com/rss/HmgJournalLife'),
    rssParser.parseURL('http://news.hmgjournal.com/rss/HmgJournalSports'),
  ]).then(([{ items: items1 }, { items: items2 }]) => {
    return [...items1, ...items2];
  });
  const feeds: NewsFeed[] = items.map((rawData => ({
    publisher,
    author: rawData.author,
    title: rawData.title,
    content: rawData.contentSnippet,
    link: rawData.link,
    pubDate: rawData.pubDate,
    id: `${publisher}_${generateID(rawData.pubDate)}`,
  })))
  return filter(feeds);
}

const parseNewsWire = async () => {
  const publisher = 'NewsWire';
  const items: Record<string, string>[] = await Promise.all([
    rssParser.parseURL('https://api.newswire.co.kr/rss/industry/501'),
    rssParser.parseURL('https://api.newswire.co.kr/rss/industry/505')
  ]).then(([{ items: items1 }, { items: items2 }]) => {
    return [...items1, ...items2];
  });
  const feeds: NewsFeed[] = items.map((rawData => ({
    publisher,
    author: rawData.author,
    title: rawData.title,
    content: rawData.contentSnippet,
    link: rawData.link,
    pubDate: rawData.pubDate,
    id: `${publisher}_${generateID(rawData.pubDate)}`,
  })))
  return filter(feeds);
}

const parseENews = async () => {
  const publisher = 'ET News';
  const { items } = await rssParser.parseURL('http://rss.etnews.com/60066.xml');
  const feeds: NewsFeed[] = (items as Record<string, string>[]).map((rawData => ({
    publisher,
    author: rawData.author,
    title: rawData.title,
    content: rawData.contentSnippet,
    link: rawData.link,
    pubDate: rawData.pubDate,
    id: `${publisher}_${generateID(rawData.pubDate)}`,
  })))
  return filter(feeds);
}

// const parseMoneyToday = async () => {
//   const { data } = await axios.get('https://rss.mt.co.kr/autom_news.xml', {
//     responseType: 'arraybuffer',
//   });
//   const { items } = await rssParser.parseString(iconv.decode(data, 'EUC-KR').toString())
//   console.log('aa', items[0])
//   const feeds: Feed[] = (items as Record<string, string>[]).map((rawData => ({
//     publisher: '머니투데이',
//     title: rawData.title,
//     content: rawData.contentSnippet,
//     link: rawData.link,
//     pubDate: rawData.pubDate,
//     id: `MoneyToday_News_${rawData.pubDate}`,
//   })))
//   return filter(feeds);
// }

const parseAll = async () => {
  return Promise.all([
    parseENews(),
    parseNewsWire(),
    parseHMG(),
    parseHeraldNews(),
  ]).then(results => {
    const feeds = results.reduce((accum, r) => accum.concat(r), []);
    feedManager.appendAll(feeds);
  });
}

export default {
  parse: parseAll,
};