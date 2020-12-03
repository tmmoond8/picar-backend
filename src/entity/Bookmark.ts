import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'bookmark' })
export default class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  articleId!: number;

  @Column()
  userId!: string;

  @CreateDateColumn()
  createAt!: string;

  @UpdateDateColumn()
  updateAt!: string;
}

export function createBookmark(params: {
  articleId: number;
  userId: string;
}) {
  const bookmark = new Bookmark();
  bookmark.articleId = params.articleId;
  bookmark.userId = params.userId;
  return bookmark;
}