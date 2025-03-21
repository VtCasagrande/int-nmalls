import { redirect } from 'next/navigation';

export default function Home() {
  // Redirecionar para o dashboard
  // Esta é a página inicial, mas queremos direcionar diretamente para o dashboard
  redirect('/dashboard');
} 