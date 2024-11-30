"use client";

import DetailRoom from "@/component/detailOrderRoom/detailOrderRoom";

export default function Page({
  params,
}: {
  params: { roomId: string; detailId: string };
}) {
  return <DetailRoom roomId={params.roomId} detailId={params.detailId} />;
}
