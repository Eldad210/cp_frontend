
import { AnalysisResult } from '@/types';
import { AlertTriangle, CheckCircle, Construction, Eye, Flame, HardHat, Info, Shield, XCircle } from 'lucide-react';
import { Box, Typography, Paper, Chip } from '@mui/material';

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const getSeverityIcon = (severity: AnalysisResult['severity']) => {
    switch (severity) {
      case 'error':
        return (
          <Box sx={{ display: 'flex', color: 'error.main' }}>
            <XCircle size={20} />
          </Box>
        );
      case 'warning':
        return (
          <Box sx={{ display: 'flex', color: 'warning.main' }}>
            <AlertTriangle size={20} />
          </Box>
        );
      case 'info':
        return (
          <Box sx={{ display: 'flex', color: 'info.main' }}>
            <Info size={20} />
          </Box>
        );
    }
  };

  const getCategoryIcon = (category: AnalysisResult['category']) => {
    switch (category) {
      case 'safety':
        return (
          <Box sx={{ display: 'flex', color: 'orange.500' }}>
            <HardHat size={20} />
          </Box>
        );
      case 'accessibility':
        return (
          <Box sx={{ display: 'flex', color: 'purple.500' }}>
            <Eye size={20} />
          </Box>
        );
      case 'structural':
        return (
          <Box sx={{ display: 'flex', color: 'primary.dark' }}>
            <Construction size={20} />
          </Box>
        );
      case 'energy':
        return (
          <Box sx={{ display: 'flex', color: 'warning.dark' }}>
            <Flame size={20} />
          </Box>
        );
      case 'general':
      default:
        return (
          <Box sx={{ display: 'flex', color: 'text.secondary' }}>
            <Shield size={20} />
          </Box>
        );
    }
  };

  // Group results by category
  const resultsByCategory = results.reduce<Record<string, AnalysisResult[]>>((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {});

  // Order categories by importance
  const categoryOrder: AnalysisResult['category'][] = ['safety', 'structural', 'accessibility', 'energy', 'general'];
  const sortedCategories = Object.keys(resultsByCategory).sort(
    (a, b) => categoryOrder.indexOf(a as any) - categoryOrder.indexOf(b as any)
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {results.length > 0 ? (
        sortedCategories.map((category) => (
          <Box key={category} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
              {getCategoryIcon(category as AnalysisResult['category'])}
              <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                {category}
              </Typography>
              <Chip 
                size="small" 
                label={resultsByCategory[category].length} 
                sx={{ ml: 1, bgcolor: 'background.paper' }}
              />
            </Box>
            
            {resultsByCategory[category].map((result) => (
              <Paper
                key={result.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderLeftWidth: 4,
                  borderLeftColor:
                    result.severity === 'error'
                      ? 'error.main'
                      : result.severity === 'warning'
                      ? 'warning.main'
                      : 'info.main',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  {getSeverityIcon(result.severity)}
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2">
                        Code: {result.code}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {result.location}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {result.description}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                      Recommendation: {result.recommendation}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        ))
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', color: 'success.main', mb: 1 }}>
            <CheckCircle size={48} />
          </Box>
          <Typography variant="h6" gutterBottom>
            All Clear!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No compliance issues were found in the plans.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
