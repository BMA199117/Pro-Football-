import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
export function Modal({ title, onClose, children }) {
    useEffect(() => {
        const k = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', k);
        return () => document.removeEventListener('keydown', k);
    }, [onClose]);
    return (_jsx("div", { className: "overlay", onClick: (e) => e.target === e.currentTarget && onClose(), children: _jsxs("div", { className: "modal", role: "dialog", "aria-modal": "true", "aria-label": title, children: [_jsx("h2", { children: title }), children] }) }));
}
/** In-page confirmation (no window.confirm). */
export function ConfirmButton({ label, confirmLabel, onConfirm }) {
    return (_jsxs("details", { className: "confirm", children: [_jsx("summary", { className: "btn ghost small danger", children: label }), _jsx("button", { className: "btn small danger-fill", onClick: onConfirm, children: confirmLabel })] }));
}
