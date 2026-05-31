import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2b2b2b] text-[#a0a0a0] py-16 px-6 md:px-16 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12 mb-8">
        <div className="md:col-span-2">
          <span className="text-2xl font-bold tracking-tight text-white block mb-4">TL;DR</span>
          <p className="max-w-xs leading-relaxed">Empowering students and professionals to learn faster and retain more with AI-driven study tools.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Product</h4>
          <ul className="space-y-3">
            <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="/use-cases" className="hover:text-white transition-colors">Use Cases</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Legal</h4>
          <ul className="space-y-3">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <p>© 2026 TL;DR.</p>
      </div>
    </footer>
  );
}