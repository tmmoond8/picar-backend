import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'emotion' })
export default class Emotion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  articleId!: number;

  @Column()
  authorId!: string;

  @Column()
  type!: string;

  @CreateDateColumn()
  createAt!: string;

  @UpdateDateColumn()
  updateAt!: string;
}

export function createEmotion(params: {
  articleId: number;
  authorId: string;
  type: string;
}) {
  const emotion = new Emotion();
  emotion.articleId = params.articleId;
  emotion.authorId = params.authorId;
  emotion.type = params.type;
  return emotion;
}