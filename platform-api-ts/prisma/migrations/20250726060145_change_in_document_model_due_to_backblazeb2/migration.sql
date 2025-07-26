/*
  Warnings:

  - You are about to drop the column `storage_path` on the `documents` table. All the data in the column will be lost.
  - Added the required column `bucket_id` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileId` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "storage_path",
ADD COLUMN     "bucket_id" TEXT NOT NULL,
ADD COLUMN     "fileId" TEXT NOT NULL;
