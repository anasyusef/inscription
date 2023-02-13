import { FormEvent, useState } from "react"
import Head from "next/head"
import { usePriorityFees } from "@/hooks/usePriorityFees"
import { useStore } from "@/store"
import axios from "axios"
import { Network, getAddressInfo } from "bitcoin-address-validation"
import clsx from "clsx"

import { Fees } from "@/types/api"
import FileUpload from "@/components/file-upload"
import { Layout } from "@/components/layout"
import TransactionSpeed from "@/components/transaction-speed"
import { TxCost } from "@/components/tx-cost"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function RecipientInput() {
  const store = useStore()
  const [error, setError] = useState("")
  const [value, setValue] = useState("")
  const handleBlur = () => {
    try {
      const { network, type, bech32 } = getAddressInfo(value)
      if (network !== "mainnet" || type !== "p2tr" || !bech32) {
        setError("Address is not an ordinal-compatible address")
      } else {
        setError("")
        store.setRecipientAddress(value)
      }
      console.log(type)
    } catch (e) {
      setError(e.message)
    }
  }
  return (
    <div className="w-full space-y-3">
      <Label htmlFor="btc-address">Ordinal compatible BTC address</Label>
      <Input
        type="text"
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        className={clsx({ "focus:ring-red-500 border-red-500": !!error })}
        value={value}
        id="btc-address"
        placeholder="bc1phcspg4ejyze9yfxpmdhgru4ttw7am5l065sgdzrezddzdjcerj3s07203g"
      />
      {error && <Label className="text-red-500">{error}</Label>}
    </div>
  )
}

export default function IndexPage() {
  const store = useStore()
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  return (
    <Layout>
      <Head>
        <title>Next.js</title>
        <meta
          name="description"
          content="Next.js template for building apps with Radix UI and Tailwind CSS"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={handleSubmit}>
        <section className="container flex flex-col items-center space-y-10 pt-6 md:w-10/12 md:py-10 lg:w-8/12">
          <FileUpload />
          <div className="flex flex-col space-y-10 rounded-md border border-black/5 bg-slate-100 p-10 dark:border-white/5 dark:bg-slate-800 sm:w-2/3">
            <div className="flex w-full justify-center">
              <RecipientInput />
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <TransactionSpeed />
              </div>
            </div>
            <div className="mx-auto space-y-2">
              <TxCost />
            </div>
            <Button
              type="submit"
              onClick={() => console.log("Aloo")}
              variant="default"
            >
              Submit
            </Button>
          </div>
        </section>
      </form>
    </Layout>
  )
}
