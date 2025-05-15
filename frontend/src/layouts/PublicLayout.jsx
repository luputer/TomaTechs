import { Navbar } from '@/components/navbar';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;