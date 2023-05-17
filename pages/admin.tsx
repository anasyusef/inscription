import { useEffect, useState } from "react"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { sum } from "lodash"

const LoginPage = () => {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [data, setData] = useState<null | any[]>()

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient
        .from("Order")
        .select("*, File (*)")
        .eq("status", "payment_received_confirmed")
      setData(data as any)
    }
    // Only run query once user is logged in.
    if (user) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user)
    return (
      <section className="container my-10 justify-center space-y-8">
        <Auth
          appearance={{
            theme: ThemeSupa,
            style: { input: { color: "white" } },
          }}
          supabaseClient={supabaseClient}
          providers={[]}
          showLinks={false}
          socialLayout="horizontal"
        />
      </section>
    )

  if (data) {
    const revenue = sum(data.map((item) => item.total_payable_amount))
    const networkFeesList = data
      .map((item) => {
        return item.File.map((file: any) => file.network_fee)
      })
      .flat()
    const serviceFeesList = data
      .map((item) => {
        return item.File.map((file: any) => file.service_fee)
      })
      .flat()

    const networkFees = sum(networkFeesList)
    const serviceFees = sum(serviceFeesList)
    return (
      <>
        <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
        <p>
          Revenue: {revenue} sats ({revenue / 100_000_000} BTC)
        </p>
        <p>
          Network fees: {networkFees} sats ({networkFees / 100_000_000} BTC)
        </p>
        <p>
          Service fees: {serviceFees} sats ({serviceFees / 100_000_000} BTC)
        </p>
        <br />
        <p>
          Note that we need to factor out the 10,000 sats from the network fees
          from each inscription that gets returned to the service
        </p>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      </>
    )
  }
  return (
    <>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
    </>
  )
}

export default LoginPage
