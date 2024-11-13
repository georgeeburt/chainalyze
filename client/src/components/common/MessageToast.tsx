interface MessageToastProps {
  message: string | null;
  type: 'success' | 'error' | null;
  isVisible: boolean;
}

const MessageToast = ({ message, type, isVisible }: MessageToastProps) => {
  if (!message) return null;

  return (
    <div
      className={`flex text-white items-center text-lg p-4 rounded-md text-center drop-shadow-2xl transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${
        type === 'success' ? 'bg-forest' : 'bg-rose-500'
      } absolute top-[60px] left-1/2 transform -translate-x-1/2`}
    >
      {message}
    </div>
  );
};

export default MessageToast;