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

@Entity({ name: 'article' })
export default class Article {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column()
  group!: string;

  @Column({ nullable: true })
  authorId?: string;

  @ManyToOne((type) => User, (user) => user.articles)
  author!: User;

  @Column({ type: 'text', nullable: true })
  photos!: string;

  @CreateDateColumn()
  createAt!: string;

  @UpdateDateColumn()
  updateAt!: string;

  get [Symbol.toStringTag]() {
    return JSON.stringify(
      Object.assign({}, this, { author: this.author.profile }),
    );
  }
}

export const ArticleRepository = () => getConnection().getRepository(Article);
