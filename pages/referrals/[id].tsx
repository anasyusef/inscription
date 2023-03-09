import { GetServerSideProps } from "next"
import Head from "next/head"

import { prisma } from "@/lib/db"
import { ORDER_PENDING, Status } from "@/lib/utils"
import { Layout } from "@/components/layout"

interface Props {
  totalOrdersReferred: number
  totalAmountReferred: number
  totalAmountDue: number
  totalOrdersPending: number
  totalOrdersProcessed: number
  pctReferral: number
  referralId: string
}

export default function Page({
  pctReferral,
  totalAmountDue,
  totalAmountReferred,
  totalOrdersPending,
  totalOrdersProcessed,
  totalOrdersReferred,
  referralId,
}: Props) {
  return (
    <>
      <Head>
        <title>{referralId} - Referrals - Inscribit</title>
      </Head>
      <Layout>
        <section className="container my-10 justify-center space-y-8">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter sm:text-3xl lg:text-4xl">
            {referralId} Referrals
          </h1>
          <div className="flex w-full flex-col space-y-5 rounded-md border border-black/5 bg-gray-50 p-4 dark:border-white/5 dark:bg-gray-900 sm:p-10">
            <p className="text-center text-xl">
              Referral percentage:{" "}
              <span className="text-xl font-bold">{pctReferral}%</span>
            </p>
            <div className="flex justify-center">
              <CardData
                title="Amount Due"
                content={totalAmountDue}
                type="price"
              />
            </div>
            <div className="flex w-full justify-center space-x-4">
              <CardData
                title="Total Amount Referred"
                content={totalAmountReferred}
                type="price"
              />
              <CardData
                title="Total Orders Pending"
                content={totalOrdersPending}
              />
              <CardData
                title="Total Orders Processed"
                content={totalOrdersProcessed}
              />
              <CardData
                title="Total Orders Referred"
                content={totalOrdersReferred}
              />
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

interface CardDataProps {
  title: string
  content: number
  type?: "price" | "data"
}

function CardData({ content, title, type = "data" }: CardDataProps) {
  return (
    <div className="w-56 rounded-md border p-4 text-center">
      <p className="text-base font-semibold">{title}</p>
      <p className="text-3xl">
        {content}{" "}
        {type === "price" && (
          <span className="text-xs font-semibold uppercase">sats</span>
        )}
      </p>
    </div>
  )
}

const PCT_REFERRAL = 0.15
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  )

  const result = await prisma.order.findMany({
    select: { total_payable_amount: true, status: true },
    where: {
      ref: context.query.id as string,
    },
  })

  const totalAmountReferred = result
    .filter((item) => !ORDER_PENDING.includes(item.status as Status))
    .reduce((prev, acc) => +prev + Number(acc.total_payable_amount), 0)

  const totalAmountDue = Math.round(totalAmountReferred * PCT_REFERRAL)

  const totalOrdersPending = result.filter((item) =>
    ORDER_PENDING.includes(item.status as Status)
  ).length
  const totalOrdersProcessed = result.filter(
    (item) => !ORDER_PENDING.includes(item.status as Status)
  ).length

  const referralId =
    typeof context.query.id === "string" ? context.query.id : ""

  return {
    props: {
      totalOrdersReferred: result.length,
      totalAmountReferred,
      totalAmountDue,
      totalOrdersPending,
      totalOrdersProcessed,
      referralId: referralId,
      pctReferral: PCT_REFERRAL * 100,
    },
  }
}
