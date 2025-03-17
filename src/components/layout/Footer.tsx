import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Authentic Cuisine Finder</h2>
            <p className="text-gray-400">© {new Date().getFullYear()} All Rights Reserved</p>
          </div>
          <div className="flex gap-4">
            <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;