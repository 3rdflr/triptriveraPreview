import React, { useState } from 'react';
import './App.css';

import { Modal, createToast, ToastRender, Dropdown } from 'react-simplified-package';
import { FaCheckCircle } from 'react-icons/fa';

// 성공 토스트 전용 인스턴스 (스타일을 JSX에 직접 적용)
const successToast = createToast(
  (str) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#4CAF50',
        border: '1px solid #4CAF50',
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <FaCheckCircle />
      <span>{str || '기본'} 알림이 도착했어요!</span>
    </div>
  ),
  { duration: 3000 },
);

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [secondModalOpen, setSecondModalOpen] = useState(false);

  const handleToastSuccess = () => {
    successToast.run();
  };

  const handleMenuItemClick = (item: string) => {
    alert(`'${item}' 항목을 선택했습니다.`);
    // 여기에 선택된 항목에 대한 추가 로직을 구현할 수 있습니다.
  };

  return (
    <div>
      <ToastRender />
      <h1>App</h1>
      <button onClick={() => setIsModalOpen(true)}>첫번째</button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalClassName='modal-custom-class'
        buttonClassName='button-custom-class'
      >
        <h2>안녕나는 1번 모달</h2>
        <p>반갑소...</p>
      </Modal>
      <br />
      <br />
      <button onClick={() => setSecondModalOpen(true)}>두번째</button>
      <Modal isOpen={secondModalOpen} onClose={() => setSecondModalOpen(false)}>
        <h2>안녕 나는 2번 모달</h2>
        <p>반갑소...</p>
      </Modal>
      <br />
      <br />
      <button onClick={handleToastSuccess}>토스트 기본!</button>
      <button onClick={() => successToast.run('새로운')}> 새로운 토스트 성공!</button>
      <br />
      <br />

      <div style={{ textAlign: 'end' }}>
        <Dropdown>
          {/* 드롭다운을 열고 닫는 버튼 */}
          <Dropdown.Trigger>
            <button
              style={{
                padding: '10px 20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: '#333',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              옵션 선택
            </button>
          </Dropdown.Trigger>

          {/* 버튼 클릭 시 나타나는 메뉴 */}
          <Dropdown.Menu
            style={{
              textAlign: 'center',
              backgroundColor: '#333',
              border: '1px solid #333',
            }}
          >
            <a
              href='#'
              onClick={() => handleMenuItemClick('옵션 1')}
              style={{
                display: 'block',
                padding: '10px',
                textDecoration: 'none',
                color: 'white', // 글씨색을 변경합니다.
              }}
            >
              옵션 1
            </a>
            <a
              href='#'
              onClick={() => handleMenuItemClick('옵션 2')}
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
              onClick={() => handleMenuItemClick('옵션 3')}
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
        </Dropdown>
      </div>
    </div>
  );
}
