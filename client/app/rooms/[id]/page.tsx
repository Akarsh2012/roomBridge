interface RoomDetailPageProps {
  params: { id: string };
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  return (
    <main>
      <h1>Room Details</h1>
      <p>Room ID: {params.id}</p>
    </main>
  );
}

