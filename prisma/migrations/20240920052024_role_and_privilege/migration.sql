/*
  Warnings:

  - You are about to drop the `UserRoleAndPrivilege` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `group` to the `Privilege` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `Privilege` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PrivilegeName" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "PrivilegeGroup" AS ENUM ('POST', 'USER');

-- AlterEnum
ALTER TYPE "PrivilegeType" ADD VALUE 'BASE';

-- DropForeignKey
ALTER TABLE "UserRoleAndPrivilege" DROP CONSTRAINT "UserRoleAndPrivilege_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoleAndPrivilege" DROP CONSTRAINT "UserRoleAndPrivilege_userId_fkey";

-- AlterTable
ALTER TABLE "Privilege" ADD COLUMN     "group" "PrivilegeGroup" NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" "PrivilegeName" NOT NULL;

-- DropTable
DROP TABLE "UserRoleAndPrivilege";

-- CreateTable
CREATE TABLE "UserPrivilege" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "roleId" TEXT,

    CONSTRAINT "UserPrivilege_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPrivilege" ADD CONSTRAINT "UserPrivilege_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPrivilege" ADD CONSTRAINT "UserPrivilege_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
