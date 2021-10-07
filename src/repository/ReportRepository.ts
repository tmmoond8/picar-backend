import { getConnection, IsNull, Repository } from 'typeorm';
import Report from '../entity/Report';

class BookmarkRepository {
  reposition: Repository<Report> | null = null;
  constructor() {
    this.reposition = getConnection().getRepository(Report);
  }

  list(reporterCode: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('report')
        .where(reporterCode ? 'report.reporterCode = :reporterCode' : '1=1', {
          reporterCode,
        })
        .getMany();
    }
  }

  listAll(startAt?: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('report')
        .where(startAt ? 'report.createAt > :startAt' : '1=1', { startAt })
        .getMany();
    }
  }

  get(articleId: string, reporterCode: string, commentId?: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      return this.reposition
        .createQueryBuilder('report')
        .where('report.articleId = :articleId', {
          articleId,
        })
        .andWhere(commentId ? 'report.commentId = :commentId' : '1=1', {
          commentId,
        })
        .andWhere('report.reporterCode = :reporterCode', { reporterCode })
        .getOne();
    }
  }

  add(report: Report) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      this.reposition.save(report);
    }
  }

  remove(articleId: number, reporterCode: string, commentId?: string) {
    if (!this.reposition) {
      throw Error('database not connected !!!');
    } else {
      if (commentId) {
        this.reposition.delete({
          articleId,
          reporterCode,
          commentId,
        });
      } else {
        this.reposition.delete({
          articleId,
          reporterCode,
          commentId: IsNull(),
        });
      }
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
