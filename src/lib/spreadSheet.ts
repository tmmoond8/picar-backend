import axios, { AxiosResponse } from 'axios';
import { NewsFeed } from '../types/NewsFeed';

export default {
  get: async (): Promise<AxiosResponse<{ data: NewsFeed[] }>> =>
    await axios.get(
      `${process.env.SHEET_URL}?sheetName=${process.env.NEWS_FEEDS}`,
    ),
  append: async (feed: NewsFeed) =>
    await axios.get(
      `${process.env.SHEET_URL}?sheetName=${process.env.NEWS_FEEDS}`,
      { params: feed },
    ),
};