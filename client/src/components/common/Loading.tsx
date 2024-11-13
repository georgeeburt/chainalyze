interface LoadingProps {
  // Optional props for further customization
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

const Loading = ({
  className = '',
  size = 'md',
  centered = true
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerClasses = centered
    ? 'flex justify-center items-center h-screen transform -translate-y-6'
    : '';

  return (
    <div className={containerClasses}>
      <div className={`
        ${sizeClasses[size]}
        border-4
        border-elixir
        border-t-transparent
        rounded-full
        animate-spin
        ${className}
      `} />
    </div>
  );
};

export default Loading;
