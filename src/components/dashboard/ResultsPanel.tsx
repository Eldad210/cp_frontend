import { useState } from 'react';
import { AnalysisResult, Plan } from '../../types';
import { ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { PlanViewer } from '../notUsed/PlanViewer';
import { 
  Box, 
  Paper, 
  Typography, 
  Chip,
  Divider,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';

type SeverityFilter = 'all' | 'error' | 'warning' | 'info';

interface ResultsPanelProps {
  onFileSelect: (file: File) => void;
  activePlan: Plan | null;
  selectedFile: File | null;
  selectedRegion: string | null;
  isAnalyzing?: boolean;
  selectedCodes: Array<{ countryCode: string; codeNum: string }>;
  onRunAnalysis: () => void;
}

export function ResultsPanel({ 
  onFileSelect, 
  activePlan, 
  selectedFile, 
  selectedRegion, 
  isAnalyzing = false, 
  selectedCodes, 
  onRunAnalysis 
}: ResultsPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('error');

  const getGroupedResults = (results: AnalysisResult[]) => {
    const filteredResults = severityFilter === 'all' 
      ? results 
      : results.filter(result => result.severity === severityFilter);

    return filteredResults.reduce((groups, result) => {
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

  const handleSeverityChange = (
    event: React.MouseEvent<HTMLElement>,
    newSeverity: SeverityFilter | null,
  ) => {
    if (newSeverity !== null) {
      setSeverityFilter(newSeverity);
    }
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

  const getTotalIssueCount = (severity: SeverityFilter) => {
    if (!activePlan?.results) return 0;
    return severity === 'all'
      ? activePlan.results.length
      : activePlan.results.filter(result => result.severity === severity).length;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#475569' }}>
          Analysis Results
        </Typography>
        <Box sx={{ 
          ml: 'auto',
          px: 2,
          py: 0.5,
          bgcolor: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <Typography variant="body2" color="text.secondary">
            ISRAEL Standards
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <ToggleButtonGroup
          value={severityFilter}
          exclusive
          onChange={handleSeverityChange}
          aria-label="severity filter"
          size="small"
        >
          <ToggleButton 
            value="all" 
            aria-label="all issues"
            sx={{ 
              px: 2,
              '&.Mui-selected': {
                bgcolor: '#e2e8f0',
                '&:hover': {
                  bgcolor: '#cbd5e1',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">All</Typography>
              <Chip 
                label={getTotalIssueCount('all')} 
                size="small" 
                sx={{ bgcolor: '#94a3b8', color: 'white' }} 
              />
            </Box>
          </ToggleButton>
          <ToggleButton 
            value="error" 
            aria-label="errors only"
            sx={{ 
              px: 2,
              '&.Mui-selected': {
                bgcolor: '#fee2e2',
                '&:hover': {
                  bgcolor: '#fecaca',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AlertCircle size={16} color="#ef4444" />
              <Typography variant="body2">Errors</Typography>
              <Chip 
                label={getTotalIssueCount('error')} 
                size="small" 
                sx={{ bgcolor: '#ef4444', color: 'white' }} 
              />
            </Box>
          </ToggleButton>
          <ToggleButton 
            value="warning" 
            aria-label="warnings only"
            sx={{ 
              px: 2,
              '&.Mui-selected': {
                bgcolor: '#fef3c7',
                '&:hover': {
                  bgcolor: '#fde68a',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AlertTriangle size={16} color="#f59e0b" />
              <Typography variant="body2">Warnings</Typography>
              <Chip 
                label={getTotalIssueCount('warning')} 
                size="small" 
                sx={{ bgcolor: '#f59e0b', color: 'white' }} 
              />
            </Box>
          </ToggleButton>
          <ToggleButton 
            value="info" 
            aria-label="info only"
            sx={{ 
              px: 2,
              '&.Mui-selected': {
                bgcolor: '#dbeafe',
                '&:hover': {
                  bgcolor: '#bfdbfe',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info size={16} color="#3b82f6" />
              <Typography variant="body2">Info</Typography>
              <Chip 
                label={getTotalIssueCount('info')} 
                size="small" 
                sx={{ bgcolor: '#3b82f6', color: 'white' }} 
              />
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {activePlan?.results && activePlan.results.length > 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            bgcolor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            p: 2
          }}>
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
          <Box sx={{ 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            p: 4
          }}>
            <Typography variant="body1" color="text.secondary">
              {isAnalyzing ? 'Analyzing...' : 'Run analysis to see results'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
