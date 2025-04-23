import React, { useEffect, useRef } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { IfcViewerAPI } from "web-ifc-viewer";
import { Color } from "three";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

interface IFCViewerProps {
  file: File;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

export const IFCViewer: React.FC<IFCViewerProps> = ({ file, onError, onLoad }) => {
  const viewerContainer = useRef<HTMLDivElement>(null);
  const viewer = useRef<IfcViewerAPI | null>(null);

  const setupViewer = async () => {
    if (!viewerContainer.current) return;

    // Clean up previous viewer if it exists
    if (viewer.current?.dispose) {
      viewer.current.dispose();
    }

    // Initialize viewer
    viewer.current = new IfcViewerAPI({
      container: viewerContainer.current,
      backgroundColor: new Color(0xffffff)
    });

    // Set WASM path before any IFC operations
    viewer.current.IFC.setWasmPath("node_modules/web-ifc/");

    // viewer.current.grid.setGrid();
    // viewer.current.axes.setAxes();
  };

  useEffect(() => {
    setupViewer();

    return () => {
      if (viewer.current) {
        viewer.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const loadIfc = async () => {
      if (!file || !viewer.current) return;

      try {
        // Clear existing models
        const manager = viewer.current.IFC.loader.ifcManager;
        if (manager.state.models.size > 0) {
          for (const [modelID] of manager.state.models) {
            await viewer.current.IFC.closeModel(modelID);
          }
        }

        const url = URL.createObjectURL(file);
        const model = await viewer.current.IFC.loadIfcUrl(url);
        URL.revokeObjectURL(url);

        onLoad?.();
      } catch (error) {
        console.error("Error loading IFC file:", error);
        onError?.(error instanceof Error ? error : new Error("Failed to load IFC file"));
      }
    };

    setupViewer();
    loadIfc();
  }, [file]);

  const clearModel = async () => {
    setupViewer();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
     

      <Box sx={{ 
        flex: 1,
        position: 'relative',
        bgcolor: 'grey.100',
        borderRadius: 1,
        overflow: 'hidden'
      }}>
        <div 
          ref={viewerContainer} 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }} 
        />
      </Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 1 
      }}>
        {/* <Typography variant="subtitle2" sx={{ flex: 1, textAlign: 'center' }}>
          IFC Model Viewer
        </Typography> */}
        <Button 
          size="small"
          variant="outlined"
          onClick={clearModel}
          startIcon={<CleaningServicesIcon />}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
};


