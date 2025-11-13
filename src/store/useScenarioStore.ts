// [advice from AI] 탭 전환, 모달, 선택 상태 등을 통합 관리하기 위해 Zustand를 사용합니다.
import { create } from 'zustand'
import type { WorkflowDetail } from '../data/mockData'

// [advice from AI] 탭 키 타입을 명시적으로 export합니다.
export type TabKey = 'dashboard' | 'library' | 'builder'

// [advice from AI] 모달 타입 정의
export type ModalType = 
  | 'workflow-detail' 
  | 'category-manage' 
  | 'workflow-create'
  | 'workflow-builder'
  | 'scenario-create'
  | 'scenario-create-mode'
  | 'scenario-flow-editor'
  | 'template-apply'
  | null

interface ScenarioState {
  // [advice from AI] 탭 상태
  activeTab: TabKey
  setTab: (tab: TabKey) => void

  // [advice from AI] 모달 상태
  activeModal: ModalType
  modalData: any
  openModal: (modal: ModalType, data?: any) => void
  closeModal: () => void

  // [advice from AI] 선택된 워크플로우
  selectedWorkflow: WorkflowDetail | null
  setSelectedWorkflow: (workflow: WorkflowDetail | null) => void

  // [advice from AI] 라이브러리 필터 상태
  libraryFilters: {
    category: string
    stage: string
    search: string
    status: string
  }
  setLibraryFilters: (filters: Partial<ScenarioState['libraryFilters']>) => void
  resetLibraryFilters: () => void

  // [advice from AI] 캔버스 편집 상태
  canvasBlocks: Record<string, string[]> // laneId -> blockNames[]
  addBlockToLane: (laneId: string, blockName: string) => void
  removeBlockFromLane: (laneId: string, blockName: string) => void
  moveBlock: (fromLane: string, toLane: string, blockName: string) => void
  clearCanvas: () => void

  // [advice from AI] 빌더 자산 패널 필터
  builderAssetFilter: string
  setBuilderAssetFilter: (filter: string) => void
}

// [advice from AI] 전역 시나리오 상태 스토어를 생성합니다.
export const useScenarioStore = create<ScenarioState>((set) => ({
  activeTab: 'dashboard',
  setTab: (tab) => set({ activeTab: tab }),

  activeModal: null,
  modalData: null,
  openModal: (modal, data) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  selectedWorkflow: null,
  setSelectedWorkflow: (workflow) => set({ selectedWorkflow: workflow }),

  libraryFilters: {
    category: '전체',
    stage: '전체',
    search: '',
    status: '전체',
  },
  setLibraryFilters: (filters) => 
    set((state) => ({
      libraryFilters: { ...state.libraryFilters, ...filters },
    })),
  resetLibraryFilters: () =>
    set({
      libraryFilters: {
        category: '전체',
        stage: '전체',
        search: '',
        status: '전체',
      },
    }),

  canvasBlocks: {
    'lane-1': ['초기 인사', '채널 식별'],
    'lane-2': ['고객 정보 확인'],
    'lane-3': ['용건 파악'],
    'lane-4': [],
    'lane-5': ['만족도 조사', '종료 멘트'],
  },
  addBlockToLane: (laneId, blockName) =>
    set((state) => ({
      canvasBlocks: {
        ...state.canvasBlocks,
        [laneId]: [...(state.canvasBlocks[laneId] || []), blockName],
      },
    })),
  removeBlockFromLane: (laneId, blockName) =>
    set((state) => ({
      canvasBlocks: {
        ...state.canvasBlocks,
        [laneId]: state.canvasBlocks[laneId].filter((b) => b !== blockName),
      },
    })),
  moveBlock: (fromLane, toLane, blockName) =>
    set((state) => ({
      canvasBlocks: {
        ...state.canvasBlocks,
        [fromLane]: state.canvasBlocks[fromLane].filter((b) => b !== blockName),
        [toLane]: [...(state.canvasBlocks[toLane] || []), blockName],
      },
    })),
  clearCanvas: () =>
    set({
      canvasBlocks: {
        'lane-1': [],
        'lane-2': [],
        'lane-3': [],
        'lane-4': [],
        'lane-5': [],
      },
    }),

  builderAssetFilter: '공통',
  setBuilderAssetFilter: (filter) => set({ builderAssetFilter: filter }),
}))

