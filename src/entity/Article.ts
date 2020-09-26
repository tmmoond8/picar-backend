import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';

@Entity()
export default class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column()
  group!: string;

  @ManyToOne((type) => User, (user) => user.articles)
  author!: User;

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
}

export function createArticle(props: { content: string; author: User }) {
  const article = new Article();
  article.content = props.content;
  article.author = props.author;
  return article;
}
