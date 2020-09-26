import { Profile } from './User';

export default interface Article {
  id?: number;
  title: string;
  content: string;
  group: string;
  author: Profile;
  createAt: Date;
  updateAt: Date;
}
