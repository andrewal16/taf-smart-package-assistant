import { PrismaClient, RecommendationStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const branch = await prisma.branch.upsert({
    where: { id: "kelapa-gading-branch" },
    update: { name: "Kelapa Gading", city: "Jakarta", isActive: true },
    create: { id: "kelapa-gading-branch", name: "Kelapa Gading", city: "Jakarta", isActive: true },
  });

  const dealer1 = await prisma.dealer.upsert({
    where: { id: "dealer-kelapa-gading-1" },
    update: { name: "Dealer Demo Kelapa Gading 1", branchId: branch.id, isActive: true },
    create: { id: "dealer-kelapa-gading-1", name: "Dealer Demo Kelapa Gading 1", branchId: branch.id, isActive: true },
  });

  await prisma.dealer.upsert({
    where: { id: "dealer-kelapa-gading-2" },
    update: { name: "Dealer Demo Kelapa Gading 2", branchId: branch.id, isActive: true },
    create: { id: "dealer-kelapa-gading-2", name: "Dealer Demo Kelapa Gading 2", branchId: branch.id, isActive: true },
  });

  const users: Array<{ email: string; name: string; role: UserRole }> = [
    { email: "dealer@example.com", name: "Dealer Demo", role: UserRole.DEALER_SALESMAN },
    { email: "so@example.com", name: "Sales Officer Demo", role: UserRole.SALES_OFFICER },
    { email: "head@example.com", name: "Sales Head Demo", role: UserRole.SALES_HEAD },
    { email: "product@example.com", name: "Product Admin Demo", role: UserRole.PRODUCT_ADMIN },
    { email: "credit@example.com", name: "Credit Admin Demo", role: UserRole.CREDIT_ADMIN },
    { email: "risk@example.com", name: "Risk Admin Demo", role: UserRole.RISK_ADMIN },
    { email: "compliance@example.com", name: "Compliance Admin Demo", role: UserRole.COMPLIANCE_ADMIN },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { ...user, dealerId: dealer1.id, branchId: branch.id },
      create: { ...user, dealerId: dealer1.id, branchId: branch.id },
    });
  }

  const vehicleModels = [
    { brand: "Toyota", model: "Avanza", otr: "260000000", fuelType: "ICE" },
    { brand: "Toyota", model: "Raize", otr: "255000000", fuelType: "ICE" },
    { brand: "Toyota", model: "Innova", otr: "420000000", fuelType: "ICE" },
    { brand: "Toyota", model: "bZ4X", otr: "1200000000", fuelType: "EV" },
  ];

  for (const vehicle of vehicleModels) {
    await prisma.vehicleModel.upsert({
      where: { id: `${vehicle.brand}-${vehicle.model}`.toLowerCase() },
      update: vehicle,
      create: { id: `${vehicle.brand}-${vehicle.model}`.toLowerCase(), ...vehicle },
    });
  }

  const createdBy = "product@example.com";
  const now = new Date();
  const nextYear = new Date(now);
  nextYear.setFullYear(now.getFullYear() + 1);

  const packages = [
    {
      code: "PKG-AVANZA-REG",
      name: "Avanza Regular Package",
      model: "Avanza",
      otrMin: "260000000",
      otrMax: "260000000",
      dpMinPct: "20",
      dpMaxPct: "40",
      tenorMin: 36,
      tenorMax: 60,
      annualRatePct: "6.5",
      addmAllowed: true,
      addbAllowed: true,
    },
    {
      code: "PKG-RAIZE-LOW",
      name: "Raize Low Installment Package",
      model: "Raize",
      otrMin: "255000000",
      otrMax: "255000000",
      dpMinPct: "20",
      dpMaxPct: "45",
      tenorMin: 48,
      tenorMax: 60,
      annualRatePct: "6.3",
      addmAllowed: true,
      addbAllowed: false,
    },
    {
      code: "PKG-INNOVA-5050",
      name: "Innova 50-50 Inspired Package",
      model: "Innova",
      otrMin: "420000000",
      otrMax: "420000000",
      dpMinPct: "30",
      dpMaxPct: "50",
      tenorMin: 12,
      tenorMax: 12,
      annualRatePct: "5.9",
      addmAllowed: true,
      addbAllowed: false,
    },
    {
      code: "PKG-BZ4X-REVIEW",
      name: "EV Review Package (bZ4X)",
      model: "bZ4X",
      otrMin: "1200000000",
      otrMax: "1200000000",
      dpMinPct: "30",
      dpMaxPct: "50",
      tenorMin: 36,
      tenorMax: 60,
      annualRatePct: "7.0",
      addmAllowed: true,
      addbAllowed: false,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { code: pkg.code },
      update: {
        ...pkg,
        productType: "New Car",
        brand: "Toyota",
        branchId: branch.id,
        insuranceMode: "ON_LOAN",
        adminFee: "0",
        tacpAllowed: false,
        effectiveFrom: now,
        effectiveTo: nextYear,
        status: "ACTIVE",
        approvalStatus: "APPROVED",
        createdById: createdBy,
      },
      create: {
        ...pkg,
        productType: "New Car",
        brand: "Toyota",
        branchId: branch.id,
        insuranceMode: "ON_LOAN",
        adminFee: "0",
        tacpAllowed: false,
        effectiveFrom: now,
        effectiveTo: nextYear,
        status: "ACTIVE",
        approvalStatus: "APPROVED",
        createdById: createdBy,
      },
    });
  }

  await prisma.rule.upsert({
    where: { code: "RULE-EV-MANUAL-REVIEW" },
    update: {
      name: "EV Review Package Manual Review",
      description: "EV packages require manual review by default.",
      conditionJson: { packageCode: "PKG-BZ4X-REVIEW" },
      actionJson: { forceStatus: "MANUAL_REVIEW", reasonCodes: ["RC05"] },
      outputStatus: RecommendationStatus.MANUAL_REVIEW,
      reasonCode: "RC05",
      dealerWording: "Perlu review TAF Officer.",
      internalWording: "EV package requires manual review.",
      isActive: true,
    },
    create: {
      code: "RULE-EV-MANUAL-REVIEW",
      name: "EV Review Package Manual Review",
      description: "EV packages require manual review by default.",
      conditionJson: { packageCode: "PKG-BZ4X-REVIEW" },
      actionJson: { forceStatus: "MANUAL_REVIEW", reasonCodes: ["RC05"] },
      outputStatus: RecommendationStatus.MANUAL_REVIEW,
      reasonCode: "RC05",
      dealerWording: "Perlu review TAF Officer.",
      internalWording: "EV package requires manual review.",
      isActive: true,
    },
  });

  console.log("Seed completed. Demo user password for all roles: demo1234");
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
