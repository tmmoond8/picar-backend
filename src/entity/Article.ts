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
import { Profile } from '../types/User';

@Entity({ name: 'article' })
export default class Article {
  @PrimaryGeneratedColumn()
  id!: number;

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

  authorProfile?: Profile;

  // public get info(): object {
  //   const { id: userId, username, thumbnail } = this.user;

  //   return {
  //     content: this.content,
  //     createdAt: this.createdAt,
  //     id: this.id,
  //     profile: {
  //       id: userId,
  //       thumbnail,
  //       username,
  //     },
  //   };
  // }

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

export function createArticle(props: { content: string; author: User }) {
  const article = new Article();
  article.content = props.content;
  article.author = props.author;
  return article;
}

export const ArticleRepository = () => getConnection().getRepository(Article);
