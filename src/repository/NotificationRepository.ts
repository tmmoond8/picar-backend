import {
  getConnection,
  Repository,
} from 'typeorm';
import Notification from '../entity/Notification';

class NotificationRepository {
  reposition: Repository<Notification> | null = null;
  constructor() {
    this.reposition = getConnection().getRepository(Notification);
  }

  list(userId: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('notification')
        .where(userId ? 'notification.userId = :userId' : '1=1', { userId })
        .getMany();
    }
  }
}

let repository: NotificationRepository | null = null;

export default () => {
  if (repository === null) {
    repository = new NotificationRepository();
  }
  return repository;
};