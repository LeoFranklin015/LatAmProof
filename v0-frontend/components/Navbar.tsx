import { Globe } from "lucide-react";
import { CustomConnectButton } from "./ConnectButton";

export const Navbar = () => {
  return (
    <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
      <div className="flex items-center space-x-2">
        <Globe className="h-8 w-8 text-sky-400" />
        <span className="text-2xl font-bold text-sky-400">LatAm Proof</span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <a
          href="/verify"
          className="text-foreground hover:text-sky-400 transition-colors"
        >
          Verify Identity
        </a>
      </div>

      <div className="flex items-center">
        <CustomConnectButton />
      </div>
    </nav>
  );
};
