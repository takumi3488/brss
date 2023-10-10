"use client";

export default function Input({
  name,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type="text"
      name={name}
      className="block w-full rounded-md border-gray-300
                 shadow-sm focus:border-primary-400 focus:ring
                 focus:ring-primary-200 focus:ring-opacity-50
                 disabled:cursor-not-allowed disabled:bg-gray-50
                 disabled:text-gray-500"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
}
