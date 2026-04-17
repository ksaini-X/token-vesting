import { LiteSVM } from "litesvm";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { address, lamports } from "@solana/kit";

test("spl logging", () => {
  const programId = PublicKey.unique();
  const svm = new LiteSVM();
  svm.addProgramFromFile(
    address(programId.toString()),
    "../target/deploy/vesting_program.so",
  );
  const payer = new Keypair();
  svm.airdrop(
    address(payer.publicKey.toString()),
    lamports(BigInt(LAMPORTS_PER_SOL)),
  );
  const blockhash = svm.latestBlockhash();
  const ixs = [
    new TransactionInstruction({
      programId,
      keys: [
        { pubkey: PublicKey.unique(), isSigner: false, isWritable: false },
      ],
    }),
  ];
  const tx = new Transaction();
  tx.recentBlockhash = blockhash;
  tx.add(...ixs);
  tx.sign(payer);
});
