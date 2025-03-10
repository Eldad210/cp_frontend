
import { useState } from 'react';
import { AnalysisResult, Plan } from '../../types';
import { ChevronDown, ChevronUp, FileSearch } from 'lucide-react';
import { PlanViewer } from '../PlanViewer';
import { 
  Box, 
  Paper, 
  Typography, 
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return '#ef4444';
      case 'warning': 
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FileSearch size={20} style={{ color: '#3b82f6', marginRight: 8 }} />
        <Typography variant="h6">Analysis Results</Typography>
        {selectedRegion && (
          <Chip 
            label={`${selectedRegion} Standards`} 
            sx={{ 
              ml: 'auto', 
              bgcolor: 'primary.light', 
              color: 'primary.contrastText',
              fontWeight: 500
            }} 
            size="small" 
          />
        )}
      </Box>
      
      {activePlan && selectedFile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <PlanViewer file={selectedFile} results={activePlan.results} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {Object.entries(getGroupedResults(activePlan.results)).map(([category, results]) => (
              <Paper 
                key={category} 
                variant="outlined" 
                sx={{ overflow: 'hidden', borderRadius: 1 }}
              >
                <Box 
                  sx={{
                    bgcolor: 'primary.light',
                    px: 1.5, 
                    py: 1, 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                  onClick={() => toggleCategory(category)}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: 'primary.contrastText', 
                      fontWeight: 500,
                      textTransform: 'capitalize'
                    }}
                  >
                    {category}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Chip 
                      label={`${results.length} issue${results.length !== 1 ? 's' : ''}`}
                      size="small"
                      sx={{ 
                        bgcolor: 'primary.dark', 
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                    {expandedCategories[category] ? (
                      <ChevronUp size={16} style={{ color: 'white' }} />
                    ) : (
                      <ChevronDown size={16} style={{ color: 'white' }} />
                    )}
                  </Box>
                </Box>
                {expandedCategories[category] && (
                  <Box>
                    {results.map((result, idx) => (
                      <Box key={result.id}>
                        {idx > 0 && <Divider />}
                        <Box sx={{ p: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Box 
                              sx={{ 
                                width: 6, 
                                height: 6, 
                                borderRadius: '50%', 
                                bgcolor: getSeverityColor(result.severity),
                                mt: 0.8
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="subtitle2">{result.code}</Typography>
                                <Chip 
                                  label={result.severity}
                                  size="small"
                                  sx={{ 
                                    bgcolor: `${getSeverityColor(result.severity)}20`,
                                    color: getSeverityColor(result.severity),
                                    fontWeight: 500
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.75 }}>
                                {result.description}
                              </Typography>
                              <Box sx={{ color: 'text.secondary' }}>
                                <Typography variant="caption" display="block">
                                  <Box component="span" sx={{ fontWeight: 'medium' }}>Location:</Box> {result.location}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ mt: 0.25 }}>
                                  <Box component="span" sx={{ fontWeight: 'medium' }}>Recommendation:</Box> {result.recommendation}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          <Typography>
            {selectedRegion
              ? 'Upload a plan to see analysis results'
              : 'Select a country to begin analysis'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
