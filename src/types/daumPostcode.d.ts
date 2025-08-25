export {};

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          userSelectedType: 'R' | 'J';
          roadAddress: string;
          jibunAddress: string;
          zonecode: string;
          bname: string;
          buildingName: string;
          apartment: 'Y' | 'N';
        }) => void;
      }) => { open: () => void };
    };
  }
}
