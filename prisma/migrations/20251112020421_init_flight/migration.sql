-- CreateTable
CREATE TABLE "Flight" (
    "id" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "operatorSarpas" VARCHAR(6) NOT NULL,
    "droneSisant" VARCHAR(10) NOT NULL,
    "polygonJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);
