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

  @Column('text')
  targetContent!: string;

  @Column()
  target!: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  emotion?: string;

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

export function createCommentNotification(props: Comment, targetContent: string) {
  const notification = new Notification();
  notification.targetContent = targetContent;
  notification.target = 'comment';
  notification.user = props.author;
  notification.createAt = props.createAt;
  notification.isViewd = false;
  notification.emotion = '';
  return notification;
}

export function createEmotionNotification(props: Emotion, targetContent: string) {
  const notification = new Notification();
  notification.targetContent = targetContent;
  notification.target = 'emotion';
  notification.user = props.author;
  notification.createAt = props.createAt;
  notification.isViewd = false;
  notification.emotion = props.type;
  return notification;
}
