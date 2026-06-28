
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Box, Typography, Paper, Button as MuiButton } from '@mui/material';
import { useTranslation } from '@/i18n/LanguageProvider';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  buttonText?: string;
}

export function FileUpload({ onFileSelect ,buttonText}: FileUploadProps) {
  const { t } = useTranslation();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.ifc'],
    },
    maxFiles: 1,
  });

  return (
    <Paper
      {...getRootProps()}
      variant="outlined"
      sx={{
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease-in-out',
        bgcolor: 'background.paper',
        '&:hover': {
          borderColor: 'primary.main',
        },
        width: '100%',
        maxWidth: '350px',
        margin: '0 auto'
      }}
    >
      <input {...getInputProps()} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Upload size={36} style={{ color: '#94a3b8' }} />
        <Typography variant="h6" sx={{ mt: 1.5, color: 'text.primary', fontSize: '1rem' }}>
          {t('upload.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
          {isDragActive
            ? t('upload.dragActive')
            : t('upload.instructions')}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
          {t('upload.format')}
        </Typography>
        <MuiButton 
          variant="outlined" 
          color="primary"
          size="small" 
          sx={{ mt: 1.5, textTransform: 'none', px: 3, py: 0.5 }}
        >
          {buttonText || t('upload.button')}
        </MuiButton>
      </Box>
    </Paper>
  );
}
