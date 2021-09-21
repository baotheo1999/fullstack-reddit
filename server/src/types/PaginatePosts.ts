import { Post } from "../entities/Post";
import { Field, ObjectType } from "type-graphql";
@ObjectType()
export class PaginatePosts {
  @Field()
  totalCount!: number;

  @Field((_type) => Date)
  cursor!: Date;

  @Field()
  hasMore!: boolean;

  @Field((_type) => [Post])
  paginatePosts!: Post[];
}
