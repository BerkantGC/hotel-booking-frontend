import Header from "@/components/Header";

const PagesLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-4">
            {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
            © 2023 My Application
        </footer>
        </div>
    );
}

export default PagesLayout;