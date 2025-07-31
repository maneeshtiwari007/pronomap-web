// components/BackButton.tsx
'use client';

import { useNavigation } from '@/context/navigation-context';
import { ArrowLeft, ArrowLeftIcon, MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  const { lastPath } = useNavigation();

  const goBack = () => {
    if (lastPath) {
      router.push(lastPath);
    } else {
      router.push('/'); // fallback
    }
  };
  if (lastPath) {
    return (
      <button
        onClick={goBack}
        className="inline-flex items-center text-sm text-gray-600 hover:text-black hover:underline transition"
      >
        <MoveLeft className='mr-2' />Back
      </button>
    );
  } else {
    return (
      <div></div>
    )
  }
}
