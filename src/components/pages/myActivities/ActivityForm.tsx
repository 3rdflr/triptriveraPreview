'use client';
// import { useState } from 'react';
// import DateTimeRow from './DateTimeRow';
// import { RowData } from '@/types/myActivityTypes';
// import { FormProvider, useForm } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// import clsx from 'clsx';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';

// interface ActivityFormProps {
//   mode?: 'EDIT' | 'REGISTER';
//   title?: string;
// }

const ActivityForm = () => {
  // const [rows, setRows] = useState<RowData[]>([{ date: '', time: { start: '', end: '' } }]);

  // const handleRowChange = (index: number, newData: RowData) => {
  //   setRows((prev) => prev.map((row, i) => (i === index ? newData : row)));
  // };

  // const addRow = () => {
  //   setRows((prev) => [...prev, { date: '', time: { start: '', end: '' } }]);
  // };

  // const removeRow = (index: number) => {
  //   setRows((prev) => prev.filter((_, i) => i !== index));
  // };

  // const methods = useForm<LoginData>({
  //   resolver: zodResolver(LoginSchema),
  //   mode: 'all',
  // });

  // const {
  //   handleSubmit,
  //   setError,
  //   formState: { isValid },
  // } = methods;

  return (
    <div className='flex flex-col gap-6'>
      {/* <FormProvider>
        <Label>내 체험 등록</Label>
        <div className='flex flex-col gap-2.5'>
          <Label>제목</Label>
          <Input />
        </div>
        <div className='flex flex-col gap-2.5'>
          <Label>카테고리</Label>
          <Input />
        </div>

        {rows.map((row, index) => (
          <div
            key={index}
            className={clsx('w-max py-2.5', {
              'py-5': index === 0,
              'border-t border-grayscale-100 pt-5': index === 1,
            })}
          >
            <DateTimeRow
              isFirstRow={index === 0}
              data={row}
              onChange={(newData) => handleRowChange(index, newData)}
              onAdd={addRow}
              onRemove={() => removeRow(index)}
            />
          </div>
        ))}
      </FormProvider> */}
    </div>
  );
};

export default ActivityForm;
