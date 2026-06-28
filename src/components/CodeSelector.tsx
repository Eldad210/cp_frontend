import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Checkbox } from '@mui/material';
import { getCodeList } from '@/api/analysisService';
import { useTranslation } from '@/i18n/LanguageProvider';
import { getCategoryLabel, getRuleText } from '@/i18n/ruleText';

interface CodeSelectorProps {
  selectedCodes: Array<{ countryCode: string; codeNum: string }>;
  onCodeSelect: (codes: Array<{ countryCode: string; codeNum: string }>) => void;
}

type CodeItem = {
  countryCode: string;
  codeNum: string;
  description: string;
  name: string;
  category: string | string[];
  categoryDescription?: string | string[];
};

export function CodeSelector({ 
  selectedCodes,
  onCodeSelect 
}: CodeSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [codes, setCodes] = useState<CodeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useTranslation();

  useEffect(() => {
    const fetchCodes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getCodeList({
          countryCode: ['IL'],
          language: [language.toUpperCase()]
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
          const categories = [...new Set(response.results.map(code => getCategoryKey(code.category)))];
          const initialExpandedState = categories.reduce(
            (acc, category) => {
              acc[category] = false;
              return acc;
            },
            {} as Record<string, boolean>
          );
          setExpandedCategories(initialExpandedState);
        } else {
          setError(response.message || t('codes.loadError'));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('codes.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, [language, onCodeSelect, t]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getCategoryKey = (category: string | string[]) => {
    if (Array.isArray(category)) {
      return category[0] || 'general';
    }
    return category || 'general';
  };

  const normalizeCategoryDescription = (description?: string | string[]) => {
    if (Array.isArray(description)) {
      return description.join(', ');
    }
    return description;
  };

  const getDisplayName = (code: CodeItem) => (
    getRuleText(language, code.codeNum)?.name || code.name
  );

  const getDisplayDescription = (code: CodeItem) => (
    getRuleText(language, code.codeNum)?.description || code.description
  );

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
    return codes.reduce((groups, code) => {
      const category = getCategoryKey(code.category);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(code);
      return groups;
    }, {} as Record<string, CodeItem[]>);
  };

  const groupedCodes = getGroupedCodes();

  return (
    <Box sx={{ 
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: 'none',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        p: 2,
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
          {t('codes.title')}
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 6 }}>
            <CircularProgress size={28} sx={{ color: '#0f766e' }} />
            <Typography variant="body2" color="text.secondary">{t('codes.loading')}</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ py: 4, textAlign: 'center' }}>
            {error}
          </Typography>
        ) : Object.keys(groupedCodes).length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            {t('codes.empty')}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.entries(groupedCodes).map(([category, categoryCodes]) => {
              const categoryDescription = categoryCodes[0]
                ? getRuleText(language, categoryCodes[0].codeNum)?.categoryDescription
                  || getCategoryLabel(language, category, normalizeCategoryDescription(categoryCodes[0].categoryDescription))
                : category;

              return (
                <Paper
                  key={category}
                  elevation={0}
                  sx={{
                    border: '1px solid #dbe5e1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: '#bfd4ce',
                    }
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#f8fafc',
                      borderBottom: expandedCategories[category] ? '1px solid #dbe5e1' : 'none',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: '#f0fdfa',
                      }
                    }}
                    onClick={() => toggleCategory(category)}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        color: '#334155',
                        fontSize: '0.9375rem'
                      }}
                    >
                      {categoryDescription}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: '#e2e8f0',
                          color: '#475569',
                          px: 1,
                          py: 0.35,
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
                    <Box sx={{ p: 1.5 }}>
                      {categoryCodes.map(code => (
                      <Box
                        key={`${code.countryCode}-${code.codeNum}`}
                        sx={{
                          mb: 1,
                          '&:last-child': { mb: 0 }
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            cursor: 'pointer',
                            p: 1.25,
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
                                color: '#0f766e',
                              },
                              '&:hover': {
                                backgroundColor: 'rgba(15, 118, 110, 0.06)',
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
                              {getDisplayName(code)}
                            </Typography>
                            <Typography 
                              sx={{ 
                                fontSize: '0.8125rem', 
                                color: '#64748b',
                                lineHeight: 1.4
                              }}
                            >
                              {getDisplayDescription(code)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
