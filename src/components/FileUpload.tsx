
import { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Box, Typography, Paper, Button as MuiButton } from '@mui/material';
import { useTranslation } from '@/i18n/LanguageProvider';
import { MAX_IFC_FILE_SIZE_BYTES } from '@/utils/ifcFileValidation';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  buttonText?: string;
}

export function FileUpload({ onFileSelect ,buttonText}: FileUploadProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const firstError = fileRejections[0]?.errors[0]?.code;
    setError(firstError === 'file-too-large' ? t('upload.errorSize') : t('upload.errorType'));
  }, [t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'application/octet-stream': ['.ifc'],
    },
    maxSize: MAX_IFC_FILE_SIZE_BYTES,
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
        {error && (
          <Typography color="error" variant="caption" sx={{ mt: 0.75, fontSize: '0.75rem' }}>
            {error}
          </Typography>
        )}
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
