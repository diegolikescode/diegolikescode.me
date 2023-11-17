const ButtonJsx = function({onClick, text, size = 'md'}) {
    return <button
        className={`rounded text-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200
        bg-black text-white hover:b-slate-900 border-2 border-transparent
        ${size == 'md' ? 'px-5 py-2.5' : 'px-6 py-3' }`}
        onClick={onClick}>
        {text}
    </button>
}

export default ButtonJsx

