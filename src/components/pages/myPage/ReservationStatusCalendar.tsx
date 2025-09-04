'use client';
import { useState } from 'react';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  EventProps,
  Event as RBCEvent,
  ToolbarProps,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './status-calendar-custom.css';
import { ko } from 'date-fns/locale';
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useOverlay } from '@/hooks/useOverlay';
import clsx from 'clsx';

interface ReservationStatusCalendarProps {
  date: Date;
  events: RBCEvent[];
  onNavigate: (date: Date) => void;
}

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
  dateFormat: (date: Date) => format(date, 'd'),
};

// const events = [
//   {
//     title: 'All Day Event very long title',
//     allDay: true,
//     start: new Date(2025, 8, 3),
//     end: new Date(2025, 8, 3),
//   },
//   {
//     title: 'Long Event',
//     start: new Date(2025, 8, 4),
//     end: new Date(2025, 8, 4),
//   },
// ];

const CustomToolbar = ({ label, onNavigate }: ToolbarProps) => {
  const formatted = format(label, 'yyyy년 M월', { locale: ko });

  return (
    <div className='custom-toolbar flex items-center justify-center gap-4 p-7.5'>
      {/* 이전 달 버튼 */}
      <FaCaretLeft onClick={() => onNavigate('PREV')} />
      {/* 월 텍스트 */}
      <span className='text-20-bold whitespace-nowrap'>{formatted}</span>

      {/* 다음 달 버튼 */}
      <FaCaretRight onClick={() => onNavigate('NEXT')} />
    </div>
  );
};

const ReservationStatusCalendar = ({
  date,
  events,
  onNavigate,
}: ReservationStatusCalendarProps) => {
  const overlay = useOverlay();
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState<RBCEvent[]>([]);

  const CustomEvent = ({ event }: EventProps<RBCEvent>) => {
    const title = String(event.title);
    let bgColor = 'bg-gray-500';

    if (title.includes('완료')) bgColor = 'bg-green-500';
    else if (title.includes('승인')) bgColor = 'bg-blue-500';
    else if (title.includes('예약')) bgColor = 'bg-yellow-500';

    return (
      <div className={clsx('text-white rounded-lg px-1 py-0.5 text-xs text-center', bgColor)}>
        {event.title}
      </div>
    );
  };

  const CustomDateHeader = ({ label, date }: { label: string; date: Date }) => {
    const hasEvent = events.some(
      (event: RBCEvent) =>
        event.start && event.end && (isSameDay(event.start, date) || isSameDay(event.end, date)),
    );
    return (
      <div className='relative flex items-center justify-center'>
        <span>{label}</span>
        {hasEvent && (
          <span className='absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-primary-500'></span>
        )}
      </div>
    );
  };

  const onClickEvent = (event: RBCEvent) => {
    console.log('이벤트 클릭됨:', event);
    overlay.open(({ isOpen, close }) => (
      <ConfirmModal
        title={`예약: ${event.title}`}
        isOpen={isOpen}
        onClose={close}
        onAction={close}
      />
    ));
  };

  const handleShowMore = (events: RBCEvent[], date: Date) => {
    console.log('hello??');
    setShowModal(true);
    setModalEvents(events);

    console.log(date);
    console.log(showModal);
    console.log(modalEvents);

    overlay.open(({ isOpen, close }) => (
      <ConfirmModal title={`달력 모달 ${date}`} isOpen={isOpen} onClose={close} onAction={close} />
    ));
  };

  return (
    <div className='w-full h-154 sm:w-94 sm:h-154 md:w-119 md:h-195 lg:w-160 sm:shadow-lg sm:border sm:border-grayscale-100 rounded-2xl'>
      <BigCalendar
        localizer={localizer}
        formats={formats}
        events={events}
        views={['month']}
        date={date}
        popup={false}
        onNavigate={onNavigate}
        onShowMore={handleShowMore}
        onSelectEvent={onClickEvent}
        components={{
          toolbar: CustomToolbar,
          month: {
            dateHeader: CustomDateHeader,
          },
          event: CustomEvent,
        }}
      />
    </div>
  );
};

export default ReservationStatusCalendar;
