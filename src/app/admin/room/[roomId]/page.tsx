"use client";

import ConfigRoom from "@/component/admin/configRoom/configRoom";

export default function Page({ params }: { params: { roomId: string } }) {
  return <ConfigRoom id={params.roomId} />;
}
