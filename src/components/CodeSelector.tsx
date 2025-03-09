
import { RegionCode, codeStandards } from '@/types/codes';
import { Button } from './ui/button';
import { Check, Globe } from 'lucide-react';

interface CodeSelectorProps {
  selectedRegion: RegionCode | null;
  onRegionSelect: (region: RegionCode) => void;
}

export function CodeSelector({ selectedRegion, onRegionSelect }: CodeSelectorProps) {
  const countries: RegionCode[] = ['USA', 'ISRAEL', 'EUROPE'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Select Country</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {countries.map((country) => (
          <Button
            key={country}
            variant={selectedRegion === country ? 'primary' : 'outline'}
            className="justify-between"
            onClick={() => onRegionSelect(country)}
          >
            {country}
            {selectedRegion === country && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </Button>
        ))}
      </div>

      {selectedRegion && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Applicable Standards:
          </h4>
          <div className="space-y-2">
            {codeStandards
              .filter(standard => standard.region === selectedRegion)
              .map(standard => (
                <div
                  key={standard.id}
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        {standard.name}
                      </h5>
                      <p className="text-sm text-gray-500">
                        {standard.description}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {standard.category}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
