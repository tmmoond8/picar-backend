import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './User';

@Table({})
export class Post extends Model<Post> {
  @AllowNull(false)
  @Column(DataType.STRING(140))
  content!: string;

  @ForeignKey(() => User)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  public get info(): object {
    const { id: userId, username, thumbnail } = this.user;

    return {
      content: this.content,
      createdAt: this.createdAt,
      id: this.id,
      profile: {
        id: userId,
        thumbnail,
        username,
      },
    };
  }
}
