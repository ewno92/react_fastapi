import { ReactNode } from "react";
import { Button } from "./Button";

interface MyModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ visible, onClose, children }: MyModalProps) {
  const handleOnClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!visible) return null;
  return (
    <div
      id="container"
      onClick={handleOnClose}
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white rounded mx-2 flex justify-center pb-3">
        <div className="text-center">
          {children}
          <Button
            size="sm"
            variant="simple"
            onClick={() => onClose()}
            className="mt-5"
          >
            close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
