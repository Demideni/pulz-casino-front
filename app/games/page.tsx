import { redirect } from "next/navigation";

export default function GamesPage() {
  // MVP: only Robinson is available
  redirect("/games/robinson");
}
