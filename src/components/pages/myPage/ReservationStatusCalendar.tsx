'use client';
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
import clsx from 'clsx';

const badgeClassMap: Record<string, string> = {
  완료: 'bg-gray-100 text-gray-600',
  승인: 'bg-[var(--badge-blue-light)] text-[var(--badge-blue-dark)]',
  예약: 'bg-primary-100 text-primary-500',
};

interface ReservationStatusCalendarProps {
  date: Date;
  events: RBCEvent[];
  onNavigate: (date: Date) => void;
  onClickDate: (date: string) => void;
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

const ReservationStatusCalendar = ({
  date,
  events,
  onNavigate,
  onClickDate,
}: ReservationStatusCalendarProps) => {
  const CustomToolbar = ({ label, onNavigate }: ToolbarProps) => {
    const formatted = format(label, 'yyyy년 M월', { locale: ko });

    return (
      <div className='custom-toolbar flex items-center justify-center gap-4 p-7.5'>
        {/* 이전 달 버튼 */}
        <FaCaretLeft onClick={() => onNavigate('PREV')} />
        {/* 월 텍스트 */}
        <span className='text-16-bold md:text-20-bold whitespace-nowrap'>{formatted}</span>

        {/* 다음 달 버튼 */}
        <FaCaretRight onClick={() => onNavigate('NEXT')} />
      </div>
    );
  };

  const onClickEvent = (event: RBCEvent) => {
    const date = format(event.start as Date, 'yyyy-MM-dd');
    onClickDate(date);
  };

  const CustomEvent = ({ event }: EventProps<RBCEvent>) => {
    const title = String(event.title);
    let badgeClass = '';

    const badgeKey = Object.keys(badgeClassMap).find((key) => title.includes(key));

    badgeClass = badgeKey ? badgeClassMap[badgeKey] : '';

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onClickEvent(event);
    };

    return (
      <div
        className={clsx(
          'flex justify-center items-center rounded-sm p-0.5 md:p-0 text-11-medium md:text-14-medium',
          'max-w-[67px] w-full',
          badgeClass,
        )}
        onClick={handleClick}
      >
        <span className='overflow-hidden text-ellipsis whitespace-nowrap text-center w-full'>
          {event.title}
        </span>
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

  const onSelectDay = (start: Date) => {
    const date = format(start, 'yyyy-MM-dd');
    onClickDate(date);

    const hasEvent = events.some((event) => event.start && isSameDay(event.start, start));

    if (!hasEvent) return;
  };

  return (
    <div
      className={clsx(
        'w-full h-170 rounded-2xl mobile:h-195 tablet:border tablet:border-grayscale-100 tablet:shadow-lg',
      )}
    >
      <BigCalendar
        selectable
        localizer={localizer}
        formats={formats}
        events={events}
        views={['month']}
        date={date}
        popup={false}
        onNavigate={onNavigate}
        onSelectSlot={({ start }) => onSelectDay(start)}
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
