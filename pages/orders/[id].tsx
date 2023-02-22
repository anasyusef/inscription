import { useState } from "react"
import Error from "next/error"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAuthStore } from "@/store"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Clipboard, File, Loader2 } from "lucide-react"
import QRCode from "react-qr-code"

import { GetOrder } from "@/types/api"
import { STATUS, parseDate, parseFileSize, shortenAddress } from "@/lib/utils"
import { Layout } from "@/components/layout"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function OrderPage() {
  const router = useRouter()

  const { id } = router.query
  const { uid } = useAuthStore()
  const { data, isLoading, isError, isSuccess } = useQuery(
    ["order", uid, id],
    () => axios.get<GetOrder>(`/api/orders/${id}?uid=${uid}`),
    { retry: false, enabled: !!id, refetchInterval: 5_000 }
  )

  if (isError) {
    return <Error statusCode={404} />
  }

  const OrderSummary = (
    <>
      {isLoading && !isSuccess && (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      )}

      {isSuccess && (
        <>
          <div className="flex border-b border-black/10 pb-4 dark:border-white/10">
            {data.data.assets.map((asset) => (
              <div className="max-w-fit rounded-md bg-slate-400/20 p-4">
                {asset.mimeType.includes("image/") ? (
                  <Image
                    alt="thumbnail"
                    src={asset.url}
                    width={200}
                    height={200}
                  />
                ) : (
                  <File className="m-auto h-[150px] w-[100px]" />
                )}
                <div className=" my-2 rounded-md bg-slate-400/30 px-2 py-1">
                  <p className="font-medium">
                    File size: {parseFileSize(asset.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-b border-black/10 pb-4 dark:border-white/10">
            <div className="mt-4 flex justify-between gap-2">
              <p className="mb-3 text-sm">Created at</p>
              <p className="mb-3 text-right text-xs xl:text-sm">
                {parseDate(data.data.created_at)}
              </p>
            </div>
            <div className="flex justify-between gap-2">
              <p className="mb-3 text-sm">Recipient address</p>
              <p className="mb-3 text-right text-xs xl:text-sm">
                {shortenAddress(data.data.recipient_address, 10)}
              </p>
            </div>
            <div className="grid grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  Fee rate
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  Service Fee
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  Network Fee
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  {data.data.priority_fee} sats/vB
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  {data.data.service_fee} sats
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  {data.data.network_fee} sats
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2">
            <p>Total</p>
            <p className="text-right font-bold">
              {data.data.payable_amount}{" "}
              <span className="text-sm font-normal">sats</span>
            </p>
            <p className="col-span-2 text-right text-sm">
              ({data.data.payable_amount / 100_000_000} BTC)
            </p>
          </div>
        </>
      )}
    </>
  )

  return (
    <Layout>
      <section className="my-10 flex w-full justify-center">
        <div className="space-y-4 sm:w-2/3">
          <h2 className="px-6 text-lg font-semibold uppercase">
            Order ID: {id}
          </h2>
          <div className="flex overflow-hidden rounded-md border border-black/5 bg-slate-100 dark:border-white/5 dark:bg-slate-800 ">
            <div className="border-r-1 flex w-full flex-col p-8 lg:w-7/12">
              <Accordion className="mb-2 lg:hidden" type="single" collapsible>
                <AccordionItem value="order-summary">
                  <AccordionTrigger>Show order summary</AccordionTrigger>
                  <AccordionContent>{OrderSummary}</AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="mb-5 flex items-center">
                {isLoading ? (
                  <div className="h-5 w-60 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
                ) : (
                  <>
                    <div className="flex w-full flex-col border-b border-black/10 pb-2 dark:border-white/10">
                      <div className="flex w-full space-x-2 ">
                        <p className="text-lg font-semibold">
                          Status: {STATUS[data.data.status].parsed}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="h-3 w-3 animate-pulse rounded-full bg-green-600"></span>
                          <p className="text-sm font-bold uppercase text-green-600">
                            Live
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {STATUS[data.data.status].info}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {isLoading && !isSuccess && (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin" />
                </div>
              )}

              {isSuccess &&
                [
                  "broadcasted",
                  "broadcasted_confirmed",
                  "inscription_sent",
                  "inscription_sent_confirmed",
                ].includes(data?.data.status) && (
                  <InscriptionSummary
                    order={data?.data}
                    status={data?.data.status}
                  />
                )}

              {isSuccess && data?.data.status === "payment_pending" && (
                <PaymentInstructions
                  assignedBtcAddress={data.data.assigned_taproot_address}
                  payableAmount={data.data.payable_amount}
                />
              )}
              {/* {isSuccess && data?.data.status === "broadcasted" && (
              <InscriptionSummary commit={data?.data.} />
            )} */}
            </div>

            <div className="hidden flex-col bg-slate-200 p-8 dark:bg-slate-900 lg:flex lg:w-5/12">
              {OrderSummary}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

interface InscriptionSummaryProps {
  order: GetOrder
  status: string
}

function InscriptionSummary({ order, status }: InscriptionSummaryProps) {
  const inscription = order.inscription[0]
  const [copied, setCopied] = useState(false)
  const handleClick = async () => {
    setCopied(true)
    await navigator.clipboard.writeText(inscription.inscription)
  }
  return (
    <>
      <div className="space-y-2">
        <div className="flex w-full items-center justify-between space-x-4">
          <p className="min-w-fit">Inscription ID</p>{" "}
          <div className="flex w-full items-center space-x-2">
            <Input
              className="w-full"
              readOnly
              value={inscription.inscription}
            />
            <Button
              onMouseOut={() => setCopied(false)}
              onClick={handleClick}
              size="sm"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
        {status !== "inscription_sent_confirmed" ? (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Your inscription won&apos;t be shown on the ordinals explorer until
            it reaches 1-2 confirmations by the network
          </p>
        ) : (
          <div className="flex w-full justify-end">
            <Link
              target="_blank"
              href={`https://ordinals.com/inscription/${inscription.inscription}`}
            >
              <Button className="justify-end" variant="subtle">
                View inscription
              </Button>
            </Link>
          </div>
        )}
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Advanced details</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-6">
              <p className="font-semibold uppercase">Commit tx</p>
              <Link
                target="_blank"
                href={`https://mempool.space/tx/${inscription.commit}`}
                className="col-span-5 text-right uppercase underline"
              >
                {inscription.commit}
              </Link>
              <p className="font-semibold uppercase">Reveal tx</p>
              <Link
                target="_blank"
                href={`https://mempool.space/tx/${inscription.reveal}`}
                className="col-span-5 text-right uppercase underline"
              >
                {inscription.reveal}
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

interface PaymentInstructionsProps {
  payableAmount: number
  assignedBtcAddress: string
}

function PaymentInstructions({
  payableAmount,
  assignedBtcAddress,
}: PaymentInstructionsProps) {
  const [copiedBtcAmount, setCopiedBtcAmount] = useState(false)
  const [copiedBtcAddress, setCopiedBtcAddress] = useState(false)
  const handleClick = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setCopiedBtcAmount(true)
    await navigator.clipboard.writeText(
      (payableAmount / 100_000_000).toString()
    )
  }

  const handleOpenTooltipChange = (val: boolean) => {
    if (!val) {
      setCopiedBtcAmount(false)
    }
  }

  const handleCopyBtcAddress = async () => {
    setCopiedBtcAddress(true)
    await navigator.clipboard.writeText(assignedBtcAddress.toString())
  }

  return (
    <>
      <h2 className="mb-2 text-lg">Payment Instructions</h2>
      <div className="flex w-full flex-col items-center space-y-4 rounded-md border border-black/20 p-4 dark:border-white/20">
        <div className="flex items-center space-x-2">
          <p>Send </p>
          <div className="flex items-center space-x-2 rounded-md bg-slate-200 pl-2 dark:bg-slate-700">
            <span className="sm:text-md text-sm font-bold">
              {payableAmount / 100_000_000} BTC
            </span>
            <Tooltip onOpenChange={handleOpenTooltipChange} delayDuration={0}>
              <TooltipTrigger
                asChild
                onClick={handleClick}
                onPointerDown={handleClick}
              >
                <Button
                  size="sm"
                  className="rounded-r-md rounded-l-none border-l border-l-slate-700/20 bg-slate-200 dark:border-l-slate-200/20 dark:bg-slate-700"
                  variant="ghost"
                >
                  <Clipboard />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copiedBtcAmount ? "Copied!" : "Click to copy"}
              </TooltipContent>
            </Tooltip>
          </div>
          <p>to</p>
        </div>
        <QRCode
          value={`bitcoin:${assignedBtcAddress}`}
          className="h-auto rounded-md bg-white p-6"
        />
        <div className="flex w-full items-center space-x-2">
          <Input value={assignedBtcAddress} readOnly />
          <Button
            size="sm"
            onMouseOut={() => setCopiedBtcAddress(false)}
            onClick={handleCopyBtcAddress}
          >
            {copiedBtcAddress ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </>
  )
}
