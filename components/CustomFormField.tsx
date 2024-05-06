import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from './ui/input';

import { Control, FieldPath } from 'react-hook-form';
import { z } from 'zod';
import { authFormSchema } from '@/lib/utils';

const formSchema = authFormSchema('sign-up');

interface CustomFormFieldProps {
    control: Control<z.infer <typeof formSchema>>,
    name: FieldPath<z.infer <typeof formSchema>>,
    label: string,
    placeholder?: string,
}

const CustomFormField = ({ control, label, name, placeholder }: CustomFormFieldProps ) => {

  return (
        <FormField 
            control={control}
            name={name }
            render={({ field }) => (
                <div className='form-item'>
                    <FormLabel>{label}</FormLabel>
                    <div className='flex w-full flex-col'>
                        <FormControl>
                            <Input 
                                placeholder= {placeholder ? placeholder : `Enter Your ${ label }`} 
                                className='input-class' 
                                type={name === 'password' ? 'password' : 'text'} 
                                {...field} 
                            />
                        </FormControl>
                        <FormMessage className='form-message mt-2'/>
                    </div>
                </div>
            )}
        />    
  )
}

export default CustomFormField;
