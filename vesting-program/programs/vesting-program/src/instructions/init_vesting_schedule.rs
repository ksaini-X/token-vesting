use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{Token2022, Transfer, transfer}, 
    token_interface::{Mint, TokenAccount}
};

use crate::state::VestingSchedule;

#[derive(Accounts)]
#[instruction(receiver_pubkey:Pubkey, vesting_id:u64)]
pub struct InitVestingSchedule<'info>{
    #[account(mut)]
    pub creator: Signer<'info>, 
    #[account(mut)]
    pub token_mint : InterfaceAccount<'info, Mint>, 

    #[account(mut)]
    pub creator_token_account : InterfaceAccount<'info, TokenAccount>, 

    #[account(
        init, 
        payer = creator, 
        seeds = [b"vault_pda", token_mint.key().as_ref(),  receiver_pubkey.as_ref(),  vesting_id.to_le_bytes().as_ref()],
        bump, 
        space = 8 + VestingSchedule::INIT_SPACE, 
    )]
    pub vault_pda : Account<'info, VestingSchedule>, 

    #[account(
        init, 
        payer  = creator, 
        token::mint = token_mint, 
        token::authority = vault_pda
    )]
    pub vault_token_acoount: InterfaceAccount<'info, TokenAccount>, 

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,

}

pub fn handler(
                ctx:Context<InitVestingSchedule>, 
                receiver_pubkey:Pubkey, 
                amount:u64, 
                cliff_time:Option<u64>, 
                start_time:u64, 
                end_time:u64, 
                vesting_id:u64
            )->
    Result<()>{

    transfer(CpiContext::new(
        ctx.accounts.token_program.to_account_info(), 
        Transfer{
            authority:ctx.accounts.creator.to_account_info(), 
            from:ctx.accounts.creator_token_account.to_account_info(),
            to:ctx.accounts.vault_token_acoount.to_account_info()
        }), amount)?;

    let  vault_pda = &mut ctx.accounts.vault_pda;

    vault_pda.vesting_id= vesting_id;

    vault_pda.cliff_time= cliff_time;
    vault_pda.start_time= start_time;
    vault_pda.end_time= end_time;
    
    vault_pda.total_amount = amount;
    vault_pda.all_claimed  = false;
    vault_pda.claimed_amount = 0;

    vault_pda.receiver= receiver_pubkey;
    vault_pda.creator = *ctx.accounts.creator.key;
    vault_pda.token_mint = ctx.accounts.token_mint.key();

    Ok(())
}