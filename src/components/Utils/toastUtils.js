// src/utils/toastUtils.js
import { toast } from "react-hot-toast";

const iconSuccess = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24" width={20} height={20}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const iconError = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24" width={20} height={20}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const showSuccess = (message) => {
  toast.success(message, {
    icon: iconSuccess,
    style: {
      background: 'rgba(22, 163, 74, 0.85)',
      color: 'white',
      borderRadius: '12px',
      fontWeight: '600',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    icon: iconError,
    style: {
      background: 'rgba(780, 38, 38, 0.85)',
      color: 'white',
      borderRadius: '12px',
      fontWeight: '600',
    },
  });
};
