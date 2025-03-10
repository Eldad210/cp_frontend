
import { useState } from 'react';
import { AnalysisResult, Plan } from '../../types';
import { ChevronDown, ChevronUp, FileSearch } from 'lucide-react';
import { PlanViewer } from '../PlanViewer';
import { AnalysisResults } from '../AnalysisResults';
import { 
  Paper, 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Chip,
  Divider
} from '@mui/material';

interface ResultsPanelProps {
  activePlan: Plan | null;
  selectedFile: File | null;
  selectedRegion: string | null;
}

export function ResultsPanel({ activePlan, selectedFile, selectedRegion }: ResultsPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const getGroupedResults = (results: AnalysisResult[]) => {
    return results.reduce((groups, result) => {
      const category = result.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(result);
      return groups;
    }, {} as Record<string, AnalysisResult[]>);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <FileSearch color="primary" size={20} />
        <Typography variant="h6" component="h2">
          Analysis Results
        </Typography>
        {selectedRegion && (
          <Chip 
            label={`${selectedRegion} Standards`}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ ml: 'auto' }}
          />
        )}
      </Box>
      
      {activePlan && selectedFile ? (
        <Box sx={{ '& > *': { mb: 3 } }}>
          <PlanViewer file={selectedFile} results={activePlan.results} />
          
          {/* Custom grouped display of results with collapse/expand */}
          <Box sx={{ '& > *': { mb: 2 } }}>
            {Object.entries(getGroupedResults(activePlan.results)).map(([category, results]) => (
              <Accordion
                key={category}
                expanded={!!expandedCategories[category]}
                onChange={() => toggleCategory(category)}
                elevation={0}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}
              >
                <AccordionSummary
                  expandIcon={expandedCategories[category] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                      {category}
                    </Typography>
                    <Chip
                      label={`${results.length} issue${results.length !== 1 ? 's' : ''}`}
                      size="small"
                      variant="outlined"
                      sx={{ bgcolor: 'background.paper' }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <Box sx={{ '& > :not(:last-child)': { borderBottom: 1, borderColor: 'divider' } }}>
                    {results.map(result => (
                      <Box key={result.id} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box
                            sx={{
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              mt: 1.5,
                              bgcolor: result.severity === 'error' 
                                ? 'error.main' 
                                : result.severity === 'warning' 
                                  ? 'warning.main' 
                                  : 'info.main'
                            }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="subtitle2">{result.code}</Typography>
                              <Chip
                                label={result.severity}
                                size="small"
                                color={
                                  result.severity === 'error' 
                                    ? 'error' 
                                    : result.severity === 'warning' 
                                      ? 'warning' 
                                      : 'info'
                                }
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {result.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              <strong>Location:</strong> {result.location}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              <strong>Recommendation:</strong> {result.recommendation}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
          
          {/* Original AnalysisResults component (hidden) */}
          <Box sx={{ display: 'none' }}>
            <AnalysisResults results={activePlan.results} />
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary">
            {selectedRegion
              ? 'Upload a plan to see analysis results'
              : 'Select a country to begin analysis'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
