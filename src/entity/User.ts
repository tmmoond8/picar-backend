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
import { generateToken } from '../lib/token';
import Notification from './Notification';

@Entity({ name: 'user' })
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column()
  group!: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column()
  email!: string;

  @Column()
  provider!: string;

  @Column()
  snsId!: string;

  @Column({ default: false})
  isDelete!: boolean;

  @Column()
  accessToken!: string;
  
  @Column()
  refreshToken!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany((type) => Article, (article) => article.author)
  articles?: Article[];

  @OneToMany((type) => Comment, (comment) => comment.author)
  comments?: Comment[];

  @OneToMany((type) => Notification, (notification) => notification.user)
  notifications?: Notification[];

  @Column()
  lastLoginDate!: string;

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
      profileImage: this.profileImage,
      description: this.description,
      code: this.code,
      thumbnail: this.thumbnail,
      name: this.name,
      email: this.email,
      group: this.group,
    };
  }

  public get generateToken(): any {
    return generateToken({
      profile: {
        ...this.profile,
        id: this.id
      }
    })
  }
}

export function createUser(props: IUser) {
  const user = new User();
  if (props.id) user.id = props.id;
  user.name = props.name;
  user.thumbnail = props.thumbnail;
  user.profileImage = props.profileImage;
  user.email = props.email;
  user.group = props.group;
  user.provider = props.provider;
  user.snsId = props.snsId;
  user.description = props.description;
  user.code = Math.random().toString(36).substr(2, 9);
  return user;
}

export const UserRepository = () => getConnection().getRepository(User);
