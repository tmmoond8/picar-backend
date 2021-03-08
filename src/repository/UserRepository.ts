import {
  getConnection,
  Repository,
} from 'typeorm';
import User from '../entity/User';

class UserRepository {
  reposition: Repository<User> | null = null;
  constructor() {
    this.reposition = getConnection().getRepository(User);
  }

  search(options: { search?: string }) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('user')
        .where(options.search ? 'user.name like :search' : '1=1', { search: `%${options.search}%`})
        .getMany();
    }
  }

  get(snsId: string, provider: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.findOne({ where: { snsId, provider } });
    }
  }

  getByCode(code: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.findOne({ where: { code } });
    }
  }

  getByEmail(email: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition.findOne({ where: { email } });
    }
  }

  save(user: User) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      this.reposition.save(user);
    }
  }
}

let repository: UserRepository | null = null;

export default () => {
  if (repository === null) {
    repository = new UserRepository();
  }
  return repository;
};