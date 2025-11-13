// [advice from AI] 카테고리 관리 모달 컴포넌트입니다.
import { useScenarioStore } from '../store/useScenarioStore'

export function CategoryManageModal() {
  const { activeModal, modalData, closeModal } = useScenarioStore()

  if (activeModal !== 'category-manage' || !modalData) return null

  const category = modalData

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal()
      }}
    >
      <div className="modal-container" style={{ maxWidth: '600px' }}>
        {/* [advice from AI] 모달 헤더 */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>{category.name}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
              {category.countLabel}
            </p>
          </div>
          <button className="icon-button" onClick={closeModal}>
            ✕
          </button>
        </div>

        {/* [advice from AI] 모달 바디 */}
        <div className="modal-body">
          <div className="detail-section">
            <h3 className="detail-section-title">카테고리 정보</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                  카테고리 이름
                </label>
                <input
                  type="text"
                  defaultValue={category.name}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #d5d9e3',
                    borderRadius: '12px',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                  설명
                </label>
                <textarea
                  placeholder="카테고리 설명을 입력하세요"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #d5d9e3',
                    borderRadius: '12px',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">연결된 워크플로우</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {['워크플로우 1', '워크플로우 2', '워크플로우 3'].map((wf, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                  }}
                >
                  <input type="checkbox" defaultChecked />
                  <span style={{ flex: 1 }}>{wf}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">위험 영역</h3>
            <button
              className="secondary-button"
              style={{
                color: '#ef4444',
                borderColor: '#ef4444',
                width: '100%',
              }}
              onClick={() => {
                if (confirm(`"${category.name}" 카테고리를 삭제하시겠습니까?`)) {
                  alert('카테고리가 삭제되었습니다.')
                  closeModal()
                }
              }}
            >
              카테고리 삭제
            </button>
          </div>
        </div>

        {/* [advice from AI] 모달 푸터 */}
        <div className="modal-footer">
          <button className="secondary-button" onClick={closeModal}>
            취소
          </button>
          <button
            className="primary-button"
            onClick={() => {
              alert('변경사항이 저장되었습니다.')
              closeModal()
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}

