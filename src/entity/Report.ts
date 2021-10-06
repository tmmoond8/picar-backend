import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'report' })
export default class Report {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  articleId!: number;

  @Column({ type: 'text', nullable: true })
  commentId?: string;

  @Column()
  reporterCode!: string;

  @Column()
  content!: string;

  @CreateDateColumn()
  createAt!: string;

  @UpdateDateColumn()
  updateAt!: string;
}

export function createReport(params: {
  articleId: number;
  reporterCode: string;
  content: string;
  commentId?: string;
}) {
  const report = new Report();
  report.articleId = params.articleId;
  report.reporterCode = params.reporterCode;
  report.content = params.content;
  if (params.commentId) {
    report.commentId = params.commentId;
  }
  return report;
}
