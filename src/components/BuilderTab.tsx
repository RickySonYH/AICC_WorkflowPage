// [advice from AI] 시나리오 구성 탭 컴포넌트입니다.
import { useState } from 'react'
import { templateRecommendations, scenarioList, workflowLibrary, type Scenario } from '../data/mockData'
import { useScenarioStore } from '../store/useScenarioStore'

export function BuilderTab() {
  const { openModal } = useScenarioStore()
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('전체')
  const [filterStatus, setFilterStatus] = useState<string>('전체')

  // 필터링된 시나리오 목록
  const filteredScenarios = scenarioList.filter((scenario) => {
    if (filterCategory !== '전체' && scenario.category !== filterCategory) return false
    if (filterStatus !== '전체' && scenario.status !== filterStatus) return false
    return true
  })

  return (
    <div className="builder-layout">
      {/* [advice from AI] 왼쪽 템플릿 패널 */}
      <div className="builder-panel">
        <div className="panel-title">템플릿 추천</div>
        <div style={{ display: 'grid', gap: '12px' }}>
          {templateRecommendations.map((template) => (
            <div
              key={template.id}
              className="template-item"
              onClick={() => {
                if (confirm(`"${template.name}" 템플릿을 적용하시겠습니까?`)) {
                  openModal('scenario-create', { template: template.name })
                }
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{template.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{template.description}</div>
            </div>
          ))}
        </div>
        <button
          className="button button-primary button-full"
          style={{ marginTop: '16px' }}
          onClick={() => openModal('scenario-create-mode', {})}
        >
          + 새 에이전트 생성
        </button>
      </div>

      {/* [advice from AI] 중앙 에이전트 리스트 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>에이전트 목록</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d5d9e3',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              <option>전체</option>
              <option>공통</option>
              <option>이커머스</option>
              <option>금융</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d5d9e3',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              <option>전체</option>
              <option value="active">활성화</option>
              <option value="draft">초안</option>
              <option value="inactive">비활성화</option>
            </select>
            <button
              className="button button-primary"
              onClick={() => openModal('scenario-create-mode', {})}
            >
              + 새 에이전트
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '12px', color: '#6b7280', fontSize: '14px' }}>
          {filteredScenarios.length}개의 에이전트
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            display: 'grid',
            gap: '16px',
            alignContent: 'start',
          }}
        >
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="workflow-card"
              onClick={() => setSelectedScenario(scenario)}
              style={{
                cursor: 'pointer',
                border: selectedScenario?.id === scenario.id ? '2px solid #5a6bfa' : '1px solid #d0d0d0',
                background: selectedScenario?.id === scenario.id ? '#eef1ff' : '#fff',
              }}
            >
              <div className="workflow-header">
                <div>
                  <div className="workflow-name">{scenario.name}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                    {scenario.description}
                  </div>
                </div>
              </div>
              <div className="workflow-tags">
                <span className="tag">{scenario.category}</span>
                <span
                  className="tag"
                  style={{
                    background: scenario.status === 'active' ? '#10b981' : scenario.status === 'draft' ? '#f59e0b' : '#ef4444',
                    color: '#fff',
                    border: 'none',
                  }}
                >
                  {scenario.status === 'active' ? '활성화' : scenario.status === 'draft' ? '초안' : '비활성화'}
                </span>
                <span className="tag">{scenario.workflows.length}개 워크플로우</span>
              </div>
              <div className="workflow-meta">
                <div>생성: {scenario.createdAt}</div>
                <div>사용: {scenario.usageCount.toLocaleString()}회</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* [advice from AI] 오른쪽 시나리오 상세 정보 패널 */}
      <div className="builder-panel">
        {selectedScenario ? (
          <>
            <div className="panel-title">{selectedScenario.name}</div>

            {/* 기본 정보 */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>
                기본 정보
              </h4>
              <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>카테고리:</span>
                  <span style={{ fontWeight: 500 }}>{selectedScenario.category}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>상태:</span>
                  <span style={{ fontWeight: 500 }}>
                    {selectedScenario.status === 'active' ? '활성화' : selectedScenario.status === 'draft' ? '초안' : '비활성화'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>생성일:</span>
                  <span style={{ fontWeight: 500 }}>{selectedScenario.createdAt}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>수정일:</span>
                  <span style={{ fontWeight: 500 }}>{selectedScenario.updatedAt}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>사용 횟수:</span>
                  <span style={{ fontWeight: 500 }}>{selectedScenario.usageCount.toLocaleString()}회</span>
                </div>
              </div>
            </div>

            {/* 전화번호 매칭 */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>
                📞 전화번호 매칭
              </h4>
              {selectedScenario.phoneNumbers.length > 0 ? (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {selectedScenario.phoneNumbers.map((phone, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: '#10b981' }}>●</span>
                      {phone}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', fontSize: '13px', color: '#92400e' }}>
                  매칭된 전화번호가 없습니다
                </div>
              )}
            </div>

            {/* 테넌트 정보 */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>
                🏢 테넌트 정보
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {selectedScenario.tenants.map((tenant, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      background: '#eef2ff',
                      border: '1px solid #c7d2fe',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#3730a3',
                    }}
                  >
                    {tenant}
                  </div>
                ))}
              </div>
            </div>

            {/* 포함된 워크플로우 */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>
                🔗 포함된 워크플로우 ({selectedScenario.workflows.length}개)
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {selectedScenario.workflows.map((wfId, idx) => {
                  const workflow = workflowLibrary.find((w) => w.id === wfId)
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                        {idx + 1}. {workflow?.name || wfId}
                      </div>
                      {workflow && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {workflow.category} · {workflow.stage}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div style={{ display: 'grid', gap: '8px' }}>
              <button
                className="button button-primary button-full"
                onClick={() => openModal('scenario-flow-editor', selectedScenario)}
              >
                플로우 에디터에서 편집
              </button>
              <button
                className="button button-full"
                onClick={() => {
                  if (confirm('이 시나리오를 복제하시겠습니까?')) {
                    alert('시나리오가 복제되었습니다!')
                  }
                }}
              >
                시나리오 복제
              </button>
              <button
                className="button button-full"
                style={{ background: '#fff', color: '#ef4444', borderColor: '#ef4444' }}
                onClick={() => {
                  if (confirm('이 시나리오를 삭제하시겠습니까?')) {
                    alert('시나리오가 삭제되었습니다!')
                    setSelectedScenario(null)
                  }
                }}
              >
                시나리오 삭제
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>시나리오를 선택하세요</div>
            <div style={{ fontSize: '13px', marginTop: '8px' }}>
              좌측 목록에서 시나리오를 클릭하면
              <br />
              상세 정보가 표시됩니다
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
