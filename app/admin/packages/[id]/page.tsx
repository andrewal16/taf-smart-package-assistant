type AdminPackageDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPackageDetailPage({ params }: AdminPackageDetailPageProps) {
  const { id } = await params;

  return <main className="p-6">Admin Package Detail Page: {id} (Sprint 0 scaffold)</main>;
}
