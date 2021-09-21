import { Ctx, Query, Resolver } from 'type-graphql';
import { Context } from 'vm';

@Resolver() //đánh dấu là 1 typegraphql  resolver
export class HelloResolver {
  @Query((_returns) => String) //String of typegraphql
  hello(@Ctx() { req }: Context) {
    console.log(req.session.userId);

    return 'hello world';
  }
}
