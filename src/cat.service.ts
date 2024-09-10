import { Args, Query, Resolver } from "@nestjs/graphql";
import { Field, Int, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class Cat {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  age: number;
}

@Resolver()
export class CatService {
  private readonly cats: Array<Cat> = [];

  create(cat: any) {
    this.cats.push(cat);
  }

  @Query(() => [Cat])
  findAllCats(
    @Args('page', { defaultValue: 1 }) page: number,
  ) {
    console.log(page);
    return this.cats;
  }

  update(cat: any) {
    const index = this.cats.findIndex((c) => c.id === cat.id);
    this.cats[index] = cat;
  }
}