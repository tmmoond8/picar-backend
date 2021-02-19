import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import User from './User';

@Entity({ name: 'emotion' })
export default class Emotion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  articleId!: number;

  @Column()
  authorId!: string;

  @ManyToOne((type) => User, (user) => user.emotions)
  author!: User;

  @Column()
  type!: string;

  @CreateDateColumn()
  createAt!: string;

  @UpdateDateColumn()
  updateAt!: string;
}

export function createEmotion(params: {
  articleId: number;
  author: User;
  type: string;
}) {
  const emotion = new Emotion();
  emotion.articleId = params.articleId;
  emotion.authorId = params.author.profile.id || '';
  emotion.type = params.type;
  return emotion;
}