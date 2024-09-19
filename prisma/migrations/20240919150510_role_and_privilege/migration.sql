/*
  Warnings:

  - You are about to drop the column `usreId` on the `UserRoleAndPrivilege` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRoleAndPrivilege" DROP CONSTRAINT "UserRoleAndPrivilege_usreId_fkey";

-- AlterTable
ALTER TABLE "UserRoleAndPrivilege" DROP COLUMN "usreId",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "UserRoleAndPrivilege" ADD CONSTRAINT "UserRoleAndPrivilege_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
