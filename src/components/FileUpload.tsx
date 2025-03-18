
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Box, Typography, Paper, Button as MuiButton } from '@mui/material';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
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
          Upload IFC Model
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
          {isDragActive
            ? "Drop the file here..."
            : "Drag 'n' drop your IFC model here, or click to select file"}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
          IFC format only (max. 50MB)
        </Typography>
        <MuiButton 
          variant="outlined" 
          color="primary"
          size="small" 
          sx={{ mt: 1.5, textTransform: 'none', px: 3, py: 0.5 }}
        >
          Select File
        </MuiButton>
      </Box>
    </Paper>
  );
}
