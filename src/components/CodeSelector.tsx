
import { RegionCode, codeStandards } from '@/types/codes';
import { Check, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

interface CodeSelectorProps {
  selectedRegion: RegionCode | null;
  onRegionSelect: (region: RegionCode) => void;
}

export function CodeSelector({ selectedRegion, onRegionSelect }: CodeSelectorProps) {
  const countries: RegionCode[] = ['USA', 'ISRAEL'];
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (country: RegionCode) => {
    onRegionSelect(country);
    setIsOpen(false);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Group standards by category
  const getGroupedStandards = () => {
    if (!selectedRegion) return {};
    
    const filtered = codeStandards.filter(standard => standard.region === selectedRegion);
    return filtered.reduce((groups, standard) => {
      const category = standard.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(standard);
      return groups;
    }, {} as Record<string, typeof codeStandards>);
  };

  const groupedStandards = getGroupedStandards();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Select Country</h3>
      </div>
      
      <div className="relative">
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-between px-4 py-2 rounded-md border",
            selectedRegion ? "bg-blue-600 text-white border-blue-700" : "bg-white text-gray-900 border-gray-300"
          )}
          onClick={toggleDropdown}
        >
          <span>{selectedRegion || "Choose country"}</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
            <ul className="py-1 max-h-60 overflow-auto">
              {countries.map((country) => (
                <li 
                  key={country}
                  className={cn(
                    "px-4 py-2 cursor-pointer flex items-center justify-between",
                    "hover:bg-gray-100",
                    selectedRegion === country ? "bg-blue-50" : ""
                  )}
                  onClick={() => handleSelect(country)}
                >
                  <span>{country}</span>
                  {selectedRegion === country && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {selectedRegion && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Applicable Standards:
          </h4>
          
          <div className="space-y-4">
            {Object.entries(groupedStandards).map(([category, standards]) => (
              <div key={category} className="bg-blue-50 rounded-lg overflow-hidden">
                <div 
                  className="bg-blue-100 px-3 py-2 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  <h5 className="font-medium text-blue-800">{category}</h5>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      {standards.length} standard{standards.length !== 1 ? 's' : ''}
                    </span>
                    {expandedCategories[category] ? (
                      <ChevronUp className="h-4 w-4 text-blue-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </div>
                {expandedCategories[category] && (
                  <div className="p-3 space-y-2">
                    {standards.map(standard => (
                      <div key={standard.id} className="pl-2 border-l-2 border-blue-200">
                        <h6 className="text-sm font-medium text-gray-900">{standard.name}</h6>
                        <p className="text-sm text-gray-500">{standard.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
