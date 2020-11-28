import {
  getConnection,
  Repository,
} from 'typeorm';
import Emotion, { createEmotion } from '../entity/Emotion';

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
  add(params: {articleId: number, authorId: string; emotion: string}) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      const newEmotion = createEmotion(params);
      return this.reposition.save(newEmotion);
    }
  }

  delete(params: {articleId: number, authorId: string;}) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.createQueryBuilder()
        .delete()
        .from(Emotion)
        .where('emotion.articleId = :articleId', params)
        .andWhere('emotion.authorId = :authorId', params)
        .execute();
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