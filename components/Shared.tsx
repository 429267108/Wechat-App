import React from 'react';

interface CuteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'wechat' | 'danger' | 'ghost';
}

export const CuteButton = ({ 
  children, variant = 'primary', className = '', ...props 
}: CuteButtonProps) => {
  const baseStyle = "px-5 py-3 rounded-3xl font-display font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-sm";
  
  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-sanrio-pink to-[#ffcfd8] text-white shadow-sanrio-pink/30 hover:shadow-sanrio-pink/50",
    secondary: "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50",
    wechat: "bg-[#07C160] text-white shadow-[#07C160]/30 hover:bg-[#06ad56]",
    danger: "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100",
    ghost: "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50",
  };

  return (
    <button className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 ${className}`}>
    {children}
  </div>
);

interface AvatarProps {
  url: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar = ({ url, name, size = 'md' }: AvatarProps) => {
  const sizes: Record<string, string> = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-[3px]",
    lg: "w-20 h-20 border-4",
    xl: "w-24 h-24 border-4",
  };
  return (
    <div className="relative inline-block">
      <img 
        src={url} 
        alt={name} 
        className={`${sizes[size]} rounded-full border-white shadow-md object-cover bg-gray-100`}
      />
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

export const Badge = ({ children, color = "bg-gray-100" }: BadgeProps) => (
  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color}`}>
    {children}
  </span>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal = ({ 
  isOpen, onClose, title, children 
}: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-[#fefbf5] w-full max-w-md p-6 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl transform transition-transform animate-[slideUp_0.3s_ease-out]">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold text-slate-700">{title}</h2>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};