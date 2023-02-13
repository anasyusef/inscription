import mempool from "@mempool/mempool.js"

export const { bitcoin: bitcoinMempool } = mempool({
  hostname: "mempool.space",
})
