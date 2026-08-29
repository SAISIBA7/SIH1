import { redirect } from "next/navigation";

export const metadata = {
  title: "Smart Crop | Farmer Advisory & Authentication",
  description: "Smart Crop authentication and dashboard portal.",
};

export default function Home() {
  redirect("/dashboard");
}
