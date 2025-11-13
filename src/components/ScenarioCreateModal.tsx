// [advice from AI] 시나리오 생성 마법사 모달 컴포넌트입니다.
import { useState } from 'react'
import { useScenarioStore } from '../store/useScenarioStore'
import { templateRecommendations, workflowLibrary } from '../data/mockData'

type Step = 1 | 2 | 3 | 4

export function ScenarioCreateModal() {
  const { activeModal, closeModal, setTab } = useScenarioStore()
  const [step, setStep] = useState<Step>(1)
  const [scenarioName, setScenarioName] = useState<string>('')
  const [scenarioDesc, setScenarioDesc] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([])

  if (activeModal !== 'scenario-create') return null

  // [advice from AI] 워크플로우 선택/해제 토글
  const toggleWorkflow = (workflowId: string) => {
    setSelectedWorkflows((prev) =>
      prev.includes(workflowId) ? prev.filter((id) => id !== workflowId) : [...prev, workflowId]
    )
  }

  // [advice from AI] 생성 완료 처리
  const handleCreate = () => {
    alert(
      `시나리오가 생성되었습니다!\n이름: ${scenarioName}\n카테고리: ${selectedCategory}\n템플릿: ${selectedTemplate || '빈 캔버스'}\n워크플로우: ${selectedWorkflows.length}개`
    )
    closeModal()
    setTab('builder')
  }

  // [advice from AI] 선택 가능한 워크플로우 필터링
  const availableWorkflows = workflowLibrary.filter((wf) => {
    if (selectedCategory && wf.category !== selectedCategory) return false
    return true
  })

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal()
      }}
    >
      <div className="modal-container" style={{ maxWidth: '800px' }}>
        {/* [advice from AI] 모달 헤더 */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>새 시나리오 생성</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Step {step} of 4</p>
          </div>
          <button className="icon-button" onClick={closeModal}>
            ✕
          </button>
        </div>

        {/* [advice from AI] 진행 표시 */}
        <div style={{ padding: '0 32px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  background: step >= s ? '#5a6bfa' : '#e2e8f0',
                  borderRadius: '999px',
                }}
              />
            ))}
          </div>
        </div>

        {/* [advice from AI] 모달 바디 */}
        <div className="modal-body" style={{ maxHeight: '60vh' }}>
          {/* 1단계: 기본 정보 */}
          {step === 1 && (
            <div className="detail-section">
              <h3 className="detail-section-title">1단계: 기본 정보</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    시나리오 이름 *
                  </label>
                  <input
                    type="text"
                    placeholder="예: 기본 고객센터 응대 시나리오"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d5d9e3',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    설명
                  </label>
                  <textarea
                    placeholder="이 시나리오에 대한 설명을 입력하세요"
                    value={scenarioDesc}
                    onChange={(e) => setScenarioDesc(e.target.value)}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d5d9e3',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    카테고리 *
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['공통', '이커머스', '금융'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: `2px solid ${selectedCategory === cat ? '#5a6bfa' : '#d5d9e3'}`,
                          borderRadius: '8px',
                          background: selectedCategory === cat ? '#eef1ff' : '#fff',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.2s',
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2단계: 템플릿 선택 */}
          {step === 2 && (
            <div className="detail-section">
              <h3 className="detail-section-title">2단계: 템플릿 선택</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                템플릿을 사용하면 미리 정의된 워크플로우 조합으로 빠르게 시작할 수 있습니다.
              </p>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div
                  onClick={() => setSelectedTemplate('')}
                  style={{
                    padding: '16px 20px',
                    border: `2px solid ${selectedTemplate === '' ? '#5a6bfa' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: selectedTemplate === '' ? '#eef1ff' : '#fff',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>빈 캔버스로 시작</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>처음부터 직접 시나리오를 설계합니다</div>
                </div>

                {templateRecommendations.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.name)}
                    style={{
                      padding: '16px 20px',
                      border: `2px solid ${selectedTemplate === template.name ? '#5a6bfa' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      background: selectedTemplate === template.name ? '#eef1ff' : '#fff',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{template.name}</div>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{template.description}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      포함 워크플로우: {template.workflows.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3단계: 워크플로우 선택 */}
          {step === 3 && (
            <div className="detail-section">
              <h3 className="detail-section-title">3단계: 워크플로우 선택</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                시나리오에 포함할 워크플로우를 선택하세요. {selectedWorkflows.length}개 선택됨
              </p>
              <div style={{ display: 'grid', gap: '8px', maxHeight: '400px', overflowY: 'auto', padding: '4px' }}>
                {availableWorkflows.map((wf) => (
                  <div
                    key={wf.id}
                    onClick={() => toggleWorkflow(wf.id)}
                    style={{
                      padding: '12px 16px',
                      border: `2px solid ${selectedWorkflows.includes(wf.id) ? '#5a6bfa' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: selectedWorkflows.includes(wf.id) ? '#eef1ff' : '#fff',
                      transition: 'all 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{wf.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {wf.category} • {wf.stage}
                      </div>
                    </div>
                    {selectedWorkflows.includes(wf.id) && (
                      <span style={{ color: '#5a6bfa', fontWeight: 'bold' }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4단계: 확인 및 완료 */}
          {step === 4 && (
            <div className="detail-section">
              <h3 className="detail-section-title">4단계: 확인</h3>
              <div
                style={{
                  padding: '24px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>시나리오 이름</div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{scenarioName}</div>
                  </div>
                  {scenarioDesc && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>설명</div>
                      <div style={{ fontSize: '14px' }}>{scenarioDesc}</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>카테고리</div>
                    <div style={{ fontSize: '14px' }}>{selectedCategory}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>템플릿</div>
                    <div style={{ fontSize: '14px' }}>{selectedTemplate || '빈 캔버스'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                      선택된 워크플로우 ({selectedWorkflows.length}개)
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedWorkflows.map((id) => {
                        const wf = workflowLibrary.find((w) => w.id === id)
                        return wf ? (
                          <span
                            key={id}
                            style={{
                              padding: '6px 12px',
                              background: '#eef1ff',
                              color: '#3944bc',
                              fontSize: '12px',
                              fontWeight: 600,
                              borderRadius: '6px',
                            }}
                          >
                            {wf.name}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* [advice from AI] 모달 푸터 */}
        <div className="modal-footer">
          <button
            className="secondary-button"
            onClick={() => {
              if (step === 1) {
                closeModal()
              } else {
                setStep((s) => (s - 1) as Step)
              }
            }}
          >
            {step === 1 ? '취소' : '이전'}
          </button>
          <button
            className="primary-button"
            disabled={
              (step === 1 && (!scenarioName || !selectedCategory)) ||
              (step === 3 && selectedWorkflows.length === 0)
            }
            onClick={() => {
              if (step === 4) {
                handleCreate()
              } else {
                setStep((s) => (s + 1) as Step)
              }
            }}
          >
            {step === 4 ? '생성 완료' : '다음'}
          </button>
        </div>
      </div>
    </div>
  )
}

