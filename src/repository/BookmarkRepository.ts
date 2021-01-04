import {
  getConnection,
  Repository,
} from 'typeorm';
import Bookmark from '../entity/Bookmark';

class BookmarkRepository {
  reposition: Repository<Bookmark> | null = null;
  constructor() {
    this.reposition = getConnection().getRepository(Bookmark);
  }

  list(userId: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('bookmark')
        .where(userId ? 'bookmark.userId = :userId' : '1=1', { userId })
        .getMany();
    }
  }

  listAll(startAt?: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('bookmark')
        .where(startAt ? 'bookmark.createAt > :startAt' : '1=1', { startAt })
        .getMany();
    }
  }

  get(userId: string, articleId: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.createQueryBuilder('bookmark')
          .where('bookmark.articleId = :articleId', { articleId: parseInt(articleId) })
          .andWhere('bookmark.userId = :userId', { userId })
          .getOne();
    }
  }

  add(bookmark: Bookmark) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      this.reposition.save(bookmark);
    }
  }

  remove(articleId: number, userId: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      this.reposition.delete({
        articleId, userId
      });
    }
  }
}

let repository: BookmarkRepository | null = null;

export default () => {
  if (repository === null) {
    repository = new BookmarkRepository();
  }
  return repository;
};