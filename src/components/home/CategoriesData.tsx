export const categories = [
  {
    category: '모두',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='1.5'
        stroke-linecap='round'
        stroke-linejoin='round'
        className='lucide lucide-map-pinned-icon lucide-map-pinned'
      >
        <path d='M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0' />
        <circle cx='12' cy='8' r='2' />
        <path d='M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712' />
      </svg>
    ),
    value: '',
  },
  {
    category: '문화 · 예술',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='1'
        stroke-linecap='round'
        stroke-linejoin='round'
        className='lucide lucide-landmark-icon lucide-landmark'
      >
        <path d='M10 18v-7' />
        <path d='M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z' />
        <path d='M14 18v-7' />
        <path d='M18 18v-7' />
        <path d='M3 22h18' />
        <path d='M6 18v-7' />
      </svg>
    ),
    value: '문화 · 예술',
  },
  {
    category: '스포츠',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='1'
        stroke-linecap='round'
        stroke-linejoin='round'
        className='lucide lucide-trophy-icon lucide-trophy'
      >
        <path d='M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978' />
        <path d='M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978' />
        <path d='M18 9h1.5a1 1 0 0 0 0-5H18' />
        <path d='M4 22h16' />
        <path d='M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z' />
        <path d='M6 9H4.5a1 1 0 0 1 0-5H6' />
      </svg>
    ),
    value: '스포츠',
  },
  {
    category: '투어',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='1'
        stroke-linecap='round'
        stroke-linejoin='round'
        className='lucide lucide-baggage-claim-icon lucide-baggage-claim'
      >
        <path d='M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2' />
        <path d='M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10' />
        <rect width='13' height='8' x='8' y='6' rx='1' />
        <circle cx='18' cy='20' r='2' />
        <circle cx='9' cy='20' r='2' />
      </svg>
    ),
    value: '투어',
  },
  {
    category: '음식',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='1'
        stroke-linecap='round'
        stroke-linejoin='round'
        className='lucide lucide-utensils-icon lucide-utensils'
      >
        <path d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2' />
        <path d='M7 2v20' />
        <path d='M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7' />
      </svg>
    ),
    value: '식음료',
  },
  {
    category: '관광',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='1'
        stroke-linecap='round'
        stroke-linejoin='round'
        className='lucide lucide-tickets-plane-icon lucide-tickets-plane'
      >
        <path d='M10.5 17h1.227a2 2 0 0 0 1.345-.52L18 12' />
        <path d='m12 13.5 3.75.5' />
        <path d='m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8' />
        <path d='M6 10V8' />
        <path d='M6 14v1' />
        <path d='M6 19v2' />
        <rect x='2' y='8' width='20' height='13' rx='2' />
      </svg>
    ),
    value: '관광',
  },
  {
    category: '웰빙',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='1'
        stroke-linecap='round'
        stroke-linejoin='round'
        className='lucide lucide-leaf-icon lucide-leaf'
      >
        <path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z' />
        <path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' />
      </svg>
    ),
    value: '웰빙',
  },
] as const;
