import React from 'react';
import PropTypes from 'prop-types';

export const AlertDialog = ({ children, open }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg">
                {children}
            </div>
        </div>
    );
};

export const AlertDialogContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

export const AlertDialogHeader = ({ children }) => (
    <div className="mb-4">
        {children}
    </div>
);

export const AlertDialogTitle = ({ children, className = '' }) => (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
        {children}
    </h2>
);

export const AlertDialogFooter = ({ children, className = '' }) => (
    <div className={`mt-6 flex justify-end gap-3 ${className}`}>
        {children}
    </div>
);

export const AlertDialogAction = ({ children, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${className}`}
    >
        {children}
    </button>
);

export const Alert = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-900',
        destructive: 'bg-red-50 text-red-900',
        warning: 'bg-yellow-50 text-yellow-900',
    };

    return (
        <div className={`p-4 rounded-lg ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};

export const AlertDescription = ({ children, className = '' }) => (
    <div className={`text-sm ${className}`}>
        {children}
    </div>
);

// PropTypes
AlertDialog.propTypes = {
    children: PropTypes.node,
    open: PropTypes.bool
};

AlertDialogContent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

AlertDialogHeader.propTypes = {
    children: PropTypes.node
};

AlertDialogTitle.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

AlertDialogFooter.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

AlertDialogAction.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string
};

Alert.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.oneOf(['default', 'destructive', 'warning']),
    className: PropTypes.string
};

AlertDescription.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

export default {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogAction,
    Alert,
    AlertDescription
};