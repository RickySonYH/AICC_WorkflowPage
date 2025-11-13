// [advice from AI] 워크플로우 라이브러리 탭 컴포넌트입니다.
import { useState } from 'react'
import { libraryCategoryTree, workflowLibrary } from '../data/mockData'
import { useScenarioStore } from '../store/useScenarioStore'

export function LibraryTab() {
  const { openModal, libraryFilters, setLibraryFilters } = useScenarioStore()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['공통', '이커머스', '금융']))

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

  // [advice from AI] 필터링된 워크플로우 계산
  const filteredWorkflows = workflowLibrary.filter((wf) => {
    // 카테고리 필터: 부모 카테고리(공통, 이커머스, 금융) 또는 자식 카테고리(시작, 인증 등)로 필터링
    if (libraryFilters.category !== '전체') {
      // 부모 카테고리인지 확인 (공통, 이커머스, 금융, 고객관리)
      const isParentCategory = libraryCategoryTree.some(tree => tree.parent === libraryFilters.category)
      
      if (isParentCategory) {
        // 부모 카테고리면 category 필드로 필터링
        if (wf.category !== libraryFilters.category) return false
      } else {
        // 자식 카테고리면 다중 조건으로 필터링
        // 1. stage가 일치하거나 (공통 카테고리의 경우)
        // 2. 워크플로우 이름에 자식 카테고리 이름이 포함되거나 (이커머스/금융의 경우)
        // 3. intent에 자식 카테고리가 포함되는 경우
        const matchByStage = wf.stage === libraryFilters.category
        const matchByName = wf.name.toLowerCase().includes(libraryFilters.category.toLowerCase())
        const matchByIntent = wf.intent?.some(i => i.toLowerCase().includes(libraryFilters.category.toLowerCase()))
        
        if (!matchByStage && !matchByName && !matchByIntent) {
          return false
        }
      }
    }
    
    if (libraryFilters.stage !== '전체' && wf.stage !== libraryFilters.stage) return false
    if (libraryFilters.status !== '전체') {
      const statusMap: Record<string, string> = { 활성화: 'active', 초안: 'draft', 비활성화: 'inactive' }
      if (wf.status !== statusMap[libraryFilters.status]) return false
    }
    if (libraryFilters.search && !wf.name.toLowerCase().includes(libraryFilters.search.toLowerCase())) return false
    return true
  })

  return (
    <div className="library-layout">
      {/* [advice from AI] 왼쪽 카테고리 트리 */}
      <div className="sidebar">
        <div className="sidebar-title">카테고리</div>
        <div className="category-tree">
          <div
            className={`category-parent ${libraryFilters.category === '전체' ? 'active' : ''}`}
            onClick={() => setLibraryFilters({ category: '전체' })}
          >
            전체 ({workflowLibrary.length})
          </div>
          {libraryCategoryTree.map((group) => (
            <div key={group.parent}>
              <div 
                className={`category-parent ${libraryFilters.category === group.parent ? 'active' : ''}`}
                onClick={() => {
                  setLibraryFilters({ category: group.parent })
                  toggleCategory(group.parent)
                }}
              >
                {expandedCategories.has(group.parent) ? '▼' : '▶'} {group.parent}
              </div>
              {expandedCategories.has(group.parent) && (
                <div className="category-children">
                  {group.children.map((child) => (
                    <div
                      key={child.name}
                      className={`category-child ${libraryFilters.category === child.name ? 'active' : ''}`}
                      onClick={() => setLibraryFilters({ category: child.name })}
                    >
                      {child.name} ({child.count})
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* [advice from AI] 오른쪽 워크플로우 그리드 */}
      <div style={{ flex: 1 }}>
        <div className="toolbar">
          <div className="filter-group">
            <label>고객 여정 단계</label>
            <select
              value={libraryFilters.stage}
              onChange={(e) => setLibraryFilters({ stage: e.target.value })}
              style={{
                padding: '8px 12px',
                border: '1px solid #d5d9e3',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              <option>전체</option>
              <option>시작</option>
              <option>인증</option>
              <option>인텐트 분류</option>
              <option>업무 처리</option>
              <option>종료</option>
            </select>
          </div>

          <div className="filter-group">
            <label>상태</label>
            <select
              value={libraryFilters.status}
              onChange={(e) => setLibraryFilters({ status: e.target.value })}
              style={{
                padding: '8px 12px',
                border: '1px solid #d5d9e3',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              <option>전체</option>
              <option>활성화</option>
              <option>초안</option>
              <option>비활성화</option>
            </select>
          </div>

          <div className="filter-group" style={{ flex: 1 }}>
            <label>검색</label>
            <input
              type="text"
              placeholder="워크플로우 이름 검색..."
              value={libraryFilters.search}
              onChange={(e) => setLibraryFilters({ search: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d5d9e3',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          <button
            className="button button-primary"
            onClick={() => openModal('workflow-create', {})}
            style={{ alignSelf: 'flex-end' }}
          >
            + 새 워크플로우
          </button>
        </div>

        <div style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
          {filteredWorkflows.length}개의 워크플로우
        </div>

        <div className="workflow-grid">
          {filteredWorkflows.map((wf) => (
            <div
              key={wf.id}
              className="workflow-card"
              onClick={() => openModal('workflow-builder', wf)}
              style={{ cursor: 'pointer' }}
            >
              <div className="workflow-header">
                <div className="workflow-name">{wf.name}</div>
                <div className="workflow-id">{wf.id}</div>
              </div>
              <div className="workflow-tags">
                <span className="tag">{wf.category}</span>
                <span className="tag">{wf.stage}</span>
                <span className="tag">{wf.status === 'active' ? '활성화' : wf.status === 'draft' ? '초안' : '비활성화'}</span>
              </div>
              <div className="workflow-meta">
                <div>생성: {wf.createdAt}</div>
                <div>사용: {wf.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

