import { FormEvent, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { schemas } from "@/schemas"
import { useAuthStore, useStore } from "@/store"
import axios, { AxiosResponse } from "axios"
import clsx from "clsx"
import { Info, Loader2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { supabase } from "@/lib/supabaseClient"
import { isValidTaprootAddress } from "@/lib/utils"
import { HelpDialog } from "@/components/help-dialog"
import { InputAssets } from "@/components/input-assets"
import FileUpload from "@/components/input-assets/file-upload"
import { Layout } from "@/components/layout"
import { TransactionCost } from "@/components/transaction-cost"
import TransactionSpeed from "@/components/transaction-speed"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
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
    <div className="w-full">
      <div className="flex items-center space-x-2">
        <Label htmlFor="btc-address">Recipient Bitcoin address</Label>
        <HoverCard>
          <HoverCardTrigger>
            <span tabIndex={0}>
              <Info className="h-4 w-4" />
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="max-w-xs text-sm">
            <p>
              An ordinal compatible address is a Taproot address that starts
              with {"'bc1p'"}. If {"you're"} not sure whether your Bitcoin
              address is ordinal compatible, check out{" "}
              <Link
                target="_blank"
                href="https://docs.ordinals.com/guides/collecting/sparrow-wallet.html"
                className="underline"
              >
                this
              </Link>{" "}
              link on how to set up a wallet to receive inscriptions
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
      <p className="mt-1 mb-2 text-sm text-gray-700 dark:text-gray-400">
        Enter the Bitcoin address where you want to receive your inscription.
        This is also where we will send any refunds if need be.
      </p>

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
  const isAssetInputValid = useStore((s) => s.isInputAssetValid())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [openHelpDialog, setOpenHelpDialog] = useState(false)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setError("")
    e.preventDefault()
    const { priorityFee, recipientAddress, txSpeed, files } = store
    const orderId = uuidv4()
    try {
      setLoading(true)
      const {
        data: { address },
      } = await axios.get("/api/address")

      let requests: Promise<AxiosResponse<any, any>>[] = []

      if (store.type === "file") {
        requests = files.map((file) =>
          axios.post(`/api/orders`, {
            priorityFee,
            recipientAddress,
            assignedAddress: address,
            txSpeed,
            uid: authStore.uid,
            fileName: file.name,
            fileSize: file.size,
            orderId,
            mimeType: file.type,
            type: store.type,
            ref: router.query.ref || null,
          } as z.infer<(typeof schemas)["Orders"]["post"]>)
        )
      } else if (store.type === "text") {
        requests = [
          axios.post(`/api/orders`, {
            priorityFee,
            recipientAddress,
            assignedAddress: address,
            txSpeed,
            uid: authStore.uid,
            orderId,
            type: store.type,
            ref: router.query.ref || null,
          } as z.infer<(typeof schemas)["Orders"]["post"]>),
        ]
      }

      const responses = await Promise.all(requests)

      const arrayBuffers = await Promise.all(
        files.map((item) => item.arrayBuffer())
      )

      const uploadPromises = responses.map((item, idx) =>
        supabase.storage
          .from("orders")
          .upload(
            `${authStore.uid}/${orderId}/${item.data.id}`,
            arrayBuffers[idx],
            {
              contentType: files[idx].type,
            }
          )
      )

      await Promise.all(uploadPromises)
      // router.push(`/orders/${orderId}`)
      // store.clear()
    } catch (e: any) {
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

  const isFormValid = isAssetInputValid && !!store.recipientAddress
  return (
    <Layout>
      <HelpDialog
        open={openHelpDialog}
        onOpenChange={(value) => setOpenHelpDialog(value)}
      />
      <Head>
        <title>Inscribit</title>
        <meta
          name="description"
          content="Inscribe content onto the Bitcoin Blockchain"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container my-10">
        <div className="justify-center">
          <h1 className="text-center text-3xl font-black leading-tight tracking-tighter sm:text-3xl lg:text-4xl">
            Inscribe content onto the Bitcoin Blockchain
          </h1>
          <h2 className="text-center text-xl tracking-tight text-gray-500 dark:text-gray-300">
            Inscriptions made easy, for a lasting legacy
          </h2>
          <div className="mt-4 flex w-full items-center justify-center">
            <Button onClick={() => setOpenHelpDialog(true)}>
              How does it work?
            </Button>
          </div>
        </div>
        <form
          className="container flex flex-col items-center space-y-10 pt-6 md:py-10"
          onSubmit={handleSubmit}
        >
          <InputAssets />
          <div className="flex w-full flex-col space-y-5 rounded-md border border-black/5 bg-gray-50 p-4 dark:border-white/5 dark:bg-gray-900 sm:w-2/3 sm:p-10">
            <div className="flex w-full justify-center">
              <RecipientInput />
            </div>
            {isAssetInputValid && (
              <div className="flex w-full flex-col items-center">
                <TransactionSpeed />
              </div>
            )}
            <div className="mx-auto space-y-2 pb-5">
              <TransactionCost />
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <Button
                className="w-full md:w-1/2"
                type="submit"
                variant="default"
                disabled
                // disabled={!isFormValid || loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Service unavailable
                {/* Submit & Pay */}
              </Button>

              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        </form>
      </section>
    </Layout>
  )
}
