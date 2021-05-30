import RssParser from 'rss-parser';
import axios from 'axios';
import iconv from 'iconv-lite';

const rssParser = new RssParser();

interface Feed {
  publisher: string;
  author?: string;
  title: string;
  content: string;
  link: string;
  pubDate: string;
  id: string;
}

const keywords = ['전기차',];
const reg = new RegExp(`(${keywords.join('|')})`, 'g');

const filter = (feeds: Feed[]) => (
  feeds.filter((feed) => feed.title.match(reg)) ||
  feeds.filter((feed) => feed.content.match(reg)).length > 2
)

const parseHeraldNews = async () => {
  const publisher = 'Herald News';
  const { items } = await rssParser.parseURL('http://biz.heraldcorp.com/common_prog/rssdisp.php?ct=010501000000.xml');
  const feeds: Feed[] = (items as Record<string, string>[]).map((rawData => ({
    publisher,
    author: rawData.author,
    title: rawData.title,
    content: rawData.contentSnippet,
    link: rawData.link,
    pubDate: rawData.pubDate,
    id: `${publisher}_${rawData.pubDate}`,
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
  const feeds: Feed[] = items.map((rawData => ({
    publisher,
    author: rawData.author,
    title: rawData.title,
    content: rawData.contentSnippet,
    link: rawData.link,
    pubDate: rawData.pubDate,
    id: `${publisher}_${rawData.pubDate}`,
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
  const feeds: Feed[] = items.map((rawData => ({
    publisher,
    author: rawData.author,
    title: rawData.title,
    content: rawData.contentSnippet,
    link: rawData.link,
    pubDate: rawData.pubDate,
    id: `${publisher}_${rawData.pubDate}`,
  })))
  return filter(feeds);
}

const parseENews = async () => {
  const publisher = 'ET News';
  const { items } = await rssParser.parseURL('http://rss.etnews.com/60066.xml');
  const feeds: Feed[] = (items as Record<string, string>[]).map((rawData => ({
    publisher,
    author: rawData.author,
    title: rawData.title,
    content: rawData.contentSnippet,
    link: rawData.link,
    pubDate: rawData.pubDate,
    id: `${publisher}_${rawData.pubDate}`,
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
  // return Promise.all([parseET(), parseMoneyToday()]).then(results => console.log(results));
  return Promise.all([parseENews()]).then(results => console.log(results));
}

export default {
  parse: parseAll,
};