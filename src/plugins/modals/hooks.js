import { useEffect, useRef } from 'react';
import ReactModal from 'react-modal';

// eslint-disable-next-line import/prefer-default-export
export const useReactModal = () => {
  const ref = useRef(null);

  useEffect(() => {
    ReactModal.setAppElement(ref.current);
    return () => ReactModal.setAppElement(null);
  });

  return ref;
};
