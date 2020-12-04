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
  id!: string;

  @Column('text')
  content!: string;

  @Column({ nullable: true })
  authorId?: string;

  @ManyToOne((type) => User, (user) => user.comments)
  author!: User;

  @Column()
  articleId!: number;

  @Column({ nullable: true })
  about!: string;

  @Column({ type: 'text', nullable: true })
  photos!: string;

  replies?: Comment[];

  @Column({ default: false })
  isDelete!: boolean;

  @CreateDateColumn()
  createAt!: string;

  @UpdateDateColumn()
  updateAt!: string;

  to () {
    const copied: any = { ...this, author: this.author.profile };
    if (this.isDelete) {
      copied.content = '';
    }
    delete copied.authorId;
    return copied;
  }
}

export const CommentRepository = () => getConnection().getRepository(Comment);
