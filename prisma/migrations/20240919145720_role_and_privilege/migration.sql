/*
  Warnings:

  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_usreId_fkey";

-- DropTable
DROP TABLE "UserRole";

-- CreateTable
CREATE TABLE "UserRoleAndPrivilege" (
    "id" TEXT NOT NULL,
    "usreId" TEXT,
    "roleId" TEXT,

    CONSTRAINT "UserRoleAndPrivilege_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRoleAndPrivilege" ADD CONSTRAINT "UserRoleAndPrivilege_usreId_fkey" FOREIGN KEY ("usreId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleAndPrivilege" ADD CONSTRAINT "UserRoleAndPrivilege_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
