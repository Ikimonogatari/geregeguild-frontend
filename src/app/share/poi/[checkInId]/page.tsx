import { notFound } from 'next/navigation';

interface PublicCheckIn {
  username: string;
  rank: string;
  poiName: string;
  poiType: string;
  poiImage: string;
  karma: number;
  isFirstVisit: boolean;
}

export default async function SharePage({ params }: { params: Promise<{ checkInId: string }> }) {
  const { checkInId } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
  const res = await fetch(`${apiBase}/api/checkin/${checkInId}/public`, { cache: 'no-store' });
  if (!res.ok) notFound();
  const d: PublicCheckIn = await res.json();

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <article className="max-w-md w-full bg-neutral-900 rounded-3xl border-2 p-6"
        style={{ borderColor: '#C5A059' }}>
        <p className="text-xs uppercase tracking-wide" style={{ color: '#C5A059' }}>Gerege Guild</p>
        <h1 className="text-3xl mt-2" style={{ color: '#C5A059' }}>{d.poiName}</h1>
        <p className="text-sm text-neutral-400 mt-1">{d.rank} · {d.username} · +{d.karma} karma</p>
        {d.poiImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={d.poiImage} alt={d.poiName} className="w-full h-64 object-cover rounded-2xl mt-4" />
        )}
      </article>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ checkInId: string }> }) {
  const { checkInId } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
  const res = await fetch(`${apiBase}/api/checkin/${checkInId}/public`, { cache: 'no-store' });
  if (!res.ok) return { title: 'Gerege Guild' };
  const d: PublicCheckIn = await res.json();
  return {
    title: `${d.poiName} · Gerege Guild`,
    description: `${d.rank} ${d.username} earned ${d.karma} karma at ${d.poiName}.`,
  };
}
