import { redirect } from "next/navigation";

export default function LegoCandySlotsPage() {
  // MVP: only Robinson is available
  redirect("/games/robinson");
}
