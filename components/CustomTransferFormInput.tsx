import React from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { transferFormSchema } from '@/lib/utils'
import { Control, FieldPath, SetFieldValue  } from 'react-hook-form';
import * as z  from 'zod';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import BankDropdown from './BankDropdown';

const formSchema = transferFormSchema();

interface CustomTransferFormInputProps {
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer <typeof formSchema>>,
    label: string,
    description?: string,
    formControl?: string,
    placeholder?: string,
    accounts?: Account[],
    setValue?: SetFieldValue<z.infer<typeof formSchema>>,
  }

const CustomTransferFormInput = ({ control, name, label, description, formControl, placeholder, accounts, setValue }: CustomTransferFormInputProps) => {


  return (
    <FormField
    control={control}
    name={name}
    render={({field})=> (
        <FormItem className='border-t border-gray-200'>
            <div className='payment-transfer_form-item pb-6 pt-5'>
                <div className='payment-transfer_form-content'>
                    <FormLabel className='text-14 font-medium text-gray-700'>
                        {label}
                    </FormLabel>
                    <FormDescription>
                        {description}
                    </FormDescription>
                </div>
                <div className='flex w-full flex-col'>
                    <FormControl>
                        {formControl === 'bankDropDown' ? (
                            <BankDropdown
                            accounts={accounts}
                            setValue={setValue}
                            otherStyles={'!w-full'}
                            />
                        ) : formControl === 'textArea'? (
                            <Textarea
                            placeholder={placeholder}
                            className='input-class'
                            {...field}
                            />
                        ) : (
                            <Input
                                placeholder={placeholder}
                                className="input-class"
                                {...field}
                            />
                        )}
                    </FormControl>
                    <FormMessage className='text-12 text-red-500'/>
                </div>
            </div>
        </FormItem>
    )}
    />
  )
}

export default CustomTransferFormInput