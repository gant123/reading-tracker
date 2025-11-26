-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarAccessories" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "avatarSeed" TEXT,
ADD COLUMN     "avatarStyle" TEXT NOT NULL DEFAULT 'adventurer';

-- CreateTable
CREATE TABLE "AvatarItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "pointsCost" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "rarity" TEXT NOT NULL DEFAULT 'common',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvatarItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAvatarItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserAvatarItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvatarItem_style_type_value_key" ON "AvatarItem"("style", "type", "value");

-- CreateIndex
CREATE INDEX "UserAvatarItem_userId_idx" ON "UserAvatarItem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAvatarItem_userId_itemId_key" ON "UserAvatarItem"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "UserAvatarItem" ADD CONSTRAINT "UserAvatarItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAvatarItem" ADD CONSTRAINT "UserAvatarItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "AvatarItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
