import axios from "axios"
import { useQuery } from "@tanstack/react-query"

import { Fees } from "@/types/api"

export const usePriorityFees = () => {
  return useQuery(["fees"], () => axios.get<Fees>("/api/priority-fees"), {
    refetchInterval: 10000,
  })
}
