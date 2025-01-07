-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Guest');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Guest',
    "isVerify" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Info" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sphereDef" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Не задано',
    "about" TEXT NOT NULL DEFAULT 'Не задано',
    "nickname" TEXT NOT NULL DEFAULT 'Не задано',
    "phone" TEXT NOT NULL DEFAULT 'Не задано',
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "lang" TEXT NOT NULL DEFAULT 'ru',
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Docs" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "size" INTEGER NOT NULL,
    "date" BIGINT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Docs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Info_user_id_key" ON "Info"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Config_user_id_key" ON "Config"("user_id");

-- AddForeignKey
ALTER TABLE "Info" ADD CONSTRAINT "Info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Docs" ADD CONSTRAINT "Docs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
