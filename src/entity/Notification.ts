import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';
import Comment from './Comment';
import Emotion from './Emotion';

@Entity({ name: 'notification' })
export default class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  targetContent!: string;

  @Column()
  target!: string;

  @Column()
  type!: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  emotion?: string;

  @Column()
  articleId?: number;

  @ManyToOne((type) => User, (user) => user.notifications)
  user!: User;

  @Column({ default: false })
  isViewd!: boolean;

  @CreateDateColumn()
  createAt!: string;

  @UpdateDateColumn()
  updateAt!: string;

  to() {
    const copied: any = {
      ...this,
      user: this.user.profile
    }
    delete copied.userId;
    return copied;
  }
}

export function createCommentNotification(target: string, props: Comment, targetContent: string) {
  const notification = new Notification();
  notification.targetContent = targetContent;
  notification.type = 'comment';
  notification.target = target;
  notification.user = props.author;
  notification.createAt = props.createAt;
  notification.isViewd = false;
  notification.emotion = '';
  notification.articleId = props.articleId;
  return notification;
}

export function createReplyNotification(target: string, props: Comment, targetContent: string) {
  const notification = new Notification();
  notification.targetContent = targetContent;
  notification.target = target;
  notification.type = 'reply';
  notification.user = props.author;
  notification.createAt = props.createAt;
  notification.isViewd = false;
  notification.emotion = '';
  notification.articleId = props.articleId;
  return notification;
}

export function createEmotionNotification(target: string, props: Emotion, targetContent: string) {
  const notification = new Notification();
  notification.targetContent = targetContent;
  notification.target = target;
  notification.type = 'emotion';
  notification.userId = props.authorId
  notification.createAt = props.createAt;
  notification.isViewd = false;
  notification.emotion = props.type;
  notification.articleId = props.articleId;
  return notification;
}
