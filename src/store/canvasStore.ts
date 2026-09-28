import { create } from 'zustand';
import { ComponentItem, Screen, ViewportMode } from '../types/builder';
import { INITIAL_SCREENS } from '../utils/defaultTemplates';

interface CanvasStore {
  screens: Screen[];
  activeScreenId: string;
  selectedComponentId: string | null;
  viewportMode: ViewportMode;
  isPreviewMode: boolean;
  history: Screen[][];
  future: Screen[][];

  // Actions
  setViewportMode: (mode: ViewportMode) => void;
  togglePreviewMode: () => void;
  setActiveScreen: (screenId: string) => void;
  addScreen: (name: string) => void;
  deleteScreen: (screenId: string) => void;
  selectComponent: (id: string | null) => void;
  
  addComponent: (component: Omit<ComponentItem, 'id'>, targetIndex?: number) => void;
  updateComponent: (id: string, updates: Partial<ComponentItem>) => void;
  deleteComponent: (id: string) => void;
  moveComponent: (id: string, direction: 'up' | 'down') => void;
  
  undo: () => void;
  redo: () => void;
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  screens: INITIAL_SCREENS,
  activeScreenId: INITIAL_SCREENS[0].id,
  selectedComponentId: INITIAL_SCREENS[0].components[0].id,
  viewportMode: 'mobile',
  isPreviewMode: false,
  history: [],
  future: [],

  setViewportMode: (mode) => set({ viewportMode: mode }),
  
  togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),

  setActiveScreen: (screenId) => {
    const screen = get().screens.find((s) => s.id === screenId);
    set({
      activeScreenId: screenId,
      selectedComponentId: screen && screen.components.length > 0 ? screen.components[0].id : null,
    });
  },

  addScreen: (name) => {
    const newId = `screen-${Date.now()}`;
    const newScreen: Screen = {
      id: newId,
      name,
      components: [
        {
          id: `comp-header-${Date.now()}`,
          type: 'header',
          name: '헤더 바',
          label: name,
          styles: { backgroundColor: '#0f172a', textColor: '#ffffff', padding: '16px', fontWeight: 'bold' },
        },
      ],
    };
    set((state) => ({
      history: [...state.history, state.screens],
      future: [],
      screens: [...state.screens, newScreen],
      activeScreenId: newId,
      selectedComponentId: newScreen.components[0].id,
    }));
  },

  deleteScreen: (screenId) => {
    const { screens, activeScreenId } = get();
    if (screens.length <= 1) return;
    const filtered = screens.filter((s) => s.id !== screenId);
    set({
      screens: filtered,
      activeScreenId: activeScreenId === screenId ? filtered[0].id : activeScreenId,
      selectedComponentId: filtered[0].components[0]?.id || null,
    });
  },

  selectComponent: (id) => set({ selectedComponentId: id }),

  addComponent: (componentData, targetIndex) => {
    const { screens, activeScreenId, history } = get();
    const newComponent: ComponentItem = {
      ...componentData,
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    };

    const newScreens = screens.map((scr) => {
      if (scr.id !== activeScreenId) return scr;
      const comps = [...scr.components];
      if (typeof targetIndex === 'number' && targetIndex >= 0) {
        comps.splice(targetIndex, 0, newComponent);
      } else {
        comps.push(newComponent);
      }
      return { ...scr, components: comps };
    });

    set({
      history: [...history, screens],
      future: [],
      screens: newScreens,
      selectedComponentId: newComponent.id,
    });
  },

  updateComponent: (id, updates) => {
    const { screens, activeScreenId } = get();
    const newScreens = screens.map((scr) => {
      if (scr.id !== activeScreenId) return scr;
      return {
        ...scr,
        components: scr.components.map((comp) => {
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
        components: scr.components.filter((comp) => comp.id !== id),
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
    const targetScreen = screens.find((s) => s.id === activeScreenId);
    if (!targetScreen) return;

    const comps = [...targetScreen.components];
    const index = comps.findIndex((c) => c.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = comps[index - 1];
      comps[index - 1] = comps[index];
      comps[index] = temp;
    } else if (direction === 'down' && index < comps.length - 1) {
      const temp = comps[index + 1];
      comps[index + 1] = comps[index];
      comps[index] = temp;
    }

    const newScreens = screens.map((s) => (s.id === activeScreenId ? { ...s, components: comps } : s));
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
