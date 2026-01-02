import {
  getConnection,
  Repository,
} from 'typeorm';
import User from '../entity/User';

class UserRepository {
  private get repository(): Repository<User> {
    return getConnection().getRepository(User);
  }

  search(options: { search?: string }) {
    return this.repository
      .createQueryBuilder('user')
      .where(options.search ? 'user.name like :search' : '1=1', { search: `%${options.search}%`})
      .getMany();
  }

  get(snsId: string, provider: string) {
    return this.repository.findOne({ where: { snsId, provider } });
  }

  getByCode(code: string) {
    return this.repository.findOne({ where: { code } });
  }

  getByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  save(user: User) {
    return this.repository.save(user);
  }
}

let repository: UserRepository | null = null;

export default () => {
  if (repository === null) {
    repository = new UserRepository();
  }
  return repository;
};