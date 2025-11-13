// [advice from AI] 워크플로우(블록) 생성 마법사 모달 컴포넌트입니다.
import { useState } from 'react'
import { useScenarioStore } from '../store/useScenarioStore'
import { libraryCategoryTree } from '../data/mockData'

type Step = 1 | 2 | 3 | 4

export function WorkflowCreateModal() {
  const { activeModal, closeModal, openModal } = useScenarioStore()
  const [step, setStep] = useState<Step>(1)
  const [workflowName, setWorkflowName] = useState<string>('')
  const [workflowDesc, setWorkflowDesc] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedStage, setSelectedStage] = useState<string>('')
  const [nodeType, setNodeType] = useState<string>('')

  if (activeModal !== 'workflow-create') return null

  // [advice from AI] 생성 완료 처리 - 워크플로우 빌더 열기
  const handleCreate = () => {
    // 새 워크플로우 데이터 생성
    const newWorkflow = {
      id: `wf-new-${Date.now()}`,
      name: workflowName,
      description: workflowDesc,
      category: selectedCategory.split(' - ')[0], // "공통 - 시작" -> "공통"
      stage: selectedStage,
      createdAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      updatedAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      usage: '신규',
      usageCount: 0,
      intent: ['전체'],
      status: 'draft',
      nodes: [
        { id: 'node-start', type: 'start', label: '시작' },
        { 
          id: 'node-1', 
          type: nodeType === '메시지' ? 'message' : nodeType === '질문' ? 'question' : nodeType === '조건 분기' ? 'condition' : 'api',
          label: nodeType,
          config: {}
        },
        { id: 'node-end', type: 'end', label: '종료' },
      ],
      edges: [
        { from: 'node-start', to: 'node-1' },
        { from: 'node-1', to: 'node-end' },
      ],
      settings: { timeout: 30, retry: 3, fallback: '상담원 연결' },
      logs: [
        { timestamp: new Date().toLocaleString('ko-KR'), event: '워크플로우 생성', user: '사용자' },
      ],
    }

    // 현재 모달 닫고 워크플로우 빌더 열기
    closeModal()
    openModal('workflow-builder', newWorkflow)
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal()
      }}
    >
      <div className="modal-container" style={{ maxWidth: '700px' }}>
        {/* [advice from AI] 모달 헤더 */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>새 워크플로우 생성</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
              Step {step} of 4 - 개별 블록 단위 생성
            </p>
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
                    워크플로우 이름 *
                  </label>
                  <input
                    type="text"
                    placeholder="예: 주문 취소 처리"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
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
                    placeholder="이 워크플로우에 대한 설명을 입력하세요"
                    value={workflowDesc}
                    onChange={(e) => setWorkflowDesc(e.target.value)}
                    rows={3}
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
              </div>
            </div>
          )}

          {/* 2단계: 카테고리 선택 */}
          {step === 2 && (
            <div className="detail-section">
              <h3 className="detail-section-title">2단계: 카테고리 선택</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {libraryCategoryTree.map((group) => (
                  <div key={group.parent}>
                    <div
                      style={{
                        padding: '12px 16px',
                        background: '#f9fafb',
                        borderRadius: '12px',
                        fontWeight: 600,
                        marginBottom: '8px',
                      }}
                    >
                      {group.parent}
                    </div>
                    <div style={{ display: 'grid', gap: '8px', marginLeft: '16px' }}>
                      {group.children.map((child) => (
                        <div
                          key={child.name}
                          onClick={() => setSelectedCategory(`${group.parent} - ${child.name}`)}
                          style={{
                            padding: '12px 16px',
                            border: `2px solid ${
                              selectedCategory === `${group.parent} - ${child.name}` ? '#5a6bfa' : '#e2e8f0'
                            }`,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            background: selectedCategory === `${group.parent} - ${child.name}` ? '#eef1ff' : '#fff',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{child.name}</span>
                            <span style={{ color: '#6b7280', fontSize: '13px' }}>{child.count}개</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3단계: 고객 여정 단계 선택 */}
          {step === 3 && (
            <div className="detail-section">
              <h3 className="detail-section-title">3단계: 고객 여정 단계 선택</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {['시작', '인증', '인텐트 분류', '업무 처리', '종료'].map((stage) => (
                  <div
                    key={stage}
                    onClick={() => setSelectedStage(stage)}
                    style={{
                      padding: '16px 20px',
                      border: `2px solid ${selectedStage === stage ? '#5a6bfa' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      background: selectedStage === stage ? '#eef1ff' : '#fff',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{stage}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>고객 여정의 {stage} 단계 워크플로우</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4단계: 노드 유형 선택 */}
          {step === 4 && (
            <div className="detail-section">
              <h3 className="detail-section-title">4단계: 노드 유형 선택</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                이 워크플로우의 주요 노드 유형을 선택하세요
              </p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { type: 'message', label: '메시지', desc: '고객에게 텍스트 메시지를 전달합니다', color: '#3b82f6' },
                  { type: 'question', label: '질문', desc: '고객에게 질문하고 답변을 받습니다', color: '#8b5cf6' },
                  {
                    type: 'condition',
                    label: '조건 분기',
                    desc: '조건에 따라 다른 경로로 분기합니다',
                    color: '#f59e0b',
                  },
                  { type: 'api', label: 'API 호출', desc: '외부 API를 호출하여 데이터를 가져옵니다', color: '#06b6d4' },
                ].map((node) => (
                  <div
                    key={node.type}
                    onClick={() => setNodeType(node.label)}
                    style={{
                      padding: '16px 20px',
                      border: `2px solid ${nodeType === node.label ? node.color : '#e2e8f0'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      background: nodeType === node.label ? `${node.color}10` : '#fff',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: node.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '18px',
                        }}
                      >
                        {node.label[0]}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '16px' }}>{node.label}</div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginLeft: '44px' }}>{node.desc}</div>
                  </div>
                ))}
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
              (step === 1 && !workflowName) ||
              (step === 2 && !selectedCategory) ||
              (step === 3 && !selectedStage) ||
              (step === 4 && !nodeType)
            }
            onClick={() => {
              if (step === 4) {
                handleCreate()
              } else {
                setStep((s) => (s + 1) as Step)
              }
            }}
          >
            {step === 4 ? '워크플로우 빌더에서 편집' : '다음'}
          </button>
        </div>
      </div>
    </div>
  )
}
