import { create } from 'zustand';
import { ComponentItem, Screen, PanelLayoutPreset } from '../types/builder';
import { INITIAL_SCREENS } from '../utils/defaultTemplates';

interface CanvasStore {
  screens: Screen[];
  activeScreenId: string;
  selectedPanelId: string;
  selectedComponentId: string | null;
  isPreviewMode: boolean;
  history: Screen[][];
  future: Screen[][];

  // Actions
  togglePreviewMode: () => void;
  setActiveScreen: (screenId: string) => void;
  addScreen: (name: string) => void;
  deleteScreen: (screenId: string) => void;
  selectPanel: (panelId: string) => void;
  selectComponent: (id: string | null) => void;
  
  setPanelLayout: (preset: PanelLayoutPreset) => void;
  setPanelWidth: (panelId: string, width: string) => void;

  addComponent: (component: Omit<ComponentItem, 'id'>, targetPanelId?: string) => void;
  updateComponent: (id: string, updates: Partial<ComponentItem>) => void;
  deleteComponent: (id: string) => void;
  moveComponent: (id: string, direction: 'up' | 'down') => void;
  
  undo: () => void;
  redo: () => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  screens: INITIAL_SCREENS,
  activeScreenId: INITIAL_SCREENS[0].id,
  selectedPanelId: INITIAL_SCREENS[0].panels[0].id,
  selectedComponentId: INITIAL_SCREENS[0].panels[0].components[0]?.id || null,
  isPreviewMode: false,
  history: [],
  future: [],

  togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),

  setActiveScreen: (screenId) => {
    const screen = get().screens.find((s) => s.id === screenId);
    if (!screen) return;
    set({
      activeScreenId: screenId,
      selectedPanelId: screen.panels[0]?.id || '',
      selectedComponentId: screen.panels[0]?.components[0]?.id || null,
    });
  },

  addScreen: (name) => {
    const newId = `screen-${Date.now()}`;
    const newScreen: Screen = {
      id: newId,
      name,
      panels: [
        {
          id: `panel-${Date.now()}-1`,
          title: '기본 패널',
          width: 'flex-1',
          components: [],
        },
      ],
    };
    set((state) => ({
      history: [...state.history, state.screens],
      future: [],
      screens: [...state.screens, newScreen],
      activeScreenId: newId,
      selectedPanelId: newScreen.panels[0].id,
      selectedComponentId: null,
    }));
  },

  deleteScreen: (screenId) => {
    const { screens, activeScreenId } = get();
    if (screens.length <= 1) return;
    const filtered = screens.filter((s) => s.id !== screenId);
    set({
      screens: filtered,
      activeScreenId: activeScreenId === screenId ? filtered[0].id : activeScreenId,
      selectedPanelId: filtered[0].panels[0]?.id || '',
      selectedComponentId: null,
    });
  },

  selectPanel: (panelId) => set({ selectedPanelId: panelId }),

  selectComponent: (id) => set({ selectedComponentId: id }),

  setPanelLayout: (preset) => {
    const { screens, activeScreenId, history } = get();
    const currentScreen = screens.find((s) => s.id === activeScreenId);
    if (!currentScreen) return;

    let newPanels = [...currentScreen.panels];

    if (preset === '1-panel') {
      newPanels = [
        {
          id: `panel-1-${Date.now()}`,
          title: '전체 화면 패널',
          width: 'flex-1',
          components: currentScreen.panels.flatMap((p) => p.components),
        },
      ];
    } else if (preset === '2-panel') {
      const allComps = currentScreen.panels.flatMap((p) => p.components);
      newPanels = [
        {
          id: `panel-side-${Date.now()}`,
          title: '좌측 사이드바',
          width: '280px',
          components: allComps.slice(0, 2),
        },
        {
          id: `panel-main-${Date.now()}`,
          title: '메인 컨텐츠',
          width: 'flex-1',
          components: allComps.slice(2),
        },
      ];
    } else if (preset === '3-panel') {
      newPanels = INITIAL_SCREENS[0].panels;
    }

    const updatedScreens = screens.map((scr) =>
      scr.id === activeScreenId ? { ...scr, panels: newPanels } : scr
    );

    set({
      history: [...history, screens],
      future: [],
      screens: updatedScreens,
      selectedPanelId: newPanels[0].id,
      selectedComponentId: newPanels[0].components[0]?.id || null,
    });
  },

  setPanelWidth: (panelId, width) => {
    const { screens, activeScreenId } = get();
    const updatedScreens = screens.map((scr) => {
      if (scr.id !== activeScreenId) return scr;
      return {
        ...scr,
        panels: scr.panels.map((p) => (p.id === panelId ? { ...p, width } : p)),
      };
    });
    set({ screens: updatedScreens });
  },

  addComponent: (componentData, targetPanelId) => {
    const { screens, activeScreenId, selectedPanelId, history } = get();
    const panelToUse = targetPanelId || selectedPanelId;
    const newComponent: ComponentItem = {
      ...componentData,
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    };

    const newScreens = screens.map((scr) => {
      if (scr.id !== activeScreenId) return scr;
      return {
        ...scr,
        panels: scr.panels.map((p) => {
          if (p.id !== panelToUse) return p;
          return {
            ...p,
            components: [...p.components, newComponent],
          };
        }),
      };
    });

    set({
      history: [...history, screens],
      future: [],
      screens: newScreens,
      selectedPanelId: panelToUse,
      selectedComponentId: newComponent.id,
    });
  },

  updateComponent: (id, updates) => {
    const { screens, activeScreenId } = get();
    const newScreens = screens.map((scr) => {
      if (scr.id !== activeScreenId) return scr;
      return {
        ...scr,
        panels: scr.panels.map((p) => ({
          ...p,
          components: p.components.map((comp) => {
            if (comp.id !== id) return comp;
            const mergedAction = updates.action
              ? ({ ...(comp.action || { type: 'none' }), ...updates.action } as any)
              : comp.action;
            return {
              ...comp,
              ...updates,
              styles: { ...comp.styles, ...updates.styles },
              action: mergedAction,
            };
          }),
        })),
      };
    });

    set({ screens: newScreens });
  },

  deleteComponent: (id) => {
    const { screens, activeScreenId, history } = get();
    const newScreens = screens.map((scr) => {
      if (scr.id !== activeScreenId) return scr;
      return {
        ...scr,
        panels: scr.panels.map((p) => ({
          ...p,
          components: p.components.filter((comp) => comp.id !== id),
        })),
      };
    });

    set({
      history: [...history, screens],
      future: [],
      screens: newScreens,
      selectedComponentId: null,
    });
  },

  moveComponent: (id, direction) => {
    const { screens, activeScreenId } = get();
    const newScreens = screens.map((scr) => {
      if (scr.id !== activeScreenId) return scr;
      return {
        ...scr,
        panels: scr.panels.map((p) => {
          const idx = p.components.findIndex((c) => c.id === id);
          if (idx === -1) return p;
          const comps = [...p.components];
          if (direction === 'up' && idx > 0) {
            [comps[idx - 1], comps[idx]] = [comps[idx], comps[idx - 1]];
          } else if (direction === 'down' && idx < comps.length - 1) {
            [comps[idx + 1], comps[idx]] = [comps[idx], comps[idx + 1]];
          }
          return { ...p, components: comps };
        }),
      };
    });

    set({ screens: newScreens });
  },

  undo: () => {
    const { history, future, screens } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({
      screens: previous,
      history: history.slice(0, -1),
      future: [screens, ...future],
    });
  },

  redo: () => {
    const { history, future, screens } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      screens: next,
      history: [...history, screens],
      future: future.slice(1),
    });
  },
}));
