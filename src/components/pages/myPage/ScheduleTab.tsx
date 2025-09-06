import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScheduleSelect from './ScheduleSelect';
import { useScheduleStore } from '@/store/reservedScheduleStore';
// import { Dropdown } from 'react-simplified-package';

const ScheduleTab = () => {
  const { selectedSchedules, setSelectedSchedule, scheduleLists } = useScheduleStore();

  return (
    <Tabs defaultValue='pending' className='w-full'>
      <div className='w-full flex justify-start border-b border-b-grayscale-100'>
        <TabsList>
          <TabsTrigger value='pending'>신청 {scheduleLists.pending.length}</TabsTrigger>
          <TabsTrigger value='confirmed'>승인 {scheduleLists.confirmed.length}</TabsTrigger>
          <TabsTrigger value='declined'>거절 {scheduleLists.declined.length}</TabsTrigger>
        </TabsList>
      </div>
      {(['pending', 'confirmed', 'declined'] as const).map((tab) => (
        <TabsContent key={tab} value={tab} className='flex flex-col gap-5'>
          <div className='flex flex-col gap-2.5'>
            <Label className='text-lg font-bold'>예약 시간</Label>
            <div onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
              <ScheduleSelect
                value={selectedSchedules[tab]}
                onChange={(val) => setSelectedSchedule(tab, val)}
                scheduleList={scheduleLists[tab]}
              />
              {/* <Dropdown>
                <Dropdown.Trigger>
                  <div className='w-full border border-gray-50'>옵션 선택</div>
                </Dropdown.Trigger>

                <Dropdown.Menu
                  style={{
                    textAlign: 'center',
                    backgroundColor: '#333',
                    border: '1px solid #333',
                  }}
                >
                  <a
                    href='#'
                    style={{
                      display: 'block',
                      padding: '10px',
                      textDecoration: 'none',
                      color: 'white',
                    }}
                  >
                    옵션 1
                  </a>
                  <a
                    href='#'
                    style={{
                      display: 'block',
                      padding: '10px',
                      textDecoration: 'none',
                      color: 'white',
                    }}
                  >
                    옵션 2
                  </a>
                  <a
                    href='#'
                    style={{
                      display: 'block',
                      padding: '10px',
                      textDecoration: 'none',
                      color: 'white',
                    }}
                  >
                    옵션 3
                  </a>
                </Dropdown.Menu>
              </Dropdown> */}
            </div>
          </div>

          <div className='flex flex-col'>
            <Label className='text-lg font-bold'>예약 내역</Label>
            드롭다운
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ScheduleTab;
