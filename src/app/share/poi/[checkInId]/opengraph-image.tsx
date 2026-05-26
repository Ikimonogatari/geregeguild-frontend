import { ImageResponse } from 'next/og';

export const alt = 'Gerege Guild check-in';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface PublicCheckIn {
  username: string;
  rank: string;
  poiName: string;
  karma: number;
}

export default async function OGImage({ params }: { params: Promise<{ checkInId: string }> }) {
  const { checkInId } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
  const res = await fetch(`${apiBase}/api/checkin/${checkInId}/public`);
  const d: PublicCheckIn = res.ok ? await res.json() : { username: '', rank: '', poiName: 'Gerege Guild', karma: 0 };

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#0A0A0A',
          color: '#F6F1E7',
          padding: 64,
          border: '8px solid #C5A059',
        }}
      >
        <div style={{ color: '#C5A059', fontSize: 36, display: 'flex' }}>Gerege Guild</div>
        <div style={{ fontSize: 84, marginTop: 32, display: 'flex' }}>{d.poiName}</div>
        <div style={{ fontSize: 40, color: '#C5A059', marginTop: 24, display: 'flex' }}>+{d.karma} karma</div>
        <div style={{ fontSize: 28, color: '#8B8B8B', marginTop: 24, display: 'flex' }}>{d.rank} · {d.username}</div>
      </div>
    ),
    size,
  );
}
