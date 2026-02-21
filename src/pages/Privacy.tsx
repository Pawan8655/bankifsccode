import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function Privacy() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

                    <div className="max-w-4xl mx-auto py-8">
                        <h1 className="text-3xl font-bold mb-6 text-foreground">Privacy Policy</h1>
                        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground">
                            <p>At Bankifsccode.biz, the privacy of our visitors is of extreme importance to us. This privacy policy document outlines the types of personal information received and collected by us and how it is used.</p>

                            <h2 className="text-foreground mt-6 mb-2 font-semibold text-xl">1. Information We Collect</h2>
                            <p>We do not require users to create an account or provide personal information to search for IFSC codes. However, we may collect:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Log Files:</strong> Like many other websites, we make use of log files. The information inside the log files includes IP addresses, browser type, ISP, date/time stamp, and referring/exit pages. This data is not linked to any information that is personally identifiable.</li>
                                <li><strong>Cookies:</strong> We use cookies to store information about visitors' preferences and to customize user experience.</li>
                            </ul>

                            <h2 className="text-foreground mt-6 mb-2 font-semibold text-xl">2. Use of Information</h2>
                            <p>Any information collected is used solely for the purpose of improving the website experience, analyzing trends, and administering the site.</p>

                            <h2 className="text-foreground mt-6 mb-2 font-semibold text-xl">3. Third-Party Services</h2>
                            <p>We may use third-party advertising companies to serve ads when you visit our website. These companies may use aggregated information (not including your name, address, email address or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>

                            <h2 className="text-foreground mt-6 mb-2 font-semibold text-xl">4. Data Security</h2>
                            <p>We implement standard security measures to protect against unauthorized access to data. However, no method of transmission over the internet is 100% secure.</p>

                            <h2 className="text-foreground mt-6 mb-2 font-semibold text-xl">5. Consent</h2>
                            <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>

                            <p className="mt-8 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
