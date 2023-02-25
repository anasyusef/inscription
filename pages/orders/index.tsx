import Image from "next/image"
import { useRouter } from "next/router"
import { useAuthStore } from "@/store"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { format } from "date-fns"
import { File, Loader2 } from "lucide-react"

import { GetOrders } from "@/types/api"
import { STATUS, parseDate, parseFileSize } from "@/lib/utils"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  const store = useAuthStore()
  const router = useRouter()
  const { data, isLoading } = useQuery(["orders", store.uid], () =>
    axios.get<GetOrders>(`/api/orders?uid=${store.uid}`)
  )

  const EmptyState = (
    <div className="flex h-[300px] w-full flex-col items-center justify-center">
      <h1 className="w-full justify-center text-center text-xl font-bold uppercase">
        No orders found {":("}
      </h1>
      <p className="text-md text-gray-700 dark:text-gray-300">
        Your orders will start appearing here once you submit your first
        inscription
      </p>
    </div>
  )

  return (
    <Layout>
      <section className="my-10 flex w-full justify-center">
        <div className="w-full space-y-4">
          <h1 className="container text-lg font-semibold uppercase">
            Past orders
          </h1>
          <div className="container rounded-md border border-black/5 bg-slate-100 p-4 dark:border-white/5 dark:bg-slate-800">
            {isLoading ? (
              <div className="flex h-[300px] w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>
            ) : (
              <>
                {data?.data.orders.length === 0 && EmptyState}
                <div className="grid grid-cols-1 gap-5 sm:auto-cols-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {data?.data.orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-md border p-4 dark:border-slate-200/20"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase">
                          {order.id}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {order.files.slice(0, 3).map((file) => (
                          <div
                            key={file.id}
                            className="my-2 max-w-fit rounded-md bg-slate-400/20 p-4"
                          >
                            {file.mime_type.startsWith("image/") ? (
                              <Image
                                alt="thumbnail"
                                src={file.asset_url}
                                width={50}
                                height={50}
                              />
                            ) : (
                              <File className="m-auto h-[50px] w-[50px]" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-xs font-semibold uppercase">
                        {order.uiOrderStatusTitle ? order.uiOrderStatusTitle : STATUS[order.status].parsed}
                      </div>
                      <p className="text-sm">{parseDate(order.created_at)}</p>
                      <Button
                        onClick={() => router.push(`/orders/${order.id}`)}
                        size="sm"
                        className="mt-2 w-full"
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
