"use client";
import * as anchor from "@coral-xyz/anchor";
import {
  AnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import idl from "../vesting-program/target/idl/vesting_program.json";
import { VestingProgram } from "../vesting-program/target/types/vesting_program";
import { useMemo } from "react";
export default function useProgram() {
  const wallet = useWallet() as AnchorWallet;
  const { connection } = useConnection();
  const program = useMemo(() => {
    const provider = new anchor.AnchorProvider(connection, wallet);
    const program: anchor.Program<VestingProgram> = new anchor.Program(
      idl,
      provider,
    );
    return program;
  }, [connection, wallet]);
  return program;
}
