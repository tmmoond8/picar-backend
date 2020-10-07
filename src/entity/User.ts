import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  getConnection,
} from 'typeorm';
import Article from './Article';
import Comment from './Comment';
import IUser, { Profile } from '../types/User';

@Entity({ name: 'user' })
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  group?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ nullable: true })
  coverImg?: string;

  @Column()
  email!: string;

  @Column()
  provider!: string;

  @Column()
  snsId!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany((type) => Article, (article) => article.author)
  articles?: Article[];

  @OneToMany((type) => Comment, (comment) => comment.author)
  comments?: Comment[];

  @CreateDateColumn()
  createAt!: string;

  @UpdateDateColumn()
  updateAt!: string;

  createArticle() {
    const article = new Article();
    article.author = this;
    return article;
  }

  createComment(articleId: number) {
    const comment = new Comment();
    comment.author = this;
    comment.articleId = articleId;
    return comment;
  }

  public get profile(): Profile {
    return {
      coverImg: this.coverImg,
      description: this.description,
      id: this.id,
      thumbnail: this.thumbnail,
      name: this.name,
      email: this.email,
    };
  }
}

export function createUser(props: IUser) {
  const user = new User();
  if (props.id) user.id = props.id;
  user.name = props.name;
  user.thumbnail = props.thumbnail;
  user.coverImg = props.coverImg;
  user.email = props.email;
  user.provider = props.provider;
  user.snsId = props.snsId;
  user.description = props.description;
  return user;
}

export const UserRepository = () => getConnection().getRepository(User);
