import { Box, Button, Tooltip } from '@mui/material';
import { Languages } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';

export function LanguageSwitcher() {
  const { language, toggleLanguage, t } = useTranslation();
  const nextLanguageLabel = language === 'he' ? t('language.english') : t('language.hebrew');

  return (
    <Tooltip title={t('language.switch')}>
      <Button
        variant="outlined"
        size="small"
        onClick={toggleLanguage}
        sx={{
          minWidth: 92,
          borderColor: '#cbd5e1',
          color: '#334155',
          bgcolor: '#ffffff',
          '&:hover': {
            borderColor: '#0f766e',
            bgcolor: '#f0fdfa',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Languages size={16} />
          {nextLanguageLabel}
        </Box>
      </Button>
    </Tooltip>
  );
}

