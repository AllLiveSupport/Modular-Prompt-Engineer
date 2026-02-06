import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-4xl mt-12 py-8 border-t border-surface-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-surface-500 text-sm">
      <p>© {new Date().getFullYear()} Modular Prompt Engineer</p>
      <div className="flex items-center gap-6">
        <a
          href="https://alllive.support"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary-400 transition-colors"
        >
          Support
        </a>
        <a
          href="https://github.com/AllLiveSupport"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary-400 transition-colors tracking-wide font-medium"
        >
          GITHUB
        </a>
      </div>
    </footer>
  );
};

export default Footer;