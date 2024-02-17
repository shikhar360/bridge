export const ZOOMER_YELLOW = "#FEFC52";
export const GRUMPY_BLUE = "#47777C";


export const chainsTheme = [
  {
    chain : "BASE",
    theme : 'bg-[#0051ffff]',
  },
  {
    chain : "OPTIMISM",
    theme : 'bg-[#ff0000ff]',
  },
  {
    chain : "POLYGON",
    theme : 'bg-[#9d2adbff]',
  },
  {
    chain : "BINANCE",
    theme : 'bg-[#fab700ff]',
  },
  {
    chain : "ETHEREUM",
    theme : 'bg-[#5a80f2ff]',
  },
  {
    chain : "SOLANA",
    theme : 'bg-gradient-to-r from-[#13d6b6] via-[#617fe8] to-[#9a4bfa]',
  },
  {
    chain : "ARBITRUM",
    theme : 'bg-[#1c324aff]',
  },

]

export function getThemeColor(chain : string){
 const val = chainsTheme.filter(col => col.chain == chain)
 return val[0]
}