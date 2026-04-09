import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VestingProgram } from "../target/types/vesting_program";
import {
  TOKEN_2022_PROGRAM_ID,
  InitializeMint2InstructionData,
} from "@solana/spl-token";
describe("vesting-program", async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.vestingProgram as Program<VestingProgram>;

  const creator = anchor.web3.Keypair.generate();
  const mintKeypair = anchor.web3.Keypair.generate();
  const receiverKeypair = anchor.web3.Keypair.generate();
  console.log("creator " + creator.publicKey.toString());
  console.log("receiver " + receiverKeypair.publicKey.toString());
  console.log("mint " + mintKeypair.publicKey.toString());
  await provider.connection.requestAirdrop(
    creator.publicKey,
    5 * anchor.web3.LAMPORTS_PER_SOL,
  );
  await provider.connection.requestAirdrop(
    receiverKeypair.publicKey,
    5 * anchor.web3.LAMPORTS_PER_SOL,
  );
  const space = await provider.connection.getMinimumBalanceForRentExemption(82);
  it("Is initialized!", async () => {
    const ix = [
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: creator.publicKey,
        lamports: space,
        newAccountPubkey: mintKeypair.publicKey,
        programId: TOKEN_2022_PROGRAM_ID,
        space: 82,
      }),
      initializeAccount2InstructionData,
    ];
  });
});
