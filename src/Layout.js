import { useAuth } from "@/lib/AuthContext";
import Sidebar from "@/layout/Sidebar";
import AuthSidebar from "@/components/layout/AuthSidebar";

export default function Layout({ children, currentPageName }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <style>{`
        :root {
          --purple-glow: rgba(139, 92, 246, 0.15);
          --blue-glow: rgba(59, 130, 246, 0.15);
        }
        
        body {
          background: 
            radial-gradient(ellipse 80% 50% at 20% 40%, var(--purple-glow) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, var(--blue-glow) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 50% 90%, var(--purple-glow) 0%, transparent 50%),
            #030712;
          background-attachment: fixed;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8b5cf6 0%, #3b82f6 100%);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #a78bfa 0%, #60a5fa 100%);
        }

        /* Selection styling */
        ::selection {
          background: rgba(139, 92, 246, 0.4);
          color: white;
        }

        /* Font import */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Animated Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
      </div>

      {/* Sidebars */}
      <Sidebar currentPage={currentPageName} user={user} />
      <AuthSidebar />

      {/* Main Content */}
      <main className="ml-64 mr-72 min-h-screen relative z-10">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
