'use client';
import { useEffect, useState } from 'react';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Event as RBCEvent,
  ToolbarProps,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './status-calendar-custom.css';
import { ko } from 'date-fns/locale';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

const locales = { ko };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const formats = {
  weekdayFormat: (date: Date) => format(date, 'EEEEE'),
};

const events = [
  {
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2025, 8, 3),
    end: new Date(2025, 8, 3),
  },
  {
    title: 'Long Event',
    start: new Date(2025, 8, 4),
    end: new Date(2025, 8, 5),
  },
];

const CustomToolbar = ({ label, onNavigate }: ToolbarProps) => {
  const formatted = format(label, 'yyyy년 M월', { locale: ko });

  return (
    <div className='rbc-toolbar flex justify-center gap-4 p-7.5'>
      {/* 이전 달 버튼 */}
      <FaCaretLeft onClick={() => onNavigate('PREV')} />
      {/* 월 텍스트 */}
      <span className='text-20-bold'>{formatted}</span>

      {/* 다음 달 버튼 */}
      <FaCaretRight onClick={() => onNavigate('NEXT')} />
    </div>
  );
};

const ReservationStatusCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState<RBCEvent[]>([]);

  const handleShowMore = (events: RBCEvent[], date: Date) => {
    setShowModal(true);
    setModalEvents(events);

    console.log(date);
    console.log(showModal);
    console.log(modalEvents);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <div className='w-94 h-154 md:w-119 md:h-195 lg:w-160 shadow-lg border border-grayscale-50 rounded-2xl'>
      <BigCalendar
        localizer={localizer}
        formats={formats}
        events={events}
        step={60}
        views={['month']}
        date={currentDate}
        popup={false}
        onNavigate={(date) => setCurrentDate(date)}
        onShowMore={handleShowMore}
        components={{
          toolbar: CustomToolbar,
        }}
      />
    </div>
  ) : null;
};

export default ReservationStatusCalendar;
