
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Typography, Paper } from '@mui/material';

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
      variant="outlined"
      {...getRootProps()}
      sx={{
        borderStyle: 'dashed',
        borderColor: theme => isDragActive ? theme.palette.primary.main : 'divider',
        borderRadius: 1,
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover',
        },
        transition: 'all 0.2s',
      }}
    >
      <input {...getInputProps()} />
      <div style={{ color: 'text.secondary', margin: 'auto', marginBottom: '16px' }}>
        <Upload size={48} />
      </div>
      <Typography variant="h6" gutterBottom>
        Upload IFC Model
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {isDragActive
          ? "Drop the file here..."
          : "Drag 'n' drop your IFC model here, or click to select file"}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        IFC format only (max. 50MB)
      </Typography>
      <Button variant="outline" size="sm">
        Select File
      </Button>
    </Paper>
  );
}
