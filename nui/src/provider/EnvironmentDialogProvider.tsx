import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
  SyntheticEvent,
} from 'react';

import { styled, } from '@mui/system';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { useKeyboardNavContext } from './KeyboardNavProvider';
import { useSnackbar } from 'notistack';
import { useTranslate } from 'react-polyglot';
import { useSetDisableTab, useSetListenForExit } from '../state/keys.state';
import { txAdminMenuPage, usePageValue } from '../state/page.state';

// UI Components:
import { PresetView } from '../components/EnvironmentPage/PresetView';
import { AdvancedView } from '../components/EnvironmentPage/AdvancedView';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'center',
  paddingBottom: theme.spacing(1),
}));

interface EnvironmentDialogProviderContext {
  openEnvironmentDialog: () => void;
  closeEnvironmentDialog: () => void;
  isDialogOpen: boolean;
}

const EnvironmentDialogContext = createContext<EnvironmentDialogProviderContext | null>(null);

interface DialogProviderProps {
  children: ReactNode;
}

export const EnvironmentDialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const theme = useTheme();
  const [canSubmit, setCanSubmit] = useState(true);

  const setDisableTabs = useSetDisableTab();
  const { setDisabledKeyNav } = useKeyboardNavContext();
  const setListenForExit = useSetListenForExit();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInputVal, setDialogInputVal] = useState<string>('');
  const [currentView, setCurrentView] = useState<'PresetView' | 'advanced'>('PresetView');

  const { enqueueSnackbar } = useSnackbar();
  const curPage = usePageValue();
  const t = useTranslate();

  useEffect(() => {
    if (curPage === txAdminMenuPage.Main) {
      setDisabledKeyNav(dialogOpen);
      setDisableTabs(dialogOpen);
    }
  }, [dialogOpen, setDisabledKeyNav, setDisableTabs]);

  const openEnvironmentDialog = useCallback(() => {
    setDialogOpen(true);
    setListenForExit(false);
  }, []);

  const closeEnvironmentDialog = useCallback(() => {
    setDialogOpen(false);
    setListenForExit(true);
  }, []);

  const navigateToAdvanced = useCallback(() => {
    setCurrentView('advanced');
  }, []);

  const navigateToPresets = useCallback(() => {
    setCurrentView('PresetView');
  }, []);

  const handleDialogClose = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
    closeEnvironmentDialog();
  }, [closeEnvironmentDialog]);

  const handleOnExited = () => {
    setCanSubmit(true);
    setDialogInputVal('');
    setCurrentView('PresetView'); // Reset to presets view when dialog closes
  };

  return (
    <EnvironmentDialogContext.Provider
      value={{
        openEnvironmentDialog,
        closeEnvironmentDialog: closeEnvironmentDialog,
        isDialogOpen: dialogOpen,
      }}
    >
      <Dialog
        onClose={handleDialogClose}
        open={dialogOpen}
        fullWidth
        TransitionProps={{
          onExited: handleOnExited,
        }}
        PaperProps={{
          style: {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            //handleDialogSubmit();
          }}
        >
          <StyledDialogTitle style={{ textAlign: "left" }}>
            {currentView === 'PresetView' ? 'Time' : 'More Options'}
          </StyledDialogTitle>
          <DialogContent>
            {currentView === 'PresetView' ? (
              <PresetView
                canSubmit={canSubmit}
                onNavigateToAdvanced={navigateToAdvanced}
              />
            ) : (
              <AdvancedView
                canSubmit={canSubmit}
                onNavigateToPresets={navigateToPresets}
              />
            )}
          </DialogContent>
        </form>
      </Dialog>
      {children}
    </EnvironmentDialogContext.Provider>
  );
};

export const useEnvironmentDialogContext = () => {
  const context = useContext(EnvironmentDialogContext);
  if (!context) {
    throw new Error('useEnvironmentDialogContext must be used within an EnvironmentDialogProvider');
  }
  return context;
};

