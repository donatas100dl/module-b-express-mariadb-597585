/*
  Warnings:

  - You are about to drop the column `addres` on the `places` table. All the data in the column will be lost.
  - Added the required column `address` to the `places` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `places` DROP COLUMN `addres`,
    ADD COLUMN `address` VARCHAR(255) NOT NULL;
