// [advice from AI] 시나리오 생성 모드 선택 모달 컴포넌트입니다.
import { useScenarioStore } from '../store/useScenarioStore'

export function ScenarioCreateModeSelector() {
  const { activeModal, closeModal, openModal } = useScenarioStore()

  if (activeModal !== 'scenario-create-mode') return null

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
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>시나리오 생성 방식 선택</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
              어떤 방식으로 시나리오를 생성하시겠습니까?
            </p>
          </div>
          <button className="icon-button" onClick={closeModal}>
            ✕
          </button>
        </div>

        {/* [advice from AI] 모달 바디 */}
        <div className="modal-body">
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* 마법사 모드 */}
            <div
              onClick={() => {
                closeModal()
                openModal('scenario-create', {})
              }}
              style={{
                padding: '24px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: '#fff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#5a6bfa'
                e.currentTarget.style.background = '#f0f4ff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0'
                e.currentTarget.style.background = '#fff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0,
                  }}
                >
                  🧙‍♂️
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>마법사 모드 (추천)</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '12px' }}>
                    단계별 가이드를 따라 쉽고 빠르게 시나리오를 생성합니다. 초보자에게 적합합니다.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: '#eef1ff',
                        color: '#3944bc',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '6px',
                      }}
                    >
                      ✓ 4단계 가이드
                    </span>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: '#eef1ff',
                        color: '#3944bc',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '6px',
                      }}
                    >
                      ✓ 템플릿 선택
                    </span>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: '#eef1ff',
                        color: '#3944bc',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '6px',
                      }}
                    >
                      ✓ 간편 구성
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 플로우 에디터 모드 */}
            <div
              onClick={() => {
                closeModal()
                openModal('scenario-flow-editor', {})
              }}
              style={{
                padding: '24px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: '#fff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#10b981'
                e.currentTarget.style.background = '#f0fdf4'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0'
                e.currentTarget.style.background = '#fff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0,
                  }}
                >
                  🎨
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                    플로우 에디터 모드 (고급)
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '12px' }}>
                    비주얼 캔버스에서 워크플로우를 직접 배치하고 연결합니다. 세밀한 제어가 가능합니다.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: '#d1fae5',
                        color: '#065f46',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '6px',
                      }}
                    >
                      ✓ 드래그앤드롭
                    </span>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: '#d1fae5',
                        color: '#065f46',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '6px',
                      }}
                    >
                      ✓ 비주얼 연결
                    </span>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: '#d1fae5',
                        color: '#065f46',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '6px',
                      }}
                    >
                      ✓ 조건 분기
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 비교표 */}
          <div style={{ marginTop: '24px', padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>기능 비교</h4>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#6b7280' }}>기능</th>
                  <th style={{ textAlign: 'center', padding: '8px', color: '#6b7280' }}>마법사</th>
                  <th style={{ textAlign: 'center', padding: '8px', color: '#6b7280' }}>에디터</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px' }}>난이도</td>
                  <td style={{ textAlign: 'center', padding: '8px', color: '#10b981' }}>★☆☆</td>
                  <td style={{ textAlign: 'center', padding: '8px', color: '#f59e0b' }}>★★★</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px' }}>생성 속도</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>빠름</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>보통</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px' }}>커스터마이징</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>제한적</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>자유로움</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>조건 분기</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>-</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* [advice from AI] 모달 푸터 */}
        <div className="modal-footer">
          <button className="secondary-button" onClick={closeModal}>
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

