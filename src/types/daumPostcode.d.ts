export {};

declare global {
  interface DaumPostcodeOpenOptions {
    popupName?: string;
    left?: number;
    top?: number;
  }

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
      }) => {
        open: (options?: DaumPostcodeOpenOptions) => void;
        // embed: (element: HTMLElement, options?: any) => void;
      };
    };
  }
}
