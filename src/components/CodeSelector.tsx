import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Checkbox } from '@mui/material';
import { getCodeList, CodeListResponse } from '@/api/analysisService';

interface CodeSelectorProps {
  selectedCodes: Array<{ countryCode: string; codeNum: string }>;
  onCodeSelect: (codes: Array<{ countryCode: string; codeNum: string }>) => void;
}

export function CodeSelector({ 
  selectedCodes,
  onCodeSelect 
}: CodeSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [codes, setCodes] = useState<CodeListResponse['results']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCodes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getCodeList({
          countryCode: ['IL']
        });
        
        if (response.success && response.results) {
          setCodes(response.results);
          
          // Select all codes by default
          const allCodes = response.results.map(code => ({
            countryCode: code.countryCode,
            codeNum: code.codeNum
          }));
          onCodeSelect(allCodes);
          
          // Group codes by category and set initial expanded state
          const categories = [...new Set(response.results.map(code => code.category))];
          const initialExpandedState = categories.reduce(
            (acc, category) => {
              acc[category] = false;
              return acc;
            },
            {} as Record<string, boolean>
          );
          setExpandedCategories(initialExpandedState);
        } else {
          setError(response.message || 'Failed to fetch codes');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch codes');
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, []); // Only fetch once on mount

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  type CodeItem = {
    countryCode: string;
    codeNum: string;
    description: string;
    name: string;
    category: string;
  };

  const handleCodeSelect = (code: CodeItem) => {
    const isSelected = selectedCodes.some(
      selected => selected.countryCode === code.countryCode && selected.codeNum === code.codeNum
    );

    if (isSelected) {
      onCodeSelect(selectedCodes.filter(
        selected => !(selected.countryCode === code.countryCode && selected.codeNum === code.codeNum)
      ));
    } else {
      onCodeSelect([...selectedCodes, { countryCode: code.countryCode, codeNum: code.codeNum }]);
    }
  };

  const isCodeSelected = (code: CodeItem) => {
    if(selectedCodes){
      return selectedCodes.some(
        selected => selected.countryCode === code.countryCode && selected.codeNum === code.codeNum
      );
    }
    return false;
  };

  const getGroupedCodes = () => {
    if (!codes) return {};
    
    return codes.reduce((groups, code) => {
      const category = code.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(code);
      return groups;
    }, {} as Record<string, typeof codes>);
  };

  const groupedCodes = getGroupedCodes();

  return (
    <Box sx={{ 
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        p: 3,
        maxHeight: '75vh',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f5f9',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          borderRadius: '4px',
          '&:hover': {
            background: '#94a3b8',
          },
        },
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: '#1e293b',
            mb: 2.5,
            fontSize: '1.125rem'
          }}
        >
          Codes
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} sx={{ color: '#2563eb' }} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ py: 4, textAlign: 'center' }}>
            {error}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.entries(groupedCodes).map(([category, categoryCodes]) => (
              <Paper
                key={category}
                elevation={0}
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                  }
                }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#f8fafc',
                    borderBottom: expandedCategories[category] ? '1px solid #e2e8f0' : 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                    }
                  }}
                  onClick={() => toggleCategory(category)}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#334155',
                      fontSize: '0.9375rem'
                    }}
                  >
                    {category}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: '#e2e8f0',
                        color: '#475569',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        minWidth: '24px',
                        textAlign: 'center'
                      }}
                    >
                      {categoryCodes.length}
                    </Box>
                    {expandedCategories[category] ? (
                      <ChevronUp size={16} color="#64748b" />
                    ) : (
                      <ChevronDown size={16} color="#64748b" />
                    )}
                  </Box>
                </Box>
                {expandedCategories[category] && (
                  <Box sx={{ p: 2.5 }}>
                    {categoryCodes.map(code => (
                      <Box
                        key={`${code.countryCode}-${code.codeNum}`}
                        sx={{
                          mb: 2,
                          '&:last-child': { mb: 0 }
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            cursor: 'pointer',
                            p: 1.5,
                            borderRadius: '8px',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: '#f8fafc',
                            }
                          }}
                          onClick={() => handleCodeSelect(code)}
                        >
                          <Checkbox
                            checked={isCodeSelected(code)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleCodeSelect(code);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            size="small"
                            sx={{
                              color: '#94a3b8',
                              '&.Mui-checked': {
                                color: '#2563eb',
                              },
                              '&:hover': {
                                backgroundColor: 'rgba(37, 99, 235, 0.04)',
                              }
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              sx={{ 
                                fontSize: '0.875rem', 
                                fontWeight: 500, 
                                color: '#1e293b',
                                mb: 0.5,
                                lineHeight: 1.4
                              }}
                            >
                              {code.name}
                            </Typography>
                            <Typography 
                              sx={{ 
                                fontSize: '0.8125rem', 
                                color: '#64748b',
                                lineHeight: 1.4
                              }}
                            >
                              {code.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
