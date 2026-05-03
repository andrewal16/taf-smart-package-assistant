-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DEALER_SALESMAN', 'SALES_OFFICER', 'SALES_HEAD', 'PRODUCT_ADMIN', 'CREDIT_ADMIN', 'RISK_ADMIN', 'COMPLIANCE_ADMIN', 'IT_ADMIN');

-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('DRAFT', 'PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'CREDIT_APPROVED', 'RISK_APPROVED', 'COMPLIANCE_APPROVED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('GREEN', 'YELLOW', 'MANUAL_REVIEW', 'NOT_RECOMMENDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "dealerId" TEXT,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dealer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleModel" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "variant" TEXT,
    "fuelType" TEXT,
    "otr" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "VehicleModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "branchId" TEXT,
    "dealerId" TEXT,
    "customerSegment" TEXT,
    "otrMin" DECIMAL(65,30),
    "otrMax" DECIMAL(65,30),
    "dpMinPct" DECIMAL(65,30) NOT NULL,
    "dpMaxPct" DECIMAL(65,30),
    "tenorMin" INTEGER NOT NULL,
    "tenorMax" INTEGER NOT NULL,
    "annualRatePct" DECIMAL(65,30) NOT NULL,
    "addmAllowed" BOOLEAN NOT NULL DEFAULT true,
    "addbAllowed" BOOLEAN NOT NULL DEFAULT true,
    "insuranceMode" TEXT NOT NULL DEFAULT 'ON_LOAN',
    "adminFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tacpAllowed" BOOLEAN NOT NULL DEFAULT false,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3) NOT NULL,
    "status" "PackageStatus" NOT NULL DEFAULT 'DRAFT',
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conditionJson" JSONB NOT NULL,
    "actionJson" JSONB NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "outputStatus" "RecommendationStatus" NOT NULL,
    "reasonCode" TEXT NOT NULL,
    "dealerWording" TEXT NOT NULL,
    "internalWording" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT,
    "branchId" TEXT,
    "createdById" TEXT NOT NULL,
    "customerAlias" TEXT,
    "productType" TEXT NOT NULL,
    "desiredInstallment" DECIMAL(65,30),
    "desiredTdp" DECIMAL(65,30),
    "selectedModel" TEXT,
    "status" "RecommendationStatus",
    "finalOutcome" TEXT,
    "lostReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "userId" TEXT NOT NULL,
    "inputJson" JSONB NOT NULL,
    "outputJson" JSONB NOT NULL,
    "status" "RecommendationStatus" NOT NULL,
    "reasonCodes" TEXT[],
    "packageIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Package_code_key" ON "Package"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Rule_code_key" ON "Rule"("code");
