import {
  getConnection,
  Repository,
} from 'typeorm';
import Article from '../entity/Article';

class ArticleRepository {

  reposition: Repository<Article> | null = null;
  constructor() {
    this.reposition = getConnection().getRepository(Article);
  }

  list(group: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.author', 'user')
        .where(group ? 'article.group = :group' : '1=1', { group })
        .orderBy("article.createAt", "DESC")
        .getMany();
    }
  }
  get(id: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.author', 'user')
        .where('article.id = :id', { id: parseInt(id) })
        .getOne();
    }
  }
  save(article: Article) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition?.save(article);
    }
  }
  increaseComment(id: number) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.createQueryBuilder()
        .update(Article)
        .set({ commentCount: () => "commentCount + 1"})
        .where('article.id = :articleId', { articleId: 67 })
        .execute();
    }
  }
  decreaseComment(id: number) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.createQueryBuilder()
        .update(Article)
        .set({ commentCount: () => "commentCount - 1"})
        .where('article.id = :articleId', { articleId: 67 })
        .execute();
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