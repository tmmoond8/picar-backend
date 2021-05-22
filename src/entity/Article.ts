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
import Comment from './Comment';

@Entity({ name: 'article' })
export default class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  group!: string;

  @Column({ nullable: true })
  authorId?: string;

  @ManyToOne((type) => User, (user) => user.articles)
  author!: User;

  @Column({ nullable: true })
  photos?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @ManyToOne((type) => Comment, (comment) => comment.article)
  comments?: Comment;

  @Column({ default: 0 })
  commentCount!: number;

  @Column({ default: 0 })
  emotionCount!: number;

  @Column({ default: false })
  isDelete!: boolean;

  @CreateDateColumn()
  createAt!: string;

  @UpdateDateColumn()
  updateAt!: string;

  get [Symbol.toStringTag]() {
    return JSON.stringify(
      Object.assign({}, this, { author: this.author && this.author.profile }),
    );
  }
  to() {
    const copied: any = {
      ...this,
      author: this.author.profile
    }
    if (copied.isDelete) {
      copied.content = '';
      copied.photos = null;
    }
    delete copied.authorId;
    return copied;
  }
}

export const ArticleRepository = () => getConnection().getRepository(Article);
