import Header from '@/shared/components/Header/Header';
import type { Props } from './MainLayout.types';

const MainLayout = ({ children }: Props) => {
  return (
    <main className="flex-1">
      <Header />
      <section>{children}</section>
    </main>
  );
};

export default MainLayout;
