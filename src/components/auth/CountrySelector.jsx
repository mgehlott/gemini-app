import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { fetchCountries } from '../../utils/api';

export const CountrySelector = ({ selectedCountry, onSelect }) => {
  const [countries, setCountries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
        // Default to a common country if none selected
        if (!selectedCountry && data.length > 0) {
          const defaultCountry = data.find(c => c.cca2 === 'US') || data[0];
          onSelect(defaultCountry);
        }
      } catch (error) {
        console.error('Failed to load countries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, [selectedCountry, onSelect]);

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDialCode = (country) => {
    return country.idd?.root + (country.idd?.suffixes?.[0] || '');
  };

  if (loading) {
    return (
      <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-l-lg"></div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCountry && (
          <>
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getDialCode(selectedCountry)}
            </span>
          </>
        )}
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.cca2}
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                onClick={() => {
                  onSelect(country);
                  setIsOpen(false);
                  setSearchQuery('');
                }}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="flex-1 text-gray-900 dark:text-gray-100">
                  {country.name.common}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getDialCode(country)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};