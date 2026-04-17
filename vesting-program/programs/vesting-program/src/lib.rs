use anchor_lang::prelude::*;
pub mod instructions;
pub mod state;
use crate::instructions::*;
declare_id!("4sLzzkUSM6mPuyiwmFLbkJHKtoPHnN5Yz8sUdqWJZbSd");

#[program]
pub mod vesting_program {

    use super::*;

    pub fn init_vesting_schedule(
        ctx: Context<InitVestingSchedule>,
        receiver_pubkey: Pubkey,
        amount: u64,
        cliff_time: Option<u64>,
        start_time: u64,
        end_time: u64,
        vesting_id: u64,
    ) -> Result<()> {
        init_vesting_schedule::handler(
            ctx,
            receiver_pubkey,
            amount,
            cliff_time,
            start_time,
            end_time,
            vesting_id,
        )?;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        withdraw::handler(ctx, amount);
        Ok(())
    }
}
