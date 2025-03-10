
import { RegionCode, codeStandards } from '@/types/codes';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  FormControl,
  MenuItem,
  Select,
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';

interface CodeSelectorProps {
  selectedRegion: RegionCode | null;
  onRegionSelect: (region: RegionCode) => void;
}

export function CodeSelector({ selectedRegion, onRegionSelect }: CodeSelectorProps) {
  const countries: RegionCode[] = ['USA', 'ISRAEL'];
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Initialize categories as collapsed by default when selectedRegion changes
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

  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    onRegionSelect(event.target.value as RegionCode);
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
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <PublicIcon color="primary" />
        <Typography variant="h6">
          Select Country
        </Typography>
      </Box>
      
      <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 3 }}>
        <Select
          value={selectedRegion || ''}
          onChange={handleCountryChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Select country' }}
          sx={{
            bgcolor: selectedRegion ? 'primary.main' : 'background.paper',
            color: selectedRegion ? 'primary.contrastText' : 'text.primary',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: selectedRegion ? 'primary.dark' : undefined,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: selectedRegion ? 'primary.dark' : undefined,
            },
          }}
        >
          <MenuItem value="" disabled>
            Choose country
          </MenuItem>
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedRegion && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Applicable Standards:
          </Typography>
          
          <Box sx={{ '& > *': { mb: 2 } }}>
            {Object.entries(groupedStandards).map(([category, standards]) => (
              <Accordion
                key={category}
                expanded={!!expandedCategories[category]}
                onChange={() => toggleCategory(category)}
                elevation={0}
                disableGutters
                sx={{ 
                  bgcolor: 'primary.light', 
                  '&.MuiAccordion-root:before': {
                    display: 'none',
                  },
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <AccordionSummary
                  expandIcon={expandedCategories[category] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                >
                  <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'medium', color: 'primary.dark' }}>
                      {category}
                    </Typography>
                    <Chip
                      label={`${standards.length} standard${standards.length !== 1 ? 's' : ''}`}
                      size="small"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: 'primary.lightest', p: 2 }}>
                  <Box sx={{ '& > *': { mb: 2 } }}>
                    {standards.map(standard => (
                      <Box 
                        key={standard.id} 
                        sx={{ 
                          pl: 2, 
                          borderLeft: 2, 
                          borderColor: 'primary.light'
                        }}
                      >
                        <Typography variant="subtitle2">{standard.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {standard.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
