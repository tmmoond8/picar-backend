import {
  getConnection,
  Repository,
} from 'typeorm';
import Emotion from '../entity/Emotion';

class EmotionRepository {
  reposition: Repository<Emotion> | null = null;
  constructor() {
    this.reposition = getConnection().getRepository(Emotion);
  }

  list(articleId: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('emotion')
        .where(articleId ? 'emotion.articleId = :articleId' : '1=1', { articleId })
        .getMany();
    }
  }

  cud(params: {articleId: number, authorId: string}) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.createQueryBuilder('emotion')
          .where('emotion.articleId = :articleId', { articleId: params.articleId })
          .andWhere('emotion.authorId = :authorId', { authorId: params.authorId })
          .getOne();
    }
  }

  save(emotion: Emotion) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      this.reposition.save(emotion);
    }
  }
  remove(emotion: Emotion) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      this.reposition.remove(emotion);
    }
  }
}

let repository: EmotionRepository | null = null;

export default () => {
  if (repository === null) {
    repository = new EmotionRepository();
  }
  return repository;
};