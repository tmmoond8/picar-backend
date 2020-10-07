import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  getConnection,
} from 'typeorm';
import User from './User';

@Entity({ name: 'comment' })
export default class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column('text')
  content!: string;

  @Column({ nullable: true })
  authorId?: string;

  @ManyToOne((type) => User, (user) => user.comments)
  author!: User;

  @Column({ nullable: true })
  articleId?: string;

  @Column({ type: 'text', nullable: true })
  photos!: string;

  @CreateDateColumn()
  createAt!: string;

  @UpdateDateColumn()
  updateAt!: string;
}

export const CommentRepository = () => getConnection().getRepository(Comment);
