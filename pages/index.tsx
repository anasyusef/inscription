import Head from "next/head"
import axios from "axios"
import { useQuery } from "react-query"

import { Fees } from "@/types/api"
import FileUpload from "@/components/file-upload"
import { Layout } from "@/components/layout"
import TransactionSpeed from "@/components/transaction-speed"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function IndexPage() {
  const { data: fees } = useQuery(
    "fees",
    () => axios.get<Fees>("/api/priority-fees"),
    {
      refetchInterval: 10000,
    }
  )

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
      <section className="container flex flex-col items-center space-y-10 pt-6 md:w-10/12 md:py-10 lg:w-8/12">
        <FileUpload />
        <div className="flex flex-col space-y-10 rounded-md bg-slate-100 p-10 drop-shadow-sm dark:bg-slate-800">
          <div className="flex w-full justify-center space-y-10 ">
            <div className="w-full space-y-3">
              <Label htmlFor="btc-address">
                Ordinal compatible BTC address
              </Label>
              <Input
                type="text"
                id="btc-address"
                placeholder="bc1phcspg4ejyze9yfxpmdhgru4ttw7am5l065sgdzrezddzdjcerj3s07203g"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-10">
            <TransactionSpeed {...fees?.data} />
          </div>
        </div>
      </section>
    </Layout>
  )
}
