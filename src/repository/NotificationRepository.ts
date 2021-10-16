import { getConnection, Repository } from 'typeorm';
import Notification from '../entity/Notification';

class NotificationRepository {
  reposition: Repository<Notification> | null = null;
  constructor() {
    this.reposition = getConnection().getRepository(Notification);
  }

  list(target: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('notification')
        .innerJoinAndSelect('notification.user', 'user')
        .where('notification.target = :target', { target })
        .orderBy('notification.createAt', 'DESC')
        .getMany();
    }
  }

  save(notification: Notification) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      this.reposition.save(notification);
    }
  }

  checkViews(notificationIds: string[]) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder()
        .update(Notification)
        .set({ isViewd: true })
        .where(
          '(' +
            notificationIds
              .map((id) => `notification.id = '${id}'`)
              .join(' OR ') +
            ')',
        )
        .execute();
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
