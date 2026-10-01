import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PALETTE_ITEMS, PaletteCategory, PaletteItemDef } from '../components/palette/paletteData';

interface PaletteStore {
  orderedTitles: string[];
  selectedPaletteTitle: string | null;
  selectPaletteItem: (title: string | null) => void;
  reorderItems: (sourceTitle: string, targetTitle: string) => void;
  resetOrder: () => void;
  getOrderedItems: (category: PaletteCategory) => PaletteItemDef[];
}

export const usePaletteStore = create<PaletteStore>()(
  persist(
    (set, get) => ({
      orderedTitles: PALETTE_ITEMS.map((item) => item.title),
      selectedPaletteTitle: null,

      selectPaletteItem: (title) => set({ selectedPaletteTitle: title }),

      reorderItems: (sourceTitle: string, targetTitle: string) => {
        if (sourceTitle === targetTitle) return;

        const currentOrdered = get().getOrderedItems('all').map((item) => item.title);
        const sourceIndex = currentOrdered.indexOf(sourceTitle);
        const targetIndex = currentOrdered.indexOf(targetTitle);

        if (sourceIndex === -1 || targetIndex === -1) return;

        const newTitles = [...currentOrdered];
        const [moved] = newTitles.splice(sourceIndex, 1);
        newTitles.splice(targetIndex, 0, moved);

        set({ orderedTitles: newTitles });
      },

      resetOrder: () => {
        set({ orderedTitles: PALETTE_ITEMS.map((item) => item.title) });
      },

      getOrderedItems: (category: PaletteCategory) => {
        const { orderedTitles } = get();

        // 1. 전체 아이템을 orderedTitles 순서로 정렬
        const sorted = [...PALETTE_ITEMS].sort((a, b) => {
          const indexA = orderedTitles.indexOf(a.title);
          const indexB = orderedTitles.indexOf(b.title);
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        // 2. 카테고리 필터링
        if (category === 'all') return sorted;
        return sorted.filter((item) => item.category === category);
      },
    }),
    {
      name: 'palette-items-order',
    }
  )
);
