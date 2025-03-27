import Image from "next/image";
import Client1 from "../images/clients/google.svg";
import Client2 from "../images/clients/google-cloud.svg";
import Client3 from "../images/clients/microsoft.svg";
import Client4 from "../images/clients/netflix.svg";
import Client5 from "../images/clients/ge.svg";
import Client6 from "../images/clients/airbnb.svg";

export default function HeroSection() {
  return (
    <div className="relative pt-16 bg-gradient-to-br from-indigo-900 via-[#1e1b4b] to-violet-900">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100 dark:bg-gray-900"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Master DSA with</span>
            <span className="block text-violet-400">Daily Practice</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Join thousands of developers who are improving their problem-solving
            skills with our curated collection of DSA problems.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 md:py-4 md:text-lg md:px-10"
              >
                Start Practicing
              </a>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-violet-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-6">
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <Image src={Client1} alt="Client" className="h-12" />
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <Image src={Client2} alt="Client" className="h-12" />
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <Image src={Client3} alt="Client" className="h-12" />
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <Image src={Client4} alt="Client" className="h-12" />
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <Image src={Client5} alt="Client" className="h-12" />
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <Image src={Client6} alt="Client" className="h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
