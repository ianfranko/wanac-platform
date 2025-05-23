import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer({ hideFooter = false }) {
  const pathname = usePathname();
  
  // List of paths where the footer should be hidden
  const footerExcludedPaths = [
    '/dashboard',
    '/login',
    '/signup',
    '/signin',
    '/register',
    '/client',
    '/coach',
    '/admin',
    '/settings',
    '/appointments',
    '/messages',
    '/community',
    '/journal',
    '/aichatbot',
    '/lifescore',
    '/mycoach',
    '/library',
    
  ];
  
  // Check if current path starts with any of the excluded paths
  const shouldHideFooter = 
    hideFooter || 
    footerExcludedPaths.some(path => pathname?.startsWith(path));
  
  // If the footer should be hidden, don't render it
  if (shouldHideFooter) return null;
  
  return (
    <footer className="bg-white text-[#002147] pt-16 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <Image src="/WANAC N 8 Old Glory.svg" width={300} height={120} className="mb-6" alt="WANAC Logo" />
          <ul className="space-y-3 text-sm font-semibold">
            <li>SHOP MERCH</li>
            <li>HELP CENTER</li>
          </ul>
        </div>

        <div>
          <ul className="space-y-3 text-sm font-semibold">
            <li className="text-[#ff5e1a]">VOLUNTEER</li>
            <li>CORPORATE PARTNERS</li>
            <li>LEADERSHIP GIVING</li>
            <li>WAYS TO SUPPORT</li>
            <li>TESTIMONIALS</li>
          </ul>
        </div>

        <div>
          <ul className="space-y-3 text-sm font-semibold">
            <li className="text-[#ff5e1a]">WHY DO WE ALL NEED A COACH</li>
            <li>OUR APPROACH</li>
            <li>SUCCESSFUL PLANNING AND COACHING</li>
            <li>HIGH PERFORMANCE COACHING</li>
            <li>BOOTS TO COACHING BUSINESS</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-[#ff5e1a] text-base mb-3">FOLLOW</h3>
          <div className="flex items-center gap-4 text-xl">
            <FaFacebookF />
            <FaXTwitter />
            <FaYoutube />
            <FaInstagram />
            <FaLinkedinIn />
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-1">Service member or family?</h4>
            <p className="text-sm mb-4">Download our app to find events, locations and programs near you.</p>
            <div className="flex gap-4">
              <Image src="/png-transparent-app-store-apple-google-play-apple-text-logo-mobile-phones.png" alt="App Store" width={120} height={40} />
              <Image src="/png-transparent-get-it-on-google-play-button.png" alt="Google Play" width={120} height={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-brand-blue mt-10 border-t border-gray-700 pt-6">
        <p className="mb-2">The WANAC Platform is a not-for-profit organization.</p>
        <p className="mb-2">+1 (888) 484 3876 | PO Box 96860 Washington, DC 20077-7677</p>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-brand-blue">
          <span>Contact</span>
          <span>FAQs</span>
          <span>Terms of Use</span>
          <span>Privacy</span>
          <span>State Disclosures</span>
          <span>&copy; {new Date().getFullYear()} WANAC, Inc. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}
