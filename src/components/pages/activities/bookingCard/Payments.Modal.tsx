import { Modal } from 'react-simplified-package';
import { loadTossPayments, ANONYMOUS, TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { nanoid } from 'nanoid';
import { useUserStore } from '@/store/userStore';
import { ErrorBoundary } from 'react-error-boundary';
import PaymentsError from './Payments.Error';

interface PaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalPrice: number;
}

const CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

export default function PaymentsModal({ isOpen, onClose, title, totalPrice }: PaymentsModalProps) {
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const { user } = useUserStore();

  const amount = useMemo(() => {
    return {
      currency: 'KRW',
      value: totalPrice,
    };
  }, [totalPrice]);

  // Clean up function to remove rendered widgets
  const cleanupWidgets = () => {
    const paymentMethodEl = document.querySelector('#payment-method');
    const agreementEl = document.querySelector('#agreement');

    if (paymentMethodEl) paymentMethodEl.innerHTML = '';
    if (agreementEl) agreementEl.innerHTML = '';

    setIsRendered(false);
  };

  const onPayment = async () => {
    if (widgets == null) {
      console.error('Widgets not initialized');
      return;
    }

    await widgets
      .requestPayment({
        orderId: nanoid(),
        orderName: title,
        customerEmail: 'customer123@gmail.com',
        customerName: user?.nickname || '홍길동',
        customerMobilePhone: '01012341234',
      })
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('결제 실패:', error);
      });
  };

  useEffect(() => {
    if (!isOpen) {
      cleanupWidgets();
      return;
    }

    async function fetchPaymentWidgets() {
      try {
        cleanupWidgets(); // Clean up before creating new widgets

        const tossPayments = await loadTossPayments(CLIENT_KEY);
        const tossPaymentsWidgets = tossPayments.widgets({ customerKey: ANONYMOUS });
        setWidgets(tossPaymentsWidgets);
      } catch (error) {
        console.error('Failed to load payment widgets:', error);
      }
    }

    fetchPaymentWidgets();
  }, [isOpen]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets || !isOpen || isRendered) {
        return;
      }

      try {
        // 결제 금액을 설정합니다.
        await widgets.setAmount(amount);

        await Promise.all([
          // 결제 수단을 렌더링합니다.
          widgets.renderPaymentMethods({
            selector: '#payment-method',
            variantKey: 'DEFAULT',
          }),
          // 약관 동의 항목을 렌더링합니다.
          widgets.renderAgreement({
            selector: '#agreement',
            variantKey: 'AGREEMENT',
          }),
        ]);

        setIsRendered(true);
      } catch (error) {
        console.error('Failed to render payment widgets:', error);
        cleanupWidgets();
      }
    }

    renderPaymentWidgets();
  }, [widgets, amount, isOpen, isRendered]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupWidgets();
    };
  }, []);

  return (
    <ErrorBoundary fallback={<PaymentsError isOpen={isOpen} onClose={onClose} />}>
      <Modal isOpen={isOpen} onClose={onClose} modalClassName='max-w-[700px] w-full'>
        <div className='w-full flex flex-col gap-2'>
          <h3 className='mb-4 text-lg font-medium'>{title}</h3>
          <div id='payment-method' className='w-full'></div>
          <div id='agreement' className='w-full'></div>
          <Button onClick={onPayment}>결제하기</Button>
        </div>
      </Modal>
    </ErrorBoundary>
  );
}
