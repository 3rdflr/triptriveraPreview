import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ScheduleTab = () => {
  return (
    <Tabs defaultValue='1' className='w-full'>
      <div className='w-full flex justify-start border-b border-b-grayscale-100'>
        <TabsList className=''>
          <TabsTrigger value='1'>신청 0</TabsTrigger>
          <TabsTrigger value='2'>승인 0</TabsTrigger>
          <TabsTrigger value='3'>거절 0</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value='1' className='flex flex-col gap-5'>
        <div className='flex flex-col'>
          <Label className='text-lg font-bold'>예약 시간</Label>
          드롭다운
        </div>
        <div className='flex flex-col'>
          <Label className='text-lg font-bold'>예약 내역</Label>
          드롭다운
        </div>
      </TabsContent>
      <TabsContent value='2' className='flex flex-col gap-5'>
        <div className='flex flex-col'>
          <Label className='text-lg font-bold'>예약 시간</Label>
          드롭다운
        </div>
        <div className='flex flex-col'>
          <Label className='text-lg font-bold'>예약 내역</Label>
          드롭다운
        </div>
      </TabsContent>
      <TabsContent value='3' className='flex flex-col gap-5'>
        <div className='flex flex-col'>
          <Label className='text-lg font-bold'>예약 시간</Label>
          드롭다운
        </div>
        <div className='flex flex-col'>
          <Label className='text-lg font-bold'>예약 내역</Label>
          드롭다운
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ScheduleTab;
