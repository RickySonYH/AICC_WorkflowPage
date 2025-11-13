// [advice from AI] 워크플로우 상세 정보를 표시하는 모달 컴포넌트입니다.
import { useScenarioStore } from '../store/useScenarioStore'
import type { WorkflowDetail } from '../data/mockData'

export function WorkflowDetailModal() {
  const { activeModal, modalData, closeModal, openModal } = useScenarioStore()

  if (activeModal !== 'workflow-detail' || !modalData) return null

  const workflow: WorkflowDetail = modalData

  // [advice from AI] 워크플로우 빌더에서 편집
  const handleOpenInBuilder = () => {
    closeModal()
    openModal('workflow-builder', workflow)
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal()
      }}
    >
      <div className="modal-container">
        {/* [advice from AI] 모달 헤더 */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
              {workflow.name}
            </h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Tag label={workflow.category} />
              <Tag label={workflow.stage} />
              <Tag label={workflow.status === 'active' ? '활성화' : workflow.status === 'draft' ? '초안' : '비활성화'} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="secondary-button" onClick={handleOpenInBuilder}>
              편집
            </button>
            <button className="icon-button" onClick={closeModal}>
              ✕
            </button>
          </div>
        </div>

        {/* [advice from AI] 모달 바디 - 탭 구조 */}
        <div className="modal-body">
          <div className="detail-tabs">
            <button className="detail-tab active">개요</button>
            <button className="detail-tab">노드 구조</button>
            <button className="detail-tab">설정</button>
            <button className="detail-tab">로그</button>
          </div>

          {/* [advice from AI] 개요 탭 내용 */}
          <div className="detail-content">
            <div className="detail-section">
              <h3 className="detail-section-title">설명</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.8 }}>{workflow.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div className="detail-section">
                <h3 className="detail-section-title">생성 정보</h3>
                <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                  <div>생성일: {workflow.createdAt}</div>
                  <div>수정일: {workflow.updatedAt}</div>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="detail-section-title">사용 통계</h3>
                <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                  <div>사용 빈도: {workflow.usage}</div>
                  <div>실행 횟수: {workflow.usageCount}회</div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="detail-section-title">연결된 인텐트</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {workflow.intent.map((intent) => (
                  <Tag key={intent} label={intent} />
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3 className="detail-section-title">노드 구성</h3>
              <div className="node-list">
                {workflow.nodes.map((node) => (
                  <div key={node.id} className="node-item">
                    <div
                      className="node-type-badge"
                      style={{
                        background: getNodeTypeColor(node.type),
                      }}
                    >
                      {getNodeTypeLabel(node.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{node.label}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>ID: {node.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* [advice from AI] 모달 푸터 */}
        <div className="modal-footer">
          <button className="secondary-button" onClick={closeModal}>
            닫기
          </button>
          <button className="primary-button" onClick={handleOpenInBuilder}>
            편집 시작
          </button>
        </div>
      </div>
    </div>
  )
}

// [advice from AI] 태그 컴포넌트
function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: '6px 12px',
        borderRadius: '999px',
        background: '#eef1ff',
        color: '#3944bc',
        fontSize: '12px',
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  )
}

// [advice from AI] 노드 타입별 색상
function getNodeTypeColor(type: string): string {
  const colors: Record<string, string> = {
    start: '#10b981',
    end: '#ef4444',
    message: '#3b82f6',
    question: '#8b5cf6',
    condition: '#f59e0b',
    api: '#06b6d4',
  }
  return colors[type] || '#6b7280'
}

// [advice from AI] 노드 타입별 레이블
function getNodeTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    start: '시작',
    end: '종료',
    message: '메시지',
    question: '질문',
    condition: '조건',
    api: 'API',
  }
  return labels[type] || type
}

