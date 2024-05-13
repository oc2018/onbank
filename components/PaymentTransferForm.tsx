'use client';

import React, { useState } from 'react'
import { Form } from './ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { decryptId, transferFormSchema } from '@/lib/utils';
import { getBank, getBankByAccountId } from '@/lib/actions/user.actions';
import { createTransfer } from '@/lib/actions/dwolla.actions';
import { createTransaction } from '@/lib/actions/transaction.actions';
import { useRouter } from 'next/navigation';
import CustomTransferFormInput from './CustomTransferFormInput';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

const PaymentTransferForm = ({accounts}: PaymentTransferFormProps) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)

    const formSchema = transferFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            amount: "",
            senderBank: "",
            sharableId: "",
        },
    });

    const submit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const receiverAccountId = decryptId(data.sharableId);
            const receiverBank = await getBankByAccountId({
                accountId: receiverAccountId,
            })
            const senderBank = await getBank({ documentId: data.senderBank});

            const transferParams = {
                sourceFundingSourceUrl: senderBank.fundingSourceUrl,
                destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
                amount: data.amount,
            };

            //create transfer
            const transfer = await createTransfer(transferParams);

            //create transfer transaction
            if(transfer) {
                const transaction = {
                    name: data.name,
                    amount: data.amount,
                    senderId: senderBank.userId.$id,
                    senderBankId: senderBank.$id,
                    receiverId: receiverBank.userId.$id,
                    receiverBankId: receiverBank.$id,
                    email: data.email,
                };

                const newTransaction = await createTransaction(transaction);

                if(newTransaction) {
                    form.reset(),
                    router.push("/");
                }
            }
        } catch (error) {
            console.error("Submitting transfer details failed: ", error);
        }

        setIsLoading(false);
    }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className='flex flex-col'>
            <CustomTransferFormInput 
                control={form.control}
                name='senderBank'
                label='Select Source Bank'
                description='Select the bank account you want to transfer money from'
                formControl='bankDropDown'
                accounts={accounts}
                setValue={form.setValue}
             />
            <CustomTransferFormInput 
                control={form.control}
                name="name"
                label="Transfer Note (Optional)"
                description='Please provide and additional information instructions related to the transfer'
                formControl="textArea"
                placeholder='Write a short note here'
             />
             <div className='payment-transfer_form-details'>
                <h2 className='text-18 font-semibold text-gray-900'>Bank account details</h2>
                <p className='text-16 font-normal text-gray-600'>
                    Enter the bank account details of the recipient
                </p>
             </div>
            <CustomTransferFormInput 
                control={form.control}
                name='email'
                label="Recipient's Email Address"
                placeholder='ex: johndoe@gmail.com'
             />
            <CustomTransferFormInput 
                control={form.control}
                name="sharableId"
                label="Receiver's plaid Sharable Id"
                placeholder="Enter the public account number"
             />
            <CustomTransferFormInput 
                control={form.control}
                name='amount'
                label='Amount'
                placeholder='ex: 5.00'
             />
            <div className='payment-transfer_btn-box'>
                <Button type='submit' className='payment-transfer_btn'>
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className='animate-spin' />&nbsp; Sending...
                        </>
                    ):(
                        "Transfer Funds"
                    )}
                </Button>
            </div>
        </form>
    </Form>
  )
}

export default PaymentTransferForm