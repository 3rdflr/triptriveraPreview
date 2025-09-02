import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const UserPage = () => {
  return (
    <div className='flex flex-col gap-7.5'>
      {/* 헤더 */}
      <div className='flex flex-col w-full items-start gap-4 md:gap-16'>
        <div className='flex flex-col gap-2.5'>
          <Label className='text-[18px] font-bold'>내 정보</Label>
          <span className='text-14-medium text-grayscale-500'>
            닉네임과 비밀번호를 수정하실 수 있습니다.
          </span>
        </div>
        <div className='flex flex-col'>
          <Button size='md'>저장하기</Button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
