import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import LoginForm from './loginUpForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login'
};

export default function page() {
  return (
    <main className="flex h-screen items-center justify-center bg-card-foreground p-4">
      <div className="flex h-full max-h-[20rem] w-full max-w-md flex-col rounded-xl bg-secondary-foreground p-8 text-slate-300 shadow-lg">
        <div className="flex flex-col gap-6">
          <LoginForm />
          <Link href="/register" className="text-slate-300 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
