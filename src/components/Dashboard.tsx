import { useState } from 'react';
import { Plan } from '../types';
import { useAuthStore } from '../store/authStore';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SidePanel } from './dashboard/SidePanel';
import { ResultsPanel } from './dashboard/ResultsPanel';
import { createAnalyzedPlan } from './dashboard/analysisUtils';
import { Box, Snackbar, Alert, Button, Typography } from '@mui/material';
import { sendAnalysisRequest } from '@/api/analysisService';
import { useNavigate } from 'react-router-dom';
import { IFCViewer } from "./IFCViewer";
import { FileCheck2, PlayCircle, PlusCircle, UploadCloud } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageProvider';
import { isIfcFile, isWithinIfcFileSizeLimit } from '@/utils/ifcFileValidation';

export function Dashboard() {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCodes, setSelectedCodes] = useState<Array<{ countryCode: string; codeNum: string }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { direction, language, t } = useTranslation();

  const handleFileSelect = (file: File) => {
    if (!isIfcFile(file)) {
      setAlert({ message: t('upload.errorType'), type: 'error' });
      return;
    }

    if (!isWithinIfcFileSizeLimit(file)) {
      setAlert({ message: t('upload.errorSize'), type: 'error' });
      return;
    }

    setSelectedFile(file);
  };

  const hasUnsupportedCodeResult = (results: NonNullable<Awaited<ReturnType<typeof sendAnalysisRequest>>['results']>) => (
    results.some((item) =>
      item.issues?.some((issue) => issue.message.toLowerCase().includes('codenum is not recognized'))
    )
  );

  const handleRunAnalysis = async () => {
    if (!selectedFile || selectedCodes.length === 0) {
      return;
    }

    setIsAnalyzing(true);
    setAlert({ message: t('dashboard.analyzingFile'), type: 'info' });
    
    try {
      const response = await sendAnalysisRequest(
        selectedFile,
        selectedCodes,
        language === 'he' ? 'HE' : 'EN',
      );
      
      if (response.success && response.results) {
        if (hasUnsupportedCodeResult(response.results)) {
          setAlert({ message: t('dashboard.backendOutdated'), type: 'error' });
          return;
        }

        const newPlan = createAnalyzedPlan(selectedFile, 'ISRAEL', response.results);
        setActivePlan(newPlan);
        setAlert({ message: t('dashboard.analysisComplete'), type: 'success' });
      } else {
        setAlert({ message: response.message || t('dashboard.analysisFailed'), type: 'error' });
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      setAlert({ 
        message: error instanceof Error ? error.message : t('dashboard.unknownAnalysisError'), 
        type: 'error' 
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#eef3f1', direction }}>
      <DashboardHeader user={user} onLogout={logout} />
      
      <Box sx={{
        display: 'flex',
        flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
        flex: 1,
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
      }}>
        <Box sx={{ 
          width: '330px',
          borderRight: direction === 'ltr' ? '1px solid #dbe5e1' : 'none',
          borderLeft: direction === 'rtl' ? '1px solid #dbe5e1' : 'none',
          bgcolor: '#ffffff'
        }}>
          <SidePanel 
            onFileSelect={handleFileSelect}
            onRunAnalysis={handleRunAnalysis}
            selectedFile={selectedFile}
            isAnalyzing={isAnalyzing}
            selectedCodes={selectedCodes}
            onCodeSelect={setSelectedCodes}
          />
        </Box>

        <Box sx={{ 
          flex: 1,
          borderRight: direction === 'ltr' ? '1px solid #dbe5e1' : 'none',
          borderLeft: direction === 'rtl' ? '1px solid #dbe5e1' : 'none',
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid #dbe5e1', bgcolor: '#fbfdfc' }}>
            <Box 
              component="label"
              sx={{ 
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#ffffff',
                borderRadius: '8px',
                border: '1px dashed #9fb9b2',
                p: 2.5,
                gap: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#0f766e',
                  bgcolor: '#f7fbfa'
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#0f766e';
                e.currentTarget.style.backgroundColor = '#f7fbfa';
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#9fb9b2';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  handleFileSelect(file);
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                <Box sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '8px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: selectedFile ? '#ecfdf5' : '#eff6ff',
                  border: selectedFile ? '1px solid #bbf7d0' : '1px solid #bfdbfe',
                  flexShrink: 0,
                }}>
                  {selectedFile ? <FileCheck2 size={22} color="#059669" /> : <UploadCloud size={22} color="#2563eb" />}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {selectedFile ? t('upload.change') : t('upload.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                    {selectedFile ? `${t('upload.currentFile')}: ${selectedFile.name}` : t('upload.instructions')}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                {t('upload.format')}
              </Typography>
              <input
                type="file"
                hidden
                accept=".ifc"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                  e.target.value = '';
                }}
              />
            </Box>
          </Box>

          <Box sx={{ flex: 1, minHeight: 0 }}>
            {selectedFile ? (
              <IFCViewer 
                file={selectedFile}
                onError={(error) => setAlert({ message: error.message, type: 'error' })}
              />
            ) : (
              <Box sx={{ 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f8fafc',
                color: '#64748b',
              }}>
                <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                  {t('viewer.empty')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ 
          width: '35%',
          minWidth: '380px',
          bgcolor: '#f8fafc'
        }}>
          <ResultsPanel 
            onFileSelect={handleFileSelect}
            activePlan={activePlan}
            selectedFile={selectedFile}
            selectedRegion="ISRAEL"
            isAnalyzing={isAnalyzing}
            selectedCodes={selectedCodes}
            onRunAnalysis={handleRunAnalysis}
          />
        </Box>
      </Box>

      <Box sx={{ 
        p: 1.25, 
        borderTop: '1px solid #dbe5e1',
        bgcolor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
          {t('dashboard.ready')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/create-validation')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <PlusCircle size={16} />
              {t('dashboard.createValidation')}
            </Box>
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || !selectedFile || selectedCodes.length === 0}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <PlayCircle size={16} />
              {isAnalyzing ? t('dashboard.analyzingFile') : t('dashboard.runAnalysis')}
            </Box>
          </Button>
        </Box>
      </Box>

      {alert && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity={alert.type} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
