use anchor_lang::prelude::*;
use anchor_spl::{token_2022::{Token2022, Transfer}, token_interface::{Mint, TokenAccount}};
use anchor_spl::token_2022::transfer;
use crate::state::VestingSchedule;

#[derive(Accounts)]
#[instruction(vesting_id:u64)]

pub struct Withdraw<'info>{
    #[account(mut)]
    pub receiver: Signer<'info>, 
    pub token_mint:InterfaceAccount<'info, Mint>,
    #[account(
        mut, 
        seeds = [b"vault_pda", token_mint.key().as_ref(),  receiver.key().as_ref(),  vesting_id.to_le_bytes().as_ref()], 
        bump
    )]
    pub vault_pda : Account<'info, VestingSchedule>,
    #[account(
        mut, 
        token::mint = token_mint, 
        token::authority = vault_pda
    )]
    pub vault_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init_if_needed, 
        payer = receiver, 
        token::mint = token_mint, 
        token::authority = receiver
    )] 
    pub receiver_token_account: InterfaceAccount<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token2022>,

}

pub fn handler(ctx:Context<Withdraw>, amount:u64)->Result<()>{
    
    transfer(CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(), Transfer{
            authority:ctx.accounts.vault_pda.to_account_info(), 
            from:ctx.accounts.vault_token_account.to_account_info(), 
            to:ctx.accounts.receiver_token_account.to_account_info()
        }, &[&[
            b"vault_pda", 
            ctx.accounts.token_mint.key().as_ref(), 
            ctx.accounts.receiver.key().as_ref(), 
            &ctx.accounts.vault_pda.vesting_id.to_le_bytes(), 
            &[ctx.bumps.vault_pda]
        ]]), amount)?;
    Ok(())
}