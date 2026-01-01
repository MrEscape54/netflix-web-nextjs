import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Landing() {
  const cookieStore = await cookies();
  const access = cookieStore.get('access_token')?.value;

  if (access) redirect('/browse/genre/83');

  return (
    <main style={{ padding: 32, maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: 44, marginBottom: 8 }}>
        Unlimited movies, TV shows, and more.
      </h1>
      <p style={{ opacity: 0.8 }}>
        Ready to watch? Enter your email to create or restart your membership.
      </p>

      <form action="/signup" method="get" style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <input
          name="email"
          placeholder="Email address"
          style={{ flex: 1, padding: 12, borderRadius: 10, border: '1px solid #ddd' }}
        />
        <button style={{ padding: '12px 18px', borderRadius: 10 }}>
          Get Started
        </button>
      </form>

      <div style={{ marginTop: 18 }}>
        <Link href="/login">Sign In</Link>
      </div>
    </main>
  );
}
