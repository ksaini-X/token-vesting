import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VestingProgram } from "../target/types/vesting_program";
import {
  createInitializeMint2Instruction,
  getAssociatedTokenAddressSync,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { address } from "@solana/kit";

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
    const t = new anchor.web3.Transaction();
    t.add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: creator.publicKey,
        lamports: space,
        newAccountPubkey: mintKeypair.publicKey,
        programId: TOKEN_2022_PROGRAM_ID,
        space: 82,
      }),
    );
    t.add(
      createInitializeMint2Instruction(
        mintKeypair.publicKey,
        6,
        creator.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID,
      ),
    );
    const { blockhash, lastValidBlockHeight } =
      await provider.connection.getLatestBlockhash();
    t.recentBlockhash = blockhash;
    t.lastValidBlockHeight = lastValidBlockHeight;
    t.partialSign(mintKeypair);
    t.feePayer = creator.publicKey;
    const sig = await provider.connection.sendTransaction(t, [creator]);
    const confirsm = await provider.connection.confirmTransaction(
      sig,
      "confirmed",
    );
    console.log("Created " + confirsm);

    const creatorAta = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      creator.publicKey,
    );

    await mintTo(
      provider.connection,
      creator,
      mintKeypair.publicKey,
      creatorAta,
      creator,
      10000,
    );

    const a = await program.methods
      .initVestingSchedule(
        receiverKeypair.publicKey,
        new anchor.BN(100),
        new anchor.BN(0),
        new anchor.BN(0),
        new anchor.BN(0),
        new anchor.BN(Math.random() * 1000),
      )
      .accounts({
        creator: creator.publicKey,
        creatorTokenAccount: creatorAta,
        tokenMint: mintKeypair.publicKey,
      })
      .rpc();

    console.log("Created");
    console.log(a);
  });
});
