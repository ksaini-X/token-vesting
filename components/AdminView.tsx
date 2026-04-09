"use client";

import { useState } from "react";
import useProgram from "@/hooks/useProgram";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Plus, Terminal as TerminalIcon, Loader2 } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor"; // Make sure anchor is installed

const INITIAL_FORM_STATE = {
  receiver: "",
  tokenMint: "",
  totalAmount: "",
  vestingId: "",
  startTime: "",
  endTime: "",
  cliffTime: "",
};

export default function AdminView() {
  const program = useProgram();
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM_STATE);

  const handleChange = (
    field: keyof typeof INITIAL_FORM_STATE,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  async function handleCreateVault() {
    if (!wallet.publicKey || !program) return;

    try {
      setLoading(true);

      // Convert strings to appropriate types (BN for u64)
      const totalAmountBN = new BN(form.totalAmount);
      const vestingIdBN =
        new BN(form.vestingId) || new BN(Math.random() * 10000000000);
      const startBN = new BN(form.startTime);
      const endBN = new BN(form.endTime);
      const cliffBN = form.cliffTime ? new BN(form.cliffTime) : null;
      const token_mint_pubkey = new PublicKey(form.tokenMint);
      const userTokenAccount = await connection.getTokenAccountsByOwner(
        wallet.publicKey,
        {
          mint: token_mint_pubkey,
        },
      );
      console.log(userTokenAccount.value[0].pubkey);

      // const res = await program.methods
      //   .initVestingSchedule(
      //     new PublicKey(form.receiver),
      //     totalAmountBN,
      //     cliffBN,
      //     startBN,
      //     endBN,
      //     vestingIdBN,
      //   )
      //   .accounts({
      //     tokenMint: token_mint_pubkey,
      //     creatorTokenAccount: userTokenAccount,
      //   })
      //   .rpc();

      // console.log("Vault Created:", res);
      setForm(INITIAL_FORM_STATE);
    } catch (err) {
      console.error("Creation failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 bg-black border border-green-900 p-6 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
          <h3 className="text-sm font-bold uppercase border-b border-green-900 pb-2 mb-4 flex items-center gap-2">
            <Plus size={14} /> Create New Vault
          </h3>

          <div className="space-y-4">
            <InputField
              label="Receiver Public Key"
              placeholder="Address..."
              value={form.receiver}
              onChange={(v) => handleChange("receiver", v)}
            />
            <InputField
              label="Token Mint Address"
              placeholder="Address..."
              value={form.tokenMint}
              onChange={(v) => handleChange("tokenMint", v)}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Total Amount"
                placeholder="0.00"
                value={form.totalAmount}
                onChange={(v) => handleChange("totalAmount", v)}
              />
              <InputField
                label="Vesting ID"
                placeholder="u64"
                value={form.vestingId}
                onChange={(v) => handleChange("vestingId", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Start Timestamp"
                placeholder="Unix..."
                value={form.startTime}
                onChange={(v) => handleChange("startTime", v)}
              />
              <InputField
                label="End Timestamp"
                placeholder="Unix..."
                value={form.endTime}
                onChange={(v) => handleChange("endTime", v)}
              />
            </div>

            <InputField
              label="Cliff Timestamp (Optional)"
              placeholder="Unix or Null"
              value={form.cliffTime}
              onChange={(v) => handleChange("cliffTime", v)}
            />

            <button
              onClick={handleCreateVault}
              disabled={loading || !wallet.publicKey}
              className="w-full py-4 mt-2 border-2 border-green-500 text-green-500 font-black uppercase hover:bg-green-500 hover:text-black transition-all tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Processing..." : "Create Vault"}
            </button>
          </div>
        </div>

        {/* Console Column */}
        <div className="space-y-4">
          <div className="bg-green-500/5 border border-green-900 p-6 h-full">
            <h3 className="text-sm font-bold uppercase mb-4 flex items-center gap-2 text-green-700">
              <TerminalIcon size={14} /> Console Output
            </h3>
            <div className="text-[10px] space-y-2 font-mono text-green-800">
              <p>
                {"> Receiver:"}{" "}
                <span className="text-green-400">
                  {form.receiver || "null"}
                </span>
              </p>
              <p>
                {"> Amount:"}{" "}
                <span className="text-green-400">
                  {form.totalAmount || "0"}
                </span>
              </p>
              <p>
                {"> Status:"}{" "}
                {loading ? (
                  <span className="text-amber-500">Executing...</span>
                ) : (
                  "Idle"
                )}
              </p>
              <p className="pt-4 opacity-50 underline italic">
                Estimated Rent: 0.0023 SOL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] uppercase text-green-800 font-bold">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black border border-green-900 px-3 py-2 text-xs text-green-400 focus:outline-none focus:border-green-500 placeholder:text-green-950 transition-colors"
      />
    </div>
  );
}
