import { LuFacebook, LuLinkedin } from "react-icons/lu";

export default function Footer({ data }) {
  const footer = data?.footer;
  const footerText = footer?.text ?? "© Borderlink";
  const socialLinks = footer?.socialLinks;

  return (
    <footer className="relative pt-20 pb-12 bg-default-800 dark:bg-default-900 min-h-[200px]">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Texto */}
          <div className="text-default-400 text-sm text-center md:text-left">
            {footerText}
          </div>

          {/* Redes */}
          <div className="flex gap-4">
            {socialLinks?.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 btn border border-default-400/40 bg-transparent rounded-full text-default-400 hover:text-primary flex items-center justify-center"
              >
                <LuLinkedin className="size-4" />
              </a>
            )}

            {socialLinks?.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 btn border border-default-400/40 bg-transparent rounded-full text-default-400 hover:text-primary flex items-center justify-center"
              >
                <LuFacebook className="size-4" />
              </a>
            )}
          </div>

        </div>
      </div>
    </footer>
  );
}
