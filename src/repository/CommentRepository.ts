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

  list(params: {articleId?: number | string, userId?: string}) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'user')
      .where(params.articleId ? 'comment.articleId = :articleId' : 'comment.authorId = :userId', params)
      .orderBy("comment.createAt", "DESC")
      .getMany();
    }
  }
  get(id: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.author', 'user')
        .where('comment.id = :id', { id })
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

  remove(commentId: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      this.reposition.createQueryBuilder()
        .update(Comment)
        .set({ isDelete: true })
        .where('comment.id = :commentId', { commentId })
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