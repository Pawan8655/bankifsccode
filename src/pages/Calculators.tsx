import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Calculator } from 'lucide-react';

export default function Calculators() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <Breadcrumbs items={[{ label: 'Banking Calculator Tools' }]} />

                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="p-6 rounded-full bg-primary/10 mb-6 animate-pulse">
                            <Calculator className="h-16 w-16 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                            Banking Calculator Tools
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Coming Soon...
                        </p>
                        <p className="mt-4 max-w-md text-sm text-muted-foreground/80">
                            We are working hard to bring you a comprehensive suite of banking calculators including EMI, FD, RD, and more. Stay tuned!
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
