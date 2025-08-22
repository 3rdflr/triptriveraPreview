'use client';
import BottomSheet from '@/components/common/BottomSheet';
import { Button } from '@/components/ui/button';
import { useOverlay } from '@/hooks/useOverlay';

export default function Page() {
  const overlay = useOverlay();

  const openBottomSheet = async () => {
    overlay.open(({ isOpen, close }) => (
      <BottomSheet
        open={isOpen}
        onOpenChange={close}
        title='날짜'
        buttons={<Button onClick={close}>확인</Button>}
      >
        <div>hello</div>
      </BottomSheet>
    ));
  };

  return <button onClick={openBottomSheet}>Open BottomSheet</button>;
}
