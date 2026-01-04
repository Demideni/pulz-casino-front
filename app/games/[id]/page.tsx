import { redirect } from "next/navigation";

type Props = { params: { id: string } };

export default function GameByIdPage({ params }: Props) {
  // MVP: keep backward compatibility for old links, but only Robinson is available.
  if (params.id && ["robinson", "robinzon-island", "robinzon", "robinzonisland"].includes(params.id.toLowerCase())) {
    redirect("/games/robinson");
  }
  redirect("/games/robinson");
}
