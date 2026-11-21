import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal } from './Modal';
import { useT } from '../hooks';
import { useSync, sendMagicLink, signOut } from '../sync';
export function SyncBadge({ onClick }) {
    const { t } = useT();
    const { status } = useSync();
    const label = status === 'synced' ? t('syncOn') : status === 'syncing' ? t('syncing') : t('syncOff');
    return _jsxs("button", { className: 'sync-badge s-' + status, onClick: onClick, "aria-label": label, title: label, children: [_jsx("span", { className: "sdot" }), _jsx("span", { className: "slabel", children: label })] });
}
export function SyncPanel({ onClose }) {
    const { t } = useT();
    const { status, email } = useSync();
    const [mail, setMail] = useState('');
    const [msg, setMsg] = useState(null);
    const submit = async (e) => {
        e.preventDefault();
        const err = await sendMagicLink(mail.trim());
        setMsg(err ? err : t('linkSent'));
    };
    return (_jsxs(Modal, { title: t('sync'), onClose: onClose, children: [status === 'disabled' ? _jsx("p", { children: t('syncNotSet') }) : email ? (_jsxs(_Fragment, { children: [_jsxs("p", { children: [t('signedAs'), " ", _jsx("b", { children: email })] }), _jsx("div", { className: "row", children: _jsx("button", { className: "btn ghost", onClick: () => signOut(), children: t('signOut') }) })] })) : (_jsxs("form", { className: "form", onSubmit: submit, children: [_jsx("p", { className: "full", children: t('syncHelp') }), _jsxs("label", { className: "full", children: [t('email'), _jsx("input", { id: "sync-email", type: "email", value: mail, onChange: (e) => setMail(e.target.value), required: true })] }), msg && _jsx("p", { className: "full note", children: msg }), _jsx("div", { className: "row full", children: _jsx("button", { className: "btn", children: t('sendLink') }) })] })), _jsx("div", { className: "row", children: _jsx("button", { className: "btn ghost", onClick: onClose, children: t('close') }) })] }));
}
