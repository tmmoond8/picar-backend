import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Article from './Article';
import IUser from '../types/User';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

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

// public get profile(): object {
//   return {
//     coverImg: this.coverImg,
//     description: this.description,
//     id: this.id,
//     thumbnail: this.thumbnail,
//     username: this.username,
//   };
// }
