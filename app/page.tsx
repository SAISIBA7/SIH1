import { redirect } from "next/navigation";

export const metadata = {
  title: "Smart Crop | Authentication",
  description: "Smart Crop authentication and login portal.",
};

export default function Home() {
  redirect("/authentication");
}

