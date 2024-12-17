import { Mutation, Resolver } from "@nestjs/graphql";

@Resolver()
export class CreateFolderService {

  @Mutation(() => String) 
  async createFolder() {
    return 'createFolder';
  }
}