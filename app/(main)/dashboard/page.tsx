"use client";

import { ReactNode, useState } from "react";
import {
  Wallet,
  ShieldAlert,
  Plus,
  Terminal as TerminalIcon,
} from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import UserView from "@/components/UserView";
import AdminView from "@/components/AdminView";

export type VestingSchedule = {
  receiver: string;
  vesting_id: number;
  token_mint: string;
  creator: string;
  start_time: number;
  end_time: number;
  cliff_time: number | null;
  total_amount: number;
  claimed_amount: number;
  vault_token_account: string;
  all_claimed: boolean;
};

export default function Dashboard() {
  const [tab, setTab] = useState<"user" | "admin">("user");

  return (
    <main className="min-h-screen bg-[#050505] text-green-400 font-mono p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className=" flex justify-between">
          <div className="flex gap-2 border-b border-green-900 pb-px">
            <TabButton
              active={tab === "user"}
              onClick={() => setTab("user")}
              label="User Portal"
              icon={<Wallet size={14} />}
            />
            <TabButton
              active={tab === "admin"}
              onClick={() => setTab("admin")}
              label="Admin Console"
              icon={<ShieldAlert size={14} />}
            />
          </div>
          <WalletMultiButton />
        </div>

        {tab === "user" ? <UserView /> : <AdminView />}
      </div>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
        active
          ? "bg-green-500 text-black shadow-[0_-4px_10px_rgba(34,197,94,0.3)]"
          : "text-green-900 hover:text-green-500"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
