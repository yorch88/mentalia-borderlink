import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import PageMeta from '@/components/PageMeta';
import { LuLogOut } from 'react-icons/lu';
import { Link } from 'react-router';
import borderLogo2 from '@/assets/images/border-logo2.png';
const Index = () => {
  return <>
      <PageMeta title="Logout" />
      <div className="relative min-h-screen w-full flex justify-center items-center py-16 md:py-10">
        <div className="card md:w-lg w-screen z-10">
          <div className="text-center px-10 py-12">
          <div className="flex justify-center mb-1">
              <img
                src={borderLogo2}
                alt="logo"
                className="w-[220px] sm:w-[260px] max-w-full h-auto object-contain drop-shadow-lg"
              />
            </div>
            <div className="mt-8 text-center">
              <div className="mb-4">
                <LuLogOut className="size-6 text-purple-500 fill-purple-100 mx-auto" />
              </div>
              <h4 className="mb-2 text-primary text-xl font-semibold">You are Logged Out</h4>
              <p className="mb-8 text-base text-default-500">
                Thank you for using tailwick admin template
              </p>
            </div>
            <Link to="/basic-login">
              <button className="btn bg-primary text-white w-full">Sign In</button>
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <svg aria-hidden="true" className="absolute inset-0 size-full fill-black/2 stroke-black/5 dark:fill-white/2.5 dark:stroke-white/2.5">
            <defs>
              <pattern id="authPattern" width="56" height="56" patternUnits="userSpaceOnUse" x="50%" y="16">
                <path d="M.5 56V.5H72" fill="none"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#authPattern)"></rect>
          </svg>
        </div>
      </div>
    </>;
};
export default Index;