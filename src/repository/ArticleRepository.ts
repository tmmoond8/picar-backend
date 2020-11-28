import {
  getConnection,
  Repository,
} from 'typeorm';
import Article from '../entity/Article';

class ArticleRepository {

  _reposition: Repository<Article> | null = null;
  constructor() {
    this._reposition = getConnection().getRepository(Article);
  }

  list(group: string) {
    console.log(group);
    if (!this._reposition) {
      throw Error('database not connected !!!');
    } else {
      return this._reposition
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.author', 'user')
        .where(group ? 'article.group = :group' : '1=1', { group })
        .orderBy("article.createAt", "DESC")
        .getMany();
    }
  }
  get(id: string) {
    if (!this._reposition) {
      throw Error('database not connected !!!');
    } else {
      return this._reposition
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.author', 'user')
        .where('article.id = :id', { id: parseInt(id) })
        .getOne();
    }
  }
  save(article: Article) {
    if (!this._reposition) {
      throw Error('database not connected !!!');
    } else {
      return this._reposition?.save(article);
    }
  }
}

let repository: ArticleRepository | null = null;

export default () => {
  if (repository === null) {
    repository = new ArticleRepository();
  }
  return repository;
};