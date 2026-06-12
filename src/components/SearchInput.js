import React, { useState } from 'react';

const companies = [
  'Apple', 'Samsung', 'TCS', 'Infosys', 'Wipro', 'Google', 'Microsoft',
  'Amazon', 'Meta', 'Netflix', 'Flipkart', 'Zoho', 'HCL', 'Accenture',
  'Cognizant', 'IBM', 'Oracle', 'Deloitte', 'Capgemini', 'Tech Mahindra'
];

const SearchInput = ({ value, onChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    if (val.length > 0) {
      const filtered = companies.filter(c =>
        c.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (company) => {
    onChange(company);
    setShowDropdown(false);
  };

  return (
    <div className="relative flex-1">
      <input
        type="text"
        placeholder="🔍 Company or Role search பண்ணு..."
        value={value}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onFocus={() => value.length > 0 && setShowDropdown(true)}
        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((company, index) => (
            <div
              key={index}
              onClick={() => handleSelect(company)}
              className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer flex items-center gap-2"
            >
              🏢 {company}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;