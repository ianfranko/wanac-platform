import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <Image src="/logo.svg" alt="WANAC Logo" width={100} height={40} className="mb-6" />
          <ul className="space-y-3 text-sm font-semibold">
            <li>WAYS TO SUPPORT</li>
            <li>WISHBOOK</li>
            <li>VOLUNTEER</li>
          </ul>
        </div>

        <div>
          <ul className="space-y-3 text-sm font-semibold">
            <li>WANAC ADMISSIONS POLICY</li>
            <li>MEDIA ROOM</li>
            <li>SHARE YOUR STORY</li>
          </ul>
        </div>

        <div>
          <ul className="space-y-3 text-sm font-semibold">
            <li>CAREERS</li>
            <li>FIND A WANAC</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-base mb-3">FOLLOW</h3>
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
              <Image src="/app-store.svg" alt="App Store" width={120} height={40} />
              <Image src="/google-play.svg" alt="Google Play" width={120} height={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-10 border-t border-gray-700 pt-6">
        <p className="mb-2">The WANAC Platform is a not-for-profit organization. </p>
        <p className="mb-2">+1 (888) 484 3876 | PO Box 96860 Washington, DC 20077-7677</p>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-gray-400">
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
