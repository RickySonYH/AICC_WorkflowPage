// [advice from AI] 대시보드 탭 컴포넌트입니다.
import { categorySummary, workflowStats, scenarioStats } from '../data/mockData'
import { useScenarioStore } from '../store/useScenarioStore'

export function DashboardTab() {
  const { openModal } = useScenarioStore()

  return (
    <>
      {/* [advice from AI] 워크플로우 개요 */}
      <section>
        <h2 className="section-title">워크플로우 개요</h2>
        <div className="stats-container">
          {workflowStats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* [advice from AI] 시나리오 개요 */}
      <section style={{ marginTop: '40px' }}>
        <h2 className="section-title">시나리오 개요</h2>
        <div className="stats-container">
          {scenarioStats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            카테고리 관리
          </h2>
          <button
            className="button button-primary"
            onClick={() => openModal('category-manage', { name: '새 카테고리', countLabel: '0개' })}
          >
            + 새 카테고리 추가
          </button>
        </div>
        <div className="category-list">
          {categorySummary.map((cat) => (
            <div
              key={cat.name}
              className="category-item"
              style={{ cursor: 'pointer' }}
              onClick={() => openModal('category-manage', cat)}
            >
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.countLabel}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

