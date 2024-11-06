import { Field, ObjectType } from '@nestjs/graphql';
import { MembershipResponse } from './membership-response.dto';
import { WorkspaceMembership } from '@prisma/client';
import { BaseListResponse } from 'src/shared/base-list/base-list-response.dto';

@ObjectType()
export class ListMembershipResponse {
  @Field(() => [MembershipResponse])
  memberships: WorkspaceMembership[];

  @Field(() => BaseListResponse)
  pagination: BaseListResponse;
}
