import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import { BOOK_SCENES } from './book';
import { BookFrame, BookStatic } from './components/BookPitch';
// dev only: every book scene, static and at a few moments of the animation
const q = new URLSearchParams(location.search);
const only = q.get('p') ?? '';
const ids = Object.keys(BOOK_SCENES).filter((id) => id.startsWith(only));
createRoot(document.getElementById('root')).render(_jsx("div", { className: "g", children: ids.map((id) => {
        const sc = BOOK_SCENES[id];
        return q.get('anim') ? ([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].filter((t) => t <= sc.steps - 1).map((t) => _jsxs("div", { className: "c", children: [_jsxs("b", { children: [id, " t=", t] }), _jsx(BookFrame, { scene: sc, t: t })] }, id + t))) : _jsxs("div", { className: "c", children: [_jsx("b", { children: id }), _jsx(BookStatic, { scene: sc })] }, id);
    }) }));
