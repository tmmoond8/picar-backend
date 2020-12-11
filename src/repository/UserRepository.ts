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
}

let repository: UserRepository | null = null;

export default () => {
  if (repository === null) {
    repository = new UserRepository();
  }
  return repository;
};