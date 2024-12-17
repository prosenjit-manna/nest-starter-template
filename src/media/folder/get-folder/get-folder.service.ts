import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class GetFolderService {

  @Query(() => String)
  async getFolder() {
    return 'getFolder';
  }
}