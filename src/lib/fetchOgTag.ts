import cheerio from 'cheerio';
import axios from 'axios';

export const getOgImage = async (url: string) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const $meta = $('meta[property="og:image"]');
  if ($meta && $meta.length > 0) {
    return $meta[0].attribs.content;
  }
  return '';
}