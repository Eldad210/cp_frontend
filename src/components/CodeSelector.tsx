import { RegionCode, codeStandards } from '@/types/codes';
import { Check, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, List, ListItemButton } from '@mui/material';

interface CodeSelectorProps {
  selectedRegion: RegionCode | null;
  onRegionSelect: (region: RegionCode) => void;
}

export function CodeSelector({ selectedRegion, onRegionSelect }: CodeSelectorProps) {
  const countries: RegionCode[] = ['USA', 'ISRAEL'];
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedRegion) {
      const groupedStandards = getGroupedStandards();
      const initialExpandedState = Object.keys(groupedStandards).reduce(
        (acc, category) => {
          acc[category] = false;
          return acc;
        },
        {} as Record<string, boolean>
      );
      setExpandedCategories(initialExpandedState);
    }
  }, [selectedRegion]);

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
    <Box sx={{ marginTop: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Globe size={20} color="#2563eb" />
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#111827' }}>
          Select Country
        </Typography>
      </Box>
      
      <Box sx={{ position: 'relative' }}>
        <Button
          variant={selectedRegion ? "contained" : "outlined"}
          fullWidth
          onClick={toggleDropdown}
          sx={{
            justifyContent: 'space-between',
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: selectedRegion ? '#2563eb' : 'white',
            color: selectedRegion ? 'white' : '#111827',
            borderColor: selectedRegion ? '#1e40af' : '#d1d5db',
            textTransform: 'none'
          }}
          endIcon={<ChevronDown size={16} />}
        >
          {selectedRegion || "Choose country"}
        </Button>
        
        {isOpen && (
          <Paper
            sx={{
              position: 'absolute',
              zIndex: 10,
              marginTop: 1,
              width: '100%',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e5e7eb'
            }}
          >
            <List sx={{ py: 1, maxHeight: '240px', overflow: 'auto' }}>
              {countries.map((country) => (
                <ListItemButton
                  key={country}
                  onClick={() => handleSelect(country)}
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: selectedRegion === country ? '#eff6ff' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#f9fafb'
                    }
                  }}
                >
                  <Typography>{country}</Typography>
                  {selectedRegion === country && (
                    <Check size={16} color="#2563eb" />
                  )}
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {selectedRegion && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#4b5563', mb: 3 }}>
            Codes:
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {Object.entries(groupedStandards).map(([category, standards]) => (
              <Paper
                key={category}
                sx={{
                  backgroundColor: '#eff6ff',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    backgroundColor: '#dbeafe',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleCategory(category)}
                >
                  <Typography sx={{ fontWeight: 500, color: '#1e40af' }}>
                    {category}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        fontSize: '12px',
                        backgroundColor: '#bfdbfe',
                        color: '#1e40af',
                        px: 2,
                        py: 1,
                        borderRadius: '4px'
                      }}
                    >
                      {standards.length} standard{standards.length !== 1 ? 's' : ''}
                    </Box>
                    {expandedCategories[category] ? (
                      <ChevronUp size={16} color="#2563eb" />
                    ) : (
                      <ChevronDown size={16} color="#2563eb" />
                    )}
                  </Box>
                </Box>
                {expandedCategories[category] && (
                  <Box sx={{ p: 3 }}>
                    {standards.map(standard => (
                      <Box
                        key={standard.id}
                        sx={{
                          pl: 2,
                          borderLeft: '2px solid #bfdbfe',
                          mb: 2,
                          '&:last-child': { mb: 0 }
                        }}
                      >
                        <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                          {standard.name}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#6b7280' }}>
                          {standard.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
