/*
  Warnings:

  - You are about to alter the column `rating` on the `places` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `rating` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `places` MODIFY `rating` DECIMAL(65, 30) NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `reviews` MODIFY `rating` DECIMAL(65, 30) NOT NULL DEFAULT 1;
