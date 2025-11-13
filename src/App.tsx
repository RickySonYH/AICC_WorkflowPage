// [advice from AI] 메인 애플리케이션 컴포넌트입니다.
import './App.css'
import { useScenarioStore } from './store/useScenarioStore'
import type { TabKey } from './store/useScenarioStore'
import { DashboardTab } from './components/DashboardTab'
import { LibraryTab } from './components/LibraryTab'
import { BuilderTab } from './components/BuilderTab'
import { WorkflowDetailModal } from './components/WorkflowDetailModal'
import { CategoryManageModal } from './components/CategoryManageModal'
import { WorkflowCreateModal } from './components/WorkflowCreateModal'
import { WorkflowBuilder } from './components/WorkflowBuilder'
import { ScenarioCreateModal } from './components/ScenarioCreateModal'
import { ScenarioCreateModeSelector } from './components/ScenarioCreateModeSelector'
import { ScenarioFlowEditor } from './components/ScenarioFlowEditor'

const TAB_ITEMS: Array<{ id: TabKey; label: string }> = [
  { id: 'dashboard', label: '시나리오 대시보드' },
  { id: 'library', label: '워크플로우 라이브러리' },
  { id: 'builder', label: '시나리오 구성' },
]

function App() {
  const { activeTab, setTab } = useScenarioStore()

  return (
    <div className="page-container">
      <h1 className="page-title">AICC 플랫폼 - 대화 시나리오</h1>

      {/* [advice from AI] 탭 네비게이션 */}
      <nav className="tab-nav">
        {TAB_ITEMS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* [advice from AI] 탭 컨텐츠 */}
      <div className={`tab-content ${activeTab === 'dashboard' ? 'active' : ''}`}>
        <DashboardTab />
      </div>

      <div className={`tab-content ${activeTab === 'library' ? 'active' : ''}`}>
        <LibraryTab />
      </div>

      <div className={`tab-content ${activeTab === 'builder' ? 'active' : ''}`}>
        <BuilderTab />
      </div>

      {/* [advice from AI] 모달들 */}
      <WorkflowDetailModal />
      <CategoryManageModal />
      <WorkflowCreateModal />
      <WorkflowBuilder />
      <ScenarioCreateModeSelector />
      <ScenarioCreateModal />
      <ScenarioFlowEditor />
    </div>
  )
}

export default App
