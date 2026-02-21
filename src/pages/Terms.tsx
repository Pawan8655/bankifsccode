import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Terms() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

                    <div className="max-w-4xl mx-auto py-8">
                        <h1 className="text-3xl font-bold mb-6 text-foreground">Terms and Conditions</h1>
                        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground">
                            <p>Welcome to Bankifsccode.biz. By accessing or using our website, you agree to be bound by these Terms and Conditions.</p>

                            <h2 className="text-foreground mt-6 mb-2 font-semibold text-xl">1. Acceptance of Terms</h2>
                            <p>By using this website, you signify your acceptance of these terms. If you do not agree to these terms, please do not use our site.</p>

                            <h2 className="text-foreground mt-6 mb-2 font-semibold text-xl">2. Use of Information</h2>
                            <p>The content provided on Bankifsccode.biz, including IFSC codes, MICR codes, and bank branch details, is for general informational purposes only. While we source data from reliable public records (such as RBI), we generally do not guarantee its absolute accuracy or completeness at all times.</p>

                            <h2 className="text-foreground mt-6 mb-2 font-semibold text-xl">3. User Responsibilities</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>You agree to use the data for legal and legitimate purposes only.</li>
                                <li>You are responsible for verifying any banking codes with the respective bank before initiating financial transactions.</li>
                                <li>We are not liable for any failed transactions or financial losses resulting from the use of information found on this site.</li>
                            </ul>

                            <h2 className="text-foreground mt-6 mb-2 font-semibold text-xl">4. Disclaimer of Liability</h2>
                            <p>Bankifsccode.biz and its operators shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the website or reliance on its content.</p>

                            <h2 className="text-foreground mt-6 mb-2 font-semibold text-xl">5. Changes to Terms</h2>
                            <p>We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of the modified terms.</p>

                            <p className="mt-8 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
