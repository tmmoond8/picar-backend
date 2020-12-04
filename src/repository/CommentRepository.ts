import {
  getConnection,
  Repository,
} from 'typeorm';
import Comment from '../entity/Comment';

class ArticleRepository {

  reposition: Repository<Comment> | null = null;
  constructor() {
    this.reposition = getConnection().getRepository(Comment);
  }

  list(articleId: number | string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'user')
      .where('comment.articleId = :articleId', { articleId })
      .orderBy("comment.createAt", "ASC")
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
  save(comment: Comment) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.save(comment);
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