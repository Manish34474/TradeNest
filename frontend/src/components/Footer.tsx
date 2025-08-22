import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
    return (
        <footer className="bg-neutral-900 text-neutral-100 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">TradeNest</h3>
                        <p className="text-neutral-300 text-sm leading-relaxed">
                            Your trusted marketplace for quality products. Connecting buyers and sellers worldwide.
                        </p>
                        <div className="flex space-x-4">
                            <Link to="#" className="text-neutral-400 hover:text-purple-400 transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link to="#" className="text-neutral-400 hover:text-purple-400 transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link to="#" className="text-neutral-400 hover:text-purple-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link to="#" className="text-neutral-400 hover:text-purple-400 transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/blog" className="text-neutral-300 hover:text-purple-400 transition-colors text-sm">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-neutral-300 hover:text-purple-400 transition-colors text-sm">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-neutral-300 hover:text-purple-400 transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/help" className="text-neutral-300 hover:text-purple-400 transition-colors text-sm">
                                    Help Center
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Sellers */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">For Sellers</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/sell" className="text-neutral-300 hover:text-purple-400 transition-colors text-sm">
                                    Start Selling
                                </Link>
                            </li>
                            <li>
                                <Link to="/seller-guide" className="text-neutral-300 hover:text-purple-400 transition-colors text-sm">
                                    Seller Guide
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/seller-policies"
                                    className="text-neutral-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Seller Policies
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/seller-support"
                                    className="text-neutral-300 hover:text-purple-400 transition-colors text-sm"
                                >
                                    Seller Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Contact Info</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-purple-400 flex-shrink-0" />
                                <span className="text-neutral-300 text-sm">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-purple-400 flex-shrink-0" />
                                <span className="text-neutral-300 text-sm">support@tradenest.com</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                <span className="text-neutral-300 text-sm">
                                    123 Commerce Street
                                    <br />
                                    Business District, NY 10001
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <p className="text-neutral-400 text-sm">© 2024 TradeNest. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link to="/privacy" className="text-neutral-400 hover:text-purple-400 transition-colors text-sm">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-neutral-400 hover:text-purple-400 transition-colors text-sm">
                            Terms of Service
                        </Link>
                        <Link to="/cookies" className="text-neutral-400 hover:text-purple-400 transition-colors text-sm">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
