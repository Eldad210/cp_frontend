import React, { useCallback, useEffect, useRef, useState , Fragment} from "react";
import { Box, Backdrop, CircularProgress, Button , Grid, Popover, Typography} from "@mui/material";
import { SnackbarContent } from "./Snackbar";
import { IfcViewerAPI } from "web-ifc-viewer";
import { Color } from "three";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { useTranslation } from "@/i18n/LanguageProvider";

interface IFCViewerProps {
  file: File;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

interface IfcRecord {
  [key: string]: string;
}

export const IFCViewer: React.FC<IFCViewerProps> = ({ file, onError, onLoad }) => {
  const { t } = useTranslation();
  // const [ifcLoadingErrorMessage, setIfcLoadingErrorMessage] =
  // useState<string>();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const viewerContainer = useRef<HTMLDivElement>(null);
  const [ifcLoadingErrorMessage, setIfcLoadingErrorMessage] =
      useState<string>();
  const viewer = useRef<IfcViewerAPI | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
   const [curIfcRecords, setIfcRecords] = React.useState<IfcRecord>();

  const id = popoverOpen ? "simple-popover" : undefined;
  const wasmPath = `${import.meta.env.BASE_URL || "/"}ifcjs/`;
   
   const handleClose = () => {
    setPopoverOpen(false);
  };

  const setupViewer = useCallback(async () => {
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

    await viewer.current.IFC.setWasmPath(wasmPath);

    // viewer.current.grid.setGrid();
    // viewer.current.axes.setAxes();
  }, [wasmPath]);

  const ifcOnLoadError = async (err: unknown) => {
    setIfcLoadingErrorMessage(String(err));
  };

  useEffect(() => {
    void setupViewer();

    return () => {
      if (viewer.current) {
        viewer.current.dispose();
      }
    };
  }, [setupViewer]);

  useEffect(() => {
    const loadIfc = async () => {


      if (file && viewer.current) {
         setIfcLoadingErrorMessage("");
         setLoading(true);
        console.log("loading file");
       
        try {
          const model = await viewer.current.IFC.loadIfc(file, true, ifcOnLoadError);
          if (!model) {
            throw new Error("IFC viewer could not parse the model");
          }
          console.log("build model");
          await viewer.current.shadowDropper.renderShadow(model.modelID);
          console.log("render shadow");
          onLoad?.();
        } catch (error) {
          const normalizedError = error instanceof Error ? error : new Error("Failed to load IFC file");
          setIfcLoadingErrorMessage(normalizedError.message);
          onError?.(normalizedError);
        } finally {
          setIsSnackbarOpen(true);
          setLoading(false);
          console.log("done");
        }
      
      }
      // if (!file || !viewer.current) return;

      // try {
      //   // Clear existing models
      //   const manager = viewer.current.IFC.loader.ifcManager;
      //   if (manager.state.models.size > 0) {
      //     for (const [modelID] of manager.state.models) {
      //       await viewer.current.IFC.closeModel(modelID);
      //     }
      //   }

      //   const url = URL.createObjectURL(file);
      //   const model = await viewer.current.IFC.loadIfcUrl(url);
      //   URL.revokeObjectURL(url);

      //   onLoad?.();
      // } catch (error) {
      //   console.error("Error loading IFC file:", error);
      //   onError?.(error instanceof Error ? error : new Error("Failed to load IFC file"));
      // }
    };

    void setupViewer().then(loadIfc);
  }, [file, setupViewer]);

  const clearModel = async () => {
    setupViewer();
  };

  const ifcOnDoubleClick = async () => {
    if (viewer.current) {
      const result = await viewer.current.IFC.selector.pickIfcItem(true, true);
      if (result) {
        const props = await viewer.current.IFC.getProperties(
          result.modelID,
          result.id,
          false
        );
        console.log(props);
        const type = await viewer.current.IFC.loader.ifcManager.getIfcType(
          result.modelID,
          result.id
        );
        // convert props to record
        if (props) {
          const ifcRecords: IfcRecord = {};
          ifcRecords[t('viewer.entityType')] = type;
          ifcRecords[t('viewer.globalId')] = props.GlobalId && props.GlobalId?.value;
          ifcRecords[t('viewer.name')] = props.Name && props.Name?.value;
          ifcRecords[t('viewer.objectType')] =
            props.ObjectType && props.ObjectType?.value;
          ifcRecords[t('viewer.predefinedType')] =
            props.PredefinedType && props.PredefinedType?.value;
          setIfcRecords(ifcRecords);
        }
        setPopoverOpen(true);
      }
    }
  };

  const ifcOnRightClick = async () => {
    if (viewer.current) {
      viewer.current.clipper.deleteAllPlanes();
      viewer.current.clipper.createPlane();
    }
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
        onDoubleClick={ifcOnDoubleClick}
        onContextMenu={ifcOnRightClick}
        onMouseMove={viewer.current ? () => viewer.current?.IFC.selector.prePickIfcItem() : undefined}
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
      
            <Backdrop
              sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.modal + 1,
                bgcolor: 'rgba(0,0,0,0.5)'
              }}
              open={loading}
            >
              <CircularProgress  color="inherit"/>
            </Backdrop>

              <SnackbarContent
                    isSnackbarOpen={isSnackbarOpen}
                    setIsSnackbarOpen={setIsSnackbarOpen}
                    ifcLoadingErrorMessage={ifcLoadingErrorMessage}
                  />
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
          {t('viewer.clear')}
        </Button>
      </Box>

      <Popover
                id={id}
                open={popoverOpen}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Grid container component={"dl"} spacing={2} sx={{ p: 2 }}>
                  <Grid item>
                    {curIfcRecords &&
                      Object.keys(curIfcRecords).map(
                        (key) =>
                          curIfcRecords[key] && (
                            <Fragment key={key}>
                              <Typography component="dt" variant="body2">
                                {key}
                              </Typography>
                              <Typography sx={{ pb: 1 }} component={"dd"}>
                                {curIfcRecords[key]}
                              </Typography>
                            </Fragment>
                          )
                      )}
                  </Grid>
                </Grid>
              </Popover>
    </Box>
    
  );
};


