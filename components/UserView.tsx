import { VestingSchedule } from "@/app/(main)/dashboard/page";
import { ArrowDownToLine } from "lucide-react";
export default function UserView() {
  const myVestings: VestingSchedule[] = [
    {
      receiver: "User...42",
      vesting_id: 1,
      token_mint: "So11...1112",
      creator: "Vault...Admin",
      start_time: 1710000000,
      end_time: 1740000000,
      cliff_time: 1720000000,
      total_amount: 1000000000,
      claimed_amount: 400000000,
      vault_token_account: "Vlt...99",
      all_claimed: false,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-bold uppercase tracking-tighter italic">
          Active Schedules
        </h2>
        <span className="text-[10px] text-green-800">SCANNING_ON_CHAIN...</span>
      </div>

      {myVestings.map((v) => (
        <div
          key={v.vesting_id}
          className="border border-green-500/30 bg-green-500/5 p-6 rounded-none relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-green-700 uppercase">
                  Token Mint
                </p>
                <p className="text-white font-bold">{v.token_mint}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] text-green-700 uppercase">
                    Unlocked
                  </p>
                  <p className="text-lg">
                    {(v.claimed_amount / 1e9).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-green-700 uppercase">Total</p>
                  <p className="text-lg text-green-900">
                    / {(v.total_amount / 1e9).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-green-950">
                <div
                  className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
                  style={{
                    width: `${(v.claimed_amount / v.total_amount) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <p>
                  <span className="text-green-800">START:</span>{" "}
                  {new Date(v.start_time * 1000).toLocaleDateString()}
                </p>
                <p>
                  <span className="text-green-800">END:</span>{" "}
                  {new Date(v.end_time * 1000).toLocaleDateString()}
                </p>
                <p>
                  <span className="text-green-800">CLIFF:</span>{" "}
                  {v.cliff_time
                    ? new Date(v.cliff_time * 1000).toLocaleDateString()
                    : "NONE"}
                </p>
                <p>
                  <span className="text-green-800">ID:</span> #{v.vesting_id}
                </p>
              </div>

              <button className="w-full py-3 bg-green-500 text-black font-black uppercase hover:bg-white transition-colors flex items-center justify-center gap-2">
                <ArrowDownToLine size={16} />
                Withdraw Available
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
