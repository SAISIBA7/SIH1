import NotificationDetailPage from "@/notification page/NotificationDetail";

export const metadata = {
  title: "Smart Crop | Alert Dossier & Action Impact",
  description: "Detailed Advisory Directives, Impact Radius, and Action Triggers.",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NotificationDetailPage id={id} />;
}
