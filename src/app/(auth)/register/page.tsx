import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import SignUpForm from './signUpForm';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Sign up'
};

export default function page() {

  return (
    <main className="flex h-screen items-center justify-center  bg-card-foreground p-4">
      <div className="flex h-full max-h-[25rem] w-full max-w-md flex-col rounded-xl  bg-secondary-foreground p-8 text-slate-300 shadow-lg">
        <div className="flex flex-col gap-6">
          <SignUpForm />
          <Link href="/login" className="text-slate-300 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
