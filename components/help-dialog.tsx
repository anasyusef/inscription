import Link from "next/link"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>How does it work?</DialogTitle>
          <DialogDescription>
            Inscribit makes it easy to inscribe your digital content onto the
            Bitcoin blockchain by following these simple steps
          </DialogDescription>
          <div className=" space-y-3 text-sm">
            <ol className="list-outside list-decimal space-y-3 p-4">
              <li>
                <p>
                  <span className="font-bold">Upload your file:</span> Choose a
                  file with a supported extension and make sure {"it's"} under
                  390 kB.
                </p>
              </li>
              <li>
                <p>
                  <span className="font-bold">
                    Provide your Taproot address:
                  </span>{" "}
                  Enter an ordinal compatible address that starts with {"bc1p"}{" "}
                  (see{" "}
                  <Link
                    className="underline"
                    href="https://docs.ordinals.com/guides/collecting/sparrow-wallet.html"
                    target="_blank"
                  >
                    this
                  </Link>{" "}
                  link for more info on how to set up a wallet to receive
                  inscriptions).
                </p>
              </li>
              <li>
                <p>
                  <span className="font-bold">
                    Choose your transaction speed:
                  </span>{" "}
                  Select how quickly you want the inscription to be processed
                  and the recommended fees can be found here:{" "}
                  <Link
                    className="underline"
                    target="_blank"
                    href="https://mempool.space/"
                  >
                    mempool.space
                  </Link>
                </p>
              </li>
              <li>
                <p>
                  <span className="font-bold">Send payment:</span> Once{" "}
                  {"you've "}
                  uploaded your file, entered your address, and selected your
                  transaction speed, {"you'll"} need to send the payable amount
                  to the assigned bitcoin address.
                </p>
              </li>
            </ol>{" "}
            <p>
              Once the transaction is confirmed, {"we'll"} take care of the rest
              and send you the inscription to the Bitcoin address provided
              earlier.
            </p>
            <p>
              If you have any issues or questions, please {"don't"} hesitate to
              reach out to us on Discord. {"We're"} here to help.
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
