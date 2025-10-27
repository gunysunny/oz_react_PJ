import React from "react";

function InputField({ label, type = "text", value, onChange, error, name, placeholder, ...props }) {
    return (
        <div className="mb-5">
            <label className="block mb-1 text-sm font-medium text-gray-300" htmlFor={name}>
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                autoComplete="off"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`
                    w-full px-4 py-2 rounded bg-[#23242a] text-white
                    border border-transparent focus:border-[#319d87] outline-none
                    transition-all duration-300 shadow-sm
                    placeholder-gray-500
                    ${error ? 'border-red-400 focus:border-red-400' : ''}
                `}
                {...props}
            />
            {error && <div className="text-red-400 mt-1 text-xs">{error}</div>}
        </div>
    );
}


export default InputField;