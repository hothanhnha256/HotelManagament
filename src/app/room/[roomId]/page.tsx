"use client";

export default function Page({ params }: { params: { roomId: string } }) {
  return <div className="text-black">My Post: {params.roomId}</div>;
}
