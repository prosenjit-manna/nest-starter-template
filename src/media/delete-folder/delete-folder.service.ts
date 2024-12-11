import { Mutation, Resolver } from "@nestjs/graphql";

@Resolver()
export class DeleteFolderService {

  @Mutation(() => String)
  async deleteFolder() {
    return 'deleteFolder';
  }
}