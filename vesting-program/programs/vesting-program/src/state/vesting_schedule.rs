use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct VestingSchedule {
    pub receiver: Pubkey,

    pub vesting_id: u64,
    pub token_mint: Pubkey,

    pub creator: Pubkey,

    pub start_time: u64,
    pub end_time: u64,
    pub cliff_time: Option<u64>,

    pub total_amount: u64,
    pub claimed_amount: u64,

    pub vault_token_account: Pubkey,
    pub all_claimed: bool,
}
