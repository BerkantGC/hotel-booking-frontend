import Header from "@/components/Header";
import AIAgent from "@/components/AIAgent";
import { getSession } from "@/actions/authApi";

const PagesLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getSession();
    
    return (
        <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-4">
            {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
            © 2023 My Application
        </footer>
        {session && <AIAgent username={session.username} />}
        </div>
    );
}

export default PagesLayout;