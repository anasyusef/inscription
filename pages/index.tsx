import { FormEvent, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { usePriorityFees } from "@/hooks/usePriorityFees"
import { useAuthStore, useStore } from "@/store"
import axios from "axios"
import { Network, getAddressInfo } from "bitcoin-address-validation"
import clsx from "clsx"
import { Loader2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Fees, PostOrder } from "@/types/api"
import { supabase } from "@/lib/supabaseClient"
import { isValidTaprootAddress, uuidv4Regex } from "@/lib/utils"
import FileUpload from "@/components/file-upload"
import { Layout } from "@/components/layout"
import { PaymentDialog } from "@/components/payment-dialog"
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
    const isValidAddress = isValidTaprootAddress(value)
    if (!isValidAddress) {
      setError("Address is not an ordinal-compatible address")
    } else {
      setError("")
      store.setRecipientAddress(value)
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
  const router = useRouter()
  const authStore = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setError("")
    e.preventDefault()
    const { priorityFee, recipientAddress, txSpeed, files } = store
    try {
      setLoading(true)
      const { data } = await axios.post<PostOrder>(`/api/orders`, {
        priorityFee,
        recipientAddress,
        txSpeed,
        uid: authStore.uid,
        combinedFileSizes: files
          .map((file) => file.size)
          .reduce((a, b) => a + b, 0),
      })

      const arrayBuffers = await Promise.all(
        files.map((item) => item.arrayBuffer())
      )

      const uploadPromises = files.map((item, idx) =>
        supabase.storage
          .from("orders")
          .upload(
            `${data.uid}/${data.orderId}/${uuidv4()}`,
            arrayBuffers[idx],
            {
              contentType: item.type,
            }
          )
      )

      await Promise.all(uploadPromises)
      store.clear()
      router.push(`/orders/${data.orderId}`)
    } catch (e) {
      const msg = e.response.data.message
      if (typeof msg === "string") {
        setError(e.response.data.message)
      } else {
        console.log(e)
        setError("Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = !!store.files.length && !!store.recipientAddress
  return (
    <Layout>
      <Head>
        <title>Inscribit</title>
        <meta
          name="description"
          content="Inscribe content onto the Bitcoin Blockchain"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <section>
        <div>
          <h1 className="mt-10 text-center text-3xl font-black leading-tight tracking-tighter sm:text-3xl lg:text-4xl">
            Inscribe content onto the Bitcoin Blockchain
          </h1>
          <h2 className="text-center text-xl text-gray-300">Inscriptions made easy, for a lasting legacy</h2>
        </div>
        <form
          className="container flex flex-col items-center space-y-10 pt-6 md:w-10/12 md:py-10 lg:w-8/12"
          onSubmit={handleSubmit}
        >
          <FileUpload />
          <div className="flex flex-col space-y-5 rounded-md border border-black/5 bg-slate-100 p-10 dark:border-white/5 dark:bg-slate-800 sm:w-2/3">
            <div className="flex w-full justify-center">
              <RecipientInput />
            </div>
            {!!store.files.length && (
              <div className="flex flex-col items-center justify-center py-5">
                <div className="flex flex-col items-center">
                  <TransactionSpeed />
                </div>
              </div>
            )}
            <div className="mx-auto space-y-2 pb-5">
              <TxCost />
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <Button
                className="w-full md:w-1/2"
                type="submit"
                variant="default"
                disabled={!isFormValid || loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit & Pay
              </Button>

              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        </form>
      </section>
    </Layout>
  )
}
