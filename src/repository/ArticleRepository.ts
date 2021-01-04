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

  list(options: {group?: string; startAt?: string}) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.author', 'user')
        .where(options.group ? 'article.group = :group' : '1=1', options)
        .andWhere('article.isDelete = :isDelete', { isDelete: false })
        .andWhere(options.startAt ? 'article.createAt > :startAt' : '1=1', options)
        .orderBy("article.createAt", "DESC")
        .getMany();
    }
  }
  
  search(options: { search?: string }) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.author', 'user')
        .where(options.search ? 'article.title like :search' : '1=1', { search: `%${options.search}%`})
        .orWhere(options.search ? 'article.content like :search': '1=1', { search: `%${options.search}%`})
        .andWhere('article.isDelete = :isDelete', { isDelete: false })
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

  remove(articleId: number) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      this.reposition.createQueryBuilder()
        .update(Article)
        .set({ isDelete: true })
        .where('article.id = :articleId', { articleId })
        .execute();
    }
  }

  increaseComment(articleId: number) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.createQueryBuilder()
        .update(Article)
        .set({ commentCount: () => "commentCount + 1"})
        .where('article.id = :articleId', { articleId })
        .execute();
    }
  }
  decreaseComment(articleId: number) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.createQueryBuilder()
        .update(Article)
        .set({ commentCount: () => "commentCount - 1"})
        .where('article.id = :articleId', { articleId })
        .execute();
    }
  }
  increaseEmotion(articleId: number) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.createQueryBuilder()
        .update(Article)
        .set({ emotionCount: () => "emotionCount + 1"})
        .where('article.id = :articleId', { articleId })
        .execute();
    }
  }
  decreaseEmotion(articleId: number) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.createQueryBuilder()
        .update(Article)
        .set({ emotionCount: () => "emotionCount - 1"})
        .where('article.id = :articleId', { articleId })
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