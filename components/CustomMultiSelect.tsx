import React, { useState } from 'react';

interface CustomMultiSelectProps {
    options: { value: string, label: string }[];
    selectedValues: string[];
    onChange: (selected: string[]) => void;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({ options, selectedValues, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter(v => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    return (
        <div className="relative">
            <div
                className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-[rgb(255,183,77)] focus:ring focus:ring-[rgb(255,183,77)] focus:ring-opacity-50 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedValues.length > 0 ? selectedValues.join(', ') : 'Select options'}
            </div>
            {isOpen && (
                <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                    {options.map(option => (
                        <label key={option.value} className="flex items-center p-2 cursor-pointer hover:bg-gray-100">
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option.value)}
                                onChange={() => handleSelect(option.value)}
                                className="mr-2"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomMultiSelect;