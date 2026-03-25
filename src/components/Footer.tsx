import { Link } from 'react-router-dom';
import { Mail, MapPin, ExternalLink, Building2 } from 'lucide-react';
import logo from '@/assets/logo.jpeg';

export function Footer() {
  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'All Banks', to: '/banks' },
    { label: 'Calculators', to: '/tools' },
    { label: 'Blogs', to: '/blogs' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Terms & Conditions', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Disclaimer', to: '/disclaimer' },
    { label: 'EMI Calculator', to: '/emi-calculator' },
    { label: 'SIP Calculator', to: '/sip-calculator' },
  ];

  const popularBanks = [
    { label: 'State Bank of India', to: '/bank/State Bank of India' },
    { label: 'HDFC Bank', to: '/bank/HDFC Bank' },
    { label: 'ICICI Bank', to: '/bank/ICICI Bank' },
    { label: 'Axis Bank', to: '/bank/Axis Bank' },
  ];

  return (
    <footer className="border-t border-border/40 bg-[#F5F5F5] text-[#222222]! backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo(0, 0)}>
              <img src={logo} alt="Bankifsccode.biz" className="h-10 w-10 rounded-full object-cover border-2 border-primary/30 shadow-md" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Bankifsccode.biz
              </span>
            </Link>
            <p className="text-sm text-black leading-relaxed">
              India's most trusted platform for finding bank IFSC codes.
              Quick, accurate, and always up-to-date.
            </p>
            <p className="text-xs text-muted-foreground">Built for simple, fast and reliable financial planning.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-black hover:text-primary transition-colors"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Banks */}
          <div>
            <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Popular Banks
            </h3>
            <ul className="space-y-2">
              {popularBanks.map((bank) => (
                <li key={bank.label}>
                  <Link
                    to={bank.to}
                    className="text-sm text-black hover:text-primary transition-colors"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {bank.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-black">
                <Mail className="h-4 w-4 text-primary" />
                ypawan12@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-black">
                <MapPin className="h-4 w-4 text-primary" />
                Bansi Siddharth nagar Up
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-6 border-t border-border/40 space-y-4">
          <div className="text-xs text-black text-center leading-relaxed max-w-4xl mx-auto">
            <span className="font-bold text-red-800">Disclaimer:</span> All information provided on this website is for informational purposes only. While we strive to ensure accuracy based on RBI data, we are not responsible for any errors, omissions, or financial losses arising from the use of this information. We are not affiliated with any bank. Users are strongly advised to verify details directly with the respective bank before initiating any transactions. We do not ask for OTPs or sensitive personal information; please be aware of banking frauds.
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-sm text-black text-center">© {new Date().getFullYear()} bankifsccode.biz</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
