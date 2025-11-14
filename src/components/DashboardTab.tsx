// [advice from AI] 대시보드 탭 컴포넌트입니다.
import { useState } from 'react'
import { libraryCategoryTree, workflowStats, scenarioStats } from '../data/mockData'
import { useScenarioStore } from '../store/useScenarioStore'

export function DashboardTab() {
  const { openModal } = useScenarioStore()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['공통', '이커머스', '금융', '고객관리', 'MCP', 'API'])
  )

  // [advice from AI] 카테고리 확장/축소 토글
  const toggleCategory = (parent: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(parent)) {
        next.delete(parent)
      } else {
        next.add(parent)
      }
      return next
    })
  }

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

      {/* [advice from AI] 에이전트 개요 */}
      <section style={{ marginTop: '40px' }}>
        <h2 className="section-title">에이전트 개요</h2>
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
        
        {/* [advice from AI] 트리 구조 카테고리 */}
        <div className="category-tree-container">
          {libraryCategoryTree.map((tree) => (
            <div key={tree.parent} className="category-tree-item">
              {/* 부모 카테고리 */}
              <div
                className="category-parent-row"
                onClick={() => toggleCategory(tree.parent)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  fontWeight: 600,
                }}
              >
                <span style={{ marginRight: '8px', fontSize: '14px' }}>
                  {expandedCategories.has(tree.parent) ? '▼' : '▶'}
                </span>
                <span style={{ flex: 1 }}>{tree.parent}</span>
                <span
                  className="badge"
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                >
                  {tree.children.reduce((sum, child) => sum + child.count, 0)}
                </span>
                <button
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    openModal('category-manage', { name: tree.parent })
                  }}
                  style={{
                    marginLeft: '8px',
                    padding: '4px 8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  title="정보"
                >
                  ℹ️
                </button>
                <button
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    alert(`${tree.parent} 카테고리에 하위 항목 추가`)
                  }}
                  style={{
                    marginLeft: '4px',
                    padding: '4px 8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  title="추가"
                >
                  ➕
                </button>
                <button
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    alert(`${tree.parent} 카테고리 편집`)
                  }}
                  style={{
                    marginLeft: '4px',
                    padding: '4px 8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  title="편집"
                >
                  ✏️
                </button>
                <button
                  className="icon-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`${tree.parent} 카테고리를 삭제하시겠습니까?`)) {
                      alert('삭제되었습니다')
                    }
                  }}
                  style={{
                    marginLeft: '4px',
                    padding: '4px 8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ef4444',
                  }}
                  title="삭제"
                >
                  🗑️
                </button>
              </div>

              {/* 자식 카테고리 */}
              {expandedCategories.has(tree.parent) && (
                <div style={{ paddingLeft: '32px' }}>
                  {tree.children.map((child) => (
                    <div
                      key={child.name}
                      className="category-child-row"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 16px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        marginBottom: '6px',
                        cursor: 'pointer',
                      }}
                      onClick={() => openModal('category-manage', { name: `${tree.parent} - ${child.name}`, count: child.count })}
                    >
                      <span style={{ flex: 1, fontSize: '14px' }}>{child.name}</span>
                      <span
                        className="badge"
                        style={{
                          background: child.count > 0 ? '#10b981' : '#94a3b8',
                          color: 'white',
                          padding: '2px 10px',
                          borderRadius: '10px',
                          fontSize: '12px',
                        }}
                      >
                        {child.count}
                      </span>
                      <button
                        className="icon-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          openModal('category-manage', { name: `${tree.parent} - ${child.name}`, count: child.count })
                        }}
                        style={{
                          marginLeft: '8px',
                          padding: '4px 8px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        title="정보"
                      >
                        ℹ️
                      </button>
                      <button
                        className="icon-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`${child.name} 편집`)
                        }}
                        style={{
                          marginLeft: '4px',
                          padding: '4px 8px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        title="편집"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(`${child.name} 항목을 삭제하시겠습니까?`)) {
                            alert('삭제되었습니다')
                          }
                        }}
                        style={{
                          marginLeft: '4px',
                          padding: '4px 8px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ef4444',
                        }}
                        title="삭제"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

