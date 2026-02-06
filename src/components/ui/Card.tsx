import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: React.ReactNode;
}

const Card = ({ children, className = '', title, icon }: CardProps) => {
    return (
        <div className={`glass-card ${className}`}>
            {(title || icon) && (
                <div className="flex items-center gap-3 mb-6">
                    {icon && <div className="p-2 bg-primary-500/10 rounded-xl text-primary-400">{icon}</div>}
                    {title && <h3 className="text-lg font-bold text-surface-50">{title}</h3>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
