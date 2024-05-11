'use client';

import { cn, formUrlQuery, getAccountTypeColors } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";


const BanksInfo = ({ account, appwriteItemId, type}: BankInfoProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const isActive = appwriteItemId === account?.appwriteItemId;

    const handleBankChange = () => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'id',
            value: account?.appwriteItemId,
        });
        router.push(newUrl, { scoll: false });
    }

    const colors = getAccountTypeColors(account?.type as AccountTypes);
  return (
    <div
        onClick={handleBankChange}
        className={cn(`bank-info ${colors.bg}`,{
            "shadow-sm border-blue-700": type === "card" && isActive,
            "rounded-xl": type === "card",
            "hover:shadow-sm cursor-pointer": type === "card",
        })}
    >

    </div>
  )
}

export default BanksInfo