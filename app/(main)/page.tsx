"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { ArrowRight, Terminal } from "lucide-react";
export default function Landing() {
  const { connected } = useWallet();
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-[#050505] text-green-400 font-mono flex flex-col items-center justify-center px-4 overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-lg">
        <header className="mb-10 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 text-[10px] border border-green-500/30 rounded bg-green-500/5">
            <Terminal size={12} className="animate-pulse" />{" "}
            <span className="tracking-[0.2em] uppercase">
              System: Initialized
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase  text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
            Vesting Vault
          </h1>
          <p className="text-green-600 text-sm">
            Automated Solana Token Distributions
          </p>
        </header>

        <div className="bg-black border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)] p-8 relative">
          <div className="flex flex-col gap-6">
            {!connected ? (
              <div className="space-y-6 text-center">
                <p className="text-xs text-green-500/60 leading-relaxed">
                  {
                    "> Identification required. Please initialize wallet handshake to proceed."
                  }
                </p>
                <div className="flex justify-center">
                  <WalletMultiButton className="!bg-green-500 !text-black !font-bold !rounded-none hover:!bg-white !transition-all" />
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="p-4 border border-green-500/30 bg-green-500/5 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-green-400 mb-1">
                    Access Status
                  </p>
                  <p className="text-sm font-bold text-white uppercase tracking-tighter">
                    Connection Established
                  </p>
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="group w-full py-4 bg-white text-black font-black uppercase tracking-tighter flex items-center justify-center gap-3 hover:bg-green-400 transition-colors hover:cursor-pointer"
                >
                  Enter Dashboard
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            )}

            <div className="border-t border-green-900 pt-6 flex">
              <div className="flex justify-between w-full">
                <ul className="grid grid-cols-1 gap-2 text-[10px] text-green-700 uppercase font-bold">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Trustless On-Chain
                    Logic
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Real-time
                    Streaming
                  </li>
                </ul>
              </div>
              {connected && <WalletMultiButton />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
