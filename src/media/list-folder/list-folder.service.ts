import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';

@Resolver()
export class ListFolderService {
  @Query(() => String)
  async listFolder() {
    return 'listFolder';
  }
}
