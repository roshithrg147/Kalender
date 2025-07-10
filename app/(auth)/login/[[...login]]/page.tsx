import Image from 'next/image';
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
    return (
        <main className="flex flex-col items-center pw-5 gap-i10 animate-faded-in">
            <Image
                src='@/assets/logo.svg'
                alt="Logo"
                width={100}
                height={100}
            />

            <div className='mt-3'>
                <SignIn />
            </div>
        </main>
    )
}