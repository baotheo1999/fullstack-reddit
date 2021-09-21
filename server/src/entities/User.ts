import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { Upvote } from "./Unvote";

@ObjectType() // nc từ typeSc cho graphql đến graphql
// biến thành 1 cái table trong CSDL User => Name table
@Entity() // nc từ tsc sang posgest
export class User extends BaseEntity {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn() // Tự động nhảy, tạo cột
  id!: number; // ! not null

  @Field()
  @Column({ unique: true }) // cột/ unique: khác nhau
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany((_to) => Upvote, (upvote) => upvote.post)
  upvotes: Upvote[];

  @Field()
  @Column({ default: 0 })
  points!: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updateAt: Date;
}
