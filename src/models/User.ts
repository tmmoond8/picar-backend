import { AllowNull, Column, Default, Model, Table } from 'sequelize-typescript';

@Table({})
export class User extends Model<User> {
  @AllowNull(false)
  @Column
  username!: string;

  @Default('/static/images/default_thumbnail.png')
  @Column
  thumbnail?: string;

  @Column
  coverImg?: string;

  @Column
  email!: string;

  @AllowNull(false)
  @Column
  provider!: string;

  @AllowNull(false)
  @Column
  snsId!: string;

  @Column
  description?: string;

  public get profile(): object {
    return {
      coverImg: this.coverImg,
      description: this.description,
      id: this.id,
      thumbnail: this.thumbnail,
      username: this.username,
    };
  }
}
