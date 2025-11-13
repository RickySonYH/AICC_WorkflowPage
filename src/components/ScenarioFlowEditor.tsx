// [advice from AI] 시나리오 플로우 에디터 모달 컴포넌트입니다.
import { useState, useRef } from 'react'
import { useScenarioStore } from '../store/useScenarioStore'
import { workflowLibrary } from '../data/mockData'

interface FlowNode {
  id: string
  workflowId: string
  workflowName: string
  type: 'start' | 'workflow' | 'end'
  position: { x: number; y: number }
  color: string
}

interface FlowConnection {
  from: string
  to: string
  label?: string
}

interface DragState {
  isDragging: boolean
  nodeId: string | null
  startPos: { x: number; y: number }
  offset: { x: number; y: number }
}

interface ConnectingState {
  isConnecting: boolean
  fromNode: string | null
  fromPos: { x: number; y: number }
  currentPos: { x: number; y: number }
}

export function ScenarioFlowEditor() {
  const { activeModal, closeModal } = useScenarioStore()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [scenarioName, setScenarioName] = useState<string>('ECS이커머스 반품 안내 상담 시나리오')
  const [nodes, setNodes] = useState<FlowNode[]>([
    {
      id: 'node-start',
      workflowId: 'start',
      workflowName: 'ECS이커머스 반품 안내 상담사',
      type: 'start',
      position: { x: 100, y: 200 },
      color: '#10b981',
    },
    {
      id: 'node-1',
      workflowId: 'wf-1',
      workflowName: 'ECS이커머스 반품 안내 엔드 수정',
      type: 'workflow',
      position: { x: 400, y: 100 },
      color: '#10b981',
    },
    {
      id: 'node-2',
      workflowId: 'wf-2',
      workflowName: 'ECS이커머스 반품 → 메인 엔드 수정',
      type: 'workflow',
      position: { x: 700, y: 300 },
      color: '#10b981',
    },
    {
      id: 'node-end',
      workflowId: 'end',
      workflowName: '메인 안내 그룹트 호출',
      type: 'end',
      position: { x: 1000, y: 200 },
      color: '#ef4444',
    },
  ])
  const [connections, setConnections] = useState<FlowConnection[]>([
    { from: 'node-start', to: 'node-1', label: '전환(loop)' },
    { from: 'node-start', to: 'node-2', label: '메인(main)' },
    { from: 'node-1', to: 'node-end' },
    { from: 'node-2', to: 'node-end' },
  ])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showWorkflowPicker, setShowWorkflowPicker] = useState<boolean>(false)
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    nodeId: null,
    startPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  })
  const [connectingState, setConnectingState] = useState<ConnectingState>({
    isConnecting: false,
    fromNode: null,
    fromPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
  })

  if (activeModal !== 'scenario-flow-editor') return null

  // [advice from AI] 워크플로우 추가
  const addWorkflow = (workflow: typeof workflowLibrary[0]) => {
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      workflowId: workflow.id,
      workflowName: workflow.name,
      type: 'workflow',
      position: { x: 400, y: 200 + nodes.length * 50 },
      color: '#3b82f6',
    }
    setNodes([...nodes, newNode])
    setShowWorkflowPicker(false)
  }

  // [advice from AI] 노드 삭제
  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter((n) => n.id !== nodeId))
    setConnections(connections.filter((c) => c.from !== nodeId && c.to !== nodeId))
    setSelectedNode(null)
  }

  // [advice from AI] 드래그 시작
  const handleMouseDown = (e: React.MouseEvent, nodeId: string, nodePos: { x: number; y: number }) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.stopPropagation()
    
    setDragState({
      isDragging: true,
      nodeId,
      startPos: { x: e.clientX, y: e.clientY },
      offset: { 
        x: e.clientX - nodePos.x, 
        y: e.clientY - nodePos.y 
      },
    })
  }

  // [advice from AI] 드래그 중
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragState.isDragging && dragState.nodeId) {
      const newX = e.clientX - dragState.offset.x
      const newY = e.clientY - dragState.offset.y
      setNodes(nodes.map((n) => (n.id === dragState.nodeId ? { ...n, position: { x: newX, y: newY } } : n)))
    }

    if (connectingState.isConnecting) {
      setConnectingState({
        ...connectingState,
        currentPos: { x: e.clientX, y: e.clientY },
      })
    }
  }

  // [advice from AI] 드래그 종료
  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      nodeId: null,
      startPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
    })

    if (connectingState.isConnecting) {
      setConnectingState({
        isConnecting: false,
        fromNode: null,
        fromPos: { x: 0, y: 0 },
        currentPos: { x: 0, y: 0 },
      })
    }
  }

  // [advice from AI] 연결 시작
  const handleConnectStart = (e: React.MouseEvent, nodeId: string, nodePos: { x: number; y: number }) => {
    e.stopPropagation()
    
    // 노드의 우측 연결점 절대 위치 계산
    const fromX = nodePos.x + 280 // 노드 우측 끝
    const fromY = nodePos.y + 50 // 노드 중간 높이
    
    setConnectingState({
      isConnecting: true,
      fromNode: nodeId,
      fromPos: { x: fromX, y: fromY },
      currentPos: { x: fromX, y: fromY },
    })
  }

  // [advice from AI] 연결 완료
  const handleConnectEnd = (e: React.MouseEvent, toNodeId: string) => {
    e.stopPropagation()
    if (connectingState.isConnecting && connectingState.fromNode && connectingState.fromNode !== toNodeId) {
      const newConnection: FlowConnection = {
        from: connectingState.fromNode,
        to: toNodeId,
      }
      setConnections([...connections, newConnection])
    }
    setConnectingState({
      isConnecting: false,
      fromNode: null,
      fromPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
    })
  }

  // [advice from AI] 저장
  const handleSave = () => {
    alert(`시나리오가 저장되었습니다!\n이름: ${scenarioName}\n노드: ${nodes.length}개\n연결: ${connections.length}개`)
    closeModal()
  }

  return (
    <div className="modal-overlay">
      <div
        className="modal-container"
        style={{
          maxWidth: '95vw',
          width: '1400px',
          maxHeight: '90vh',
        }}
      >
        {/* [advice from AI] 헤더 */}
        <div className="modal-header" style={{ borderBottom: '2px solid #e2e8f0' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              style={{
                fontSize: '20px',
                fontWeight: 600,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
              }}
            />
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>플로우 에디터 모드</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              className="secondary-button"
              onClick={() => setShowWorkflowPicker(!showWorkflowPicker)}
              style={{ background: '#fff', color: '#5a6bfa', borderColor: '#5a6bfa' }}
            >
              + 워크플로우 추가
            </button>
            <button className="primary-button" onClick={handleSave}>
              저장
            </button>
            <button className="icon-button" onClick={closeModal}>
              ✕
            </button>
          </div>
        </div>

        {/* [advice from AI] 에디터 영역 */}
        <div className="modal-body" style={{ padding: 0, height: '70vh', position: 'relative', overflow: 'hidden' }}>
          {/* 캔버스 */}
          <div
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              background: '#f9fafb',
              position: 'relative',
              overflow: 'auto',
              cursor: dragState.isDragging ? 'grabbing' : 'default',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* 캔버스 작업 영역 - 충분한 크기 확보 */}
            <div
              style={{
                position: 'relative',
                minWidth: '2000px',
                minHeight: '1500px',
                backgroundImage:
                  'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                opacity: 0.5,
              }}
            >

            {/* 연결선 */}
            <svg
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {connections.map((conn, idx) => {
                const fromNode = nodes.find((n) => n.id === conn.from)
                const toNode = nodes.find((n) => n.id === conn.to)
                if (!fromNode || !toNode) return null

                // 연결선 시작점 (from 노드 우측)
                const x1 = fromNode.position.x + 280
                const y1 = fromNode.position.y + 50
                // 연결선 종료점 (to 노드 좌측)
                const x2 = toNode.position.x
                const y2 = toNode.position.y + 50

                const midX = (x1 + x2) / 2
                const midY = (y1 + y2) / 2

                return (
                  <g key={idx}>
                    {/* 곡선 연결선 */}
                    <path
                      d={`M ${x1} ${y1} C ${x1 + 100} ${y1}, ${x2 - 100} ${y2}, ${x2} ${y2}`}
                      stroke={conn.label ? '#06b6d4' : '#9ca3af'}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={conn.label ? '5,5' : '0'}
                    />
                    {/* 화살표 */}
                    <circle cx={x2} cy={y2} r="4" fill={conn.label ? '#06b6d4' : '#9ca3af'} />
                    {/* 라벨 */}
                    {conn.label && (
                      <text
                        x={midX}
                        y={midY - 10}
                        fill="#6b7280"
                        fontSize="12"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {conn.label}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* 연결 중인 임시 선 */}
              {connectingState.isConnecting && (
                <line
                  x1={connectingState.fromPos.x}
                  y1={connectingState.fromPos.y}
                  x2={connectingState.currentPos.x}
                  y2={connectingState.currentPos.y}
                  stroke="#5a6bfa"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
              )}
            </svg>

            {/* 노드들 */}
            {nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                onMouseDown={(e) => handleMouseDown(e, node.id, node.position)}
                style={{
                  position: 'absolute',
                  left: node.position.x,
                  top: node.position.y,
                  width: '280px',
                  padding: '16px',
                  background: '#ffffff',
                  border: `3px solid ${selectedNode === node.id ? '#5a6bfa' : node.color}`,
                  borderRadius: '12px',
                  boxShadow: selectedNode === node.id ? '0 8px 20px rgba(90,107,250,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: dragState.isDragging && dragState.nodeId === node.id ? 'grabbing' : 'grab',
                  zIndex: selectedNode === node.id || dragState.nodeId === node.id ? 10 : 2,
                  transition: dragState.isDragging && dragState.nodeId === node.id ? 'none' : 'all 0.2s',
                  userSelect: 'none',
                }}
              >
                {/* 노드 헤더 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      background: node.color,
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: '6px',
                    }}
                  >
                    {node.type === 'start' ? 'START' : node.type === 'end' ? 'END' : '상태 변경'}
                  </span>
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // 설정 아이콘
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: '#9ca3af',
                    }}
                  >
                    ⚙
                  </button>
                  {node.type === 'workflow' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('이 노드를 삭제하시겠습니까?')) {
                          deleteNode(node.id)
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#ef4444',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* 노드 제목 */}
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px', lineHeight: 1.4 }}>
                  {node.workflowName}
                </div>

                {/* 노드 타입별 내용 */}
                {node.type === 'start' && (
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600 }}>AI 답변</span>
                    </div>
                    <div style={{ background: '#f9fafb', padding: '8px', borderRadius: '6px', marginTop: '8px' }}>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Attribute</div>
                      <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600 }}>프롬프트</div>
                    </div>
                  </div>
                )}

                {node.type === 'end' && (
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        background: '#fef2f2',
                        color: '#dc2626',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: '4px',
                      }}
                    >
                      워크플로우 전환
                    </span>
                  </div>
                )}

                {/* 연결점 (왼쪽/오른쪽) */}
                {/* 좌측 연결점 (입력) */}
                <div
                  onMouseDown={(e) => handleConnectEnd(e, node.id)}
                  style={{
                    position: 'absolute',
                    left: '-8px',
                    top: '50%',
                    width: '16px',
                    height: '16px',
                    background: '#3b82f6',
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'crosshair',
                    pointerEvents: 'auto',
                    zIndex: 100,
                  }}
                />
                {/* 우측 연결점 (출력) */}
                <div
                  onMouseDown={(e) => handleConnectStart(e, node.id, node.position)}
                  style={{
                    position: 'absolute',
                    right: '-8px',
                    top: '50%',
                    width: '16px',
                    height: '16px',
                    background: node.color,
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'crosshair',
                    pointerEvents: 'auto',
                    zIndex: 100,
                  }}
                />
              </div>
            ))}
            </div>
            {/* 캔버스 작업 영역 닫기 */}
          </div>

          {/* 워크플로우 선택 사이드바 */}
          {showWorkflowPicker && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '350px',
                height: '100%',
                background: '#fff',
                borderLeft: '2px solid #e2e8f0',
                overflowY: 'auto',
                zIndex: 20,
                boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ padding: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>워크플로우 선택</h3>
                  <button
                    onClick={() => setShowWorkflowPicker(false)}
                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="검색..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #d5d9e3',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '16px',
                  }}
                />
                <div style={{ display: 'grid', gap: '8px' }}>
                  {workflowLibrary.slice(0, 10).map((wf) => (
                    <div
                      key={wf.id}
                      onClick={() => addWorkflow(wf)}
                      style={{
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#5a6bfa'
                        e.currentTarget.style.background = '#eef1ff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0'
                        e.currentTarget.style.background = '#fff'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{wf.name}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>
                        {wf.category} • {wf.stage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* [advice from AI] 툴바 */}
        <div
          className="modal-footer"
          style={{
            justifyContent: 'space-between',
            background: '#f9fafb',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#6b7280' }}>
            <span>노드: {nodes.length}개</span>
            <span>•</span>
            <span>연결: {connections.length}개</span>
            {selectedNode && (
              <>
                <span>•</span>
                <span style={{ color: '#5a6bfa', fontWeight: 600 }}>
                  선택됨: {nodes.find((n) => n.id === selectedNode)?.workflowName}
                </span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="secondary-button" onClick={closeModal}>
              취소
            </button>
            <button className="primary-button" onClick={handleSave}>
              저장 후 닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

