import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import imgNotFound from '@/assets/images/img-not-found.png';
import imgNotFound2 from '@/assets/images/img-not-found2.png'
import { Home, House, Search, SearchIcon, Sparkles, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CardDescription } from "@/components/ui/card";
import { ROUTE_PATH } from "@/lib/Constant";
import Image from "next/image";
export default function NotFound() {
    return (
        <div className="page-layout dark:bg-black pt-0">
            {/* Banner Section */}
            <div className="banner-section py-[60px] lg:py-[100px]">
                <div className="lg:flex items-stretch px-4 lg:p-0">
                    <div className="w-full justify-center py-4 md:py-8 lg:py-10 xl:py-12 md:flex items-center">
                        <div className="relative z-10">
                            <div className="mb-[60px] lg:mb-[100px] text-center">
                                <Image width={250} height={213} alt='Img Not Found Img' className='img-fluid max-w-[250px] h-auto mx-auto mb-6' src={imgNotFound.src} />
                                <h1 className="h2 capitalize leading-tight mb-6 lg:mb-8 xl:mb-10 text-gray-190/70 lg:text-6xl text-3xl md:text-5xl sm:text-4xl">
                                    Oops! Page Not Found
                                </h1>
                                <p className="text-gray-775 text-xl lg:text-2xl font-medium">
                                    The link you followed might be broken, or the page may have been moved.
                                </p>
                            </div>
                            <h3 className="h4 capitalize text-gold-700/80 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-8 lg:mb-10 text-center">Try one of these instead</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 text-center md:max-w-5xl mx-auto">
                                <Link href={ROUTE_PATH.HOME} className="hover:bg-secondary-500/80 hover:border-secondary-500/80 group rounded-xl border border-primary-200 dark:border-primary-700 w-full min-h-[50px] md:min-h-[73px] p-4 flex items-center justify-center sm:justify-start gap-3">
                                    <Home className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary-500 group-hover:text-primary-700 transition-colors duration-200" />
                                    <p className="group-hover:text-primary text-base lg:text-xl font-semibold text-secondary-500/80">Go to Homepage</p>
                                </Link>
                                <Link href={ROUTE_PATH.BUSINESS} className="hover:bg-secondary-500/80 hover:border-secondary-500/80 group rounded-xl border border-primary-200 dark:border-primary-700 w-full min-h-[50px] md:min-h-[73px] p-4 flex items-center justify-center sm:justify-start gap-3">
                                    <Search className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-1 text-primary-500 group-hover:text-primary-700 transition-colors duration-200" />
                                    <p className="group-hover:text-primary text-base lg:text-xl font-semibold text-secondary-500/80">Search for a Service</p>
                                </Link>
                                <Link href={ROUTE_PATH.BUSINESS} className="hover:bg-secondary-500/80 hover:border-secondary-500/80 group rounded-xl border border-primary-200 dark:border-primary-700 w-full min-h-[50px] md:min-h-[73px] p-4 flex items-center justify-center sm:justify-start gap-3">
                                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary-500 group-hover:text-primary-700 transition-colors duration-200" />
                                    <p className="group-hover:text-primary text-base lg:text-xl font-semibold text-secondary-500/80">Use AI Chat Assistant</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*End  Banner Section */}
            {/* Grow Your Business with Us */}
            <div className="section section-join-us style-2 bg-primary-975 relative overflow-hidden">
                <div className="container lg:max-w-7xl md:max-w-5xl max-w-4xl mx-auto px-4 relative text-center lg:text-start">
                    <div className="lg:flex lg:flex-row items-center justify-between gap-10 md:gap-12 lg:gap-16">
                        <div className="lg:w-3/5 content-block lg:relative lg:z-10">
                            <h2 className="mb-3 text-secondary-500">
                                <span className="block mb-8">Find Trusted Experts</span>
                                <span className="inline-block px-2 py-1 bg-brown-825 text-white mb-8">for Every Need</span></h2>
                            <CardDescription className="text-xl lg:text-2xl text-brown-875/90 font-medium mb-10">
                                Tell us what you need, and we’ll connect you with verified professionals nearby.
                            </CardDescription>
                            <Button variant="secondary" className="bg-brown-890 hover:opacity-90" asChild>
                                <Link href="#" className="flex items-center gap-x-4 text-primary">
                                    <SearchIcon className="w-5 h-5 text-primary" />
                                    <span className="text-primary">Start Your Search Now</span>
                                </Link>
                            </Button>
                        </div>
                        <div className="lg:w-2/5">
                            <Image width={503} height={414} alt='Img not found' className='mx-auto lg:mx-0' src={imgNotFound2.src} />
                        </div>
                    </div>
                </div>
            </div>
            {/* End Grow Your Business with Us */}
        </div>
    );
}