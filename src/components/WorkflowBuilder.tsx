// [advice from AI] 워크플로우 내부 노드 빌더 컴포넌트입니다.
import { useState, useRef } from 'react'
import { useScenarioStore } from '../store/useScenarioStore'
import type { WorkflowDetail } from '../data/mockData'

interface WorkflowNode {
  id: string
  type: 'start' | 'ai-answer' | 'state-change' | 'end'
  label: string
  position: { x: number; y: number }
  config?: Record<string, any>
}

interface WorkflowConnection {
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

export function WorkflowBuilder() {
  const { activeModal, modalData, closeModal } = useScenarioStore()
  const workflow: WorkflowDetail | null = modalData
  const canvasRef = useRef<HTMLDivElement>(null)

  // [advice from AI] 워크플로우 데이터에서 노드 생성 (없으면 기본 노드 생성)
  const getInitialNodes = (): WorkflowNode[] => {
    if (!workflow?.nodes || workflow.nodes.length === 0) {
      // 기본 노드 구조 생성
      return [
        {
          id: 'node-start',
          type: 'start',
          label: '시작',
          position: { x: 100, y: 200 },
        },
        {
          id: 'node-1',
          type: 'ai-answer',
          label: 'AI 답변',
          position: { x: 400, y: 200 },
          config: { prompt: '안녕하세요. 무엇을 도와드릴까요?' },
        },
        {
          id: 'node-end',
          type: 'end',
          label: '종료',
          position: { x: 700, y: 200 },
          config: { action: '대화 종료' },
        },
      ]
    }

    // 워크플로우 데이터의 노드를 WorkflowNode 형식으로 변환
    return workflow.nodes.map((node, index) => {
      const nodeTypeMap: Record<string, WorkflowNode['type']> = {
        start: 'start',
        message: 'ai-answer',
        question: 'ai-answer',
        condition: 'state-change',
        api: 'state-change',
        end: 'end',
      }

      return {
        id: node.id,
        type: nodeTypeMap[node.type] || 'ai-answer',
        label: node.label,
        position: { x: 100 + index * 300, y: 200 },
        config: node.config,
      }
    })
  }

  // [advice from AI] 워크플로우 데이터에서 연결 생성
  const getInitialConnections = (): WorkflowConnection[] => {
    if (!workflow?.edges || workflow.edges.length === 0) {
      // 기본 연결 생성
      return [
        { from: 'node-start', to: 'node-1' },
        { from: 'node-1', to: 'node-end' },
      ]
    }

    return workflow.edges.map((edge) => ({
      from: edge.from,
      to: edge.to,
      label: edge.condition,
    }))
  }

  const [nodes, setNodes] = useState<WorkflowNode[]>(getInitialNodes())
  const [connections, setConnections] = useState<WorkflowConnection[]>(getInitialConnections())

  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showNodePicker, setShowNodePicker] = useState<boolean>(false)
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
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [editingLabel, setEditingLabel] = useState<string>('')

  if (activeModal !== 'workflow-builder') return null

  // [advice from AI] 노드 추가
  const addNode = (type: WorkflowNode['type']) => {
    const labels: Record<WorkflowNode['type'], string> = {
      start: '시작',
      'ai-answer': 'AI 답변',
      'state-change': '상태 변경',
      end: '종료',
    }

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      label: labels[type],
      position: { x: 400, y: 200 + nodes.length * 50 },
      config: type === 'ai-answer' ? { prompt: '새 프롬프트' } : type === 'end' ? { action: '워크플로우 전환' } : undefined,
    }
    setNodes([...nodes, newNode])
    setShowNodePicker(false)
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
    if ((e.target as HTMLElement).closest('input')) return
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
      setNodes(
        nodes.map((n) => (n.id === dragState.nodeId ? { ...n, position: { x: newX, y: newY } } : n))
      )
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
    const fromY = nodePos.y + 60 // 노드 중간 높이
    
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
      const newConnection: WorkflowConnection = {
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

  // [advice from AI] 라벨 편집 시작
  const startEditLabel = (e: React.MouseEvent, nodeId: string, currentLabel: string) => {
    e.stopPropagation()
    setEditingNode(nodeId)
    setEditingLabel(currentLabel)
  }

  // [advice from AI] 라벨 저장
  const saveLabel = (nodeId: string) => {
    setNodes(nodes.map((n) => (n.id === nodeId ? { ...n, label: editingLabel } : n)))
    setEditingNode(null)
  }

  // [advice from AI] 저장
  const handleSave = () => {
    alert(
      `워크플로우가 저장되었습니다!\n이름: ${workflow?.name || '새 워크플로우'}\n노드: ${nodes.length}개\n연결: ${connections.length}개`
    )
    closeModal()
  }

  // [advice from AI] 노드 타입별 색상
  const getNodeColor = (type: WorkflowNode['type']): string => {
    const colors = {
      start: '#10b981',
      'ai-answer': '#06b6d4',
      'state-change': '#10b981',
      end: '#ef4444',
    }
    return colors[type]
  }

  // [advice from AI] 노드 타입별 라벨
  const getNodeTypeLabel = (type: WorkflowNode['type']): string => {
    const labels = {
      start: 'START',
      'ai-answer': 'AI 답변',
      'state-change': '상태 변경',
      end: 'END',
    }
    return labels[type]
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
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>{workflow?.name || '새 워크플로우'}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>워크플로우 빌더 - 내부 노드 설계</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              className="secondary-button"
              onClick={() => setShowNodePicker(!showNodePicker)}
              style={{ background: '#fff', color: '#10b981', borderColor: '#10b981' }}
            >
              + 노드 추가
            </button>
            <button className="secondary-button">미리보기</button>
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
              background: '#fafafa',
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
                  'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
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
              {/* 기존 연결선 */}
              {connections.map((conn, idx) => {
                const fromNode = nodes.find((n) => n.id === conn.from)
                const toNode = nodes.find((n) => n.id === conn.to)
                if (!fromNode || !toNode) return null

                const x1 = fromNode.position.x + 140
                const y1 = fromNode.position.y + 60
                const x2 = toNode.position.x
                const y2 = toNode.position.y + 60

                const midX = (x1 + x2) / 2
                const midY = (y1 + y2) / 2

                // [advice from AI] 점선 연결 (전환/메인)
                const isDashed = conn.label !== undefined

                return (
                  <g key={idx}>
                    <path
                      d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${y1}, ${midX} ${midY} T ${x2} ${y2}`}
                      stroke={isDashed ? '#06b6d4' : '#9ca3af'}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={isDashed ? '5,5' : '0'}
                    />
                    <circle cx={x2} cy={y2} r="4" fill={isDashed ? '#06b6d4' : '#9ca3af'} />
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
                  background: '#ffffff',
                  border: `3px solid ${selectedNode === node.id ? '#5a6bfa' : getNodeColor(node.type)}`,
                  borderRadius: '12px',
                  boxShadow: selectedNode === node.id ? '0 8px 20px rgba(90,107,250,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: dragState.isDragging && dragState.nodeId === node.id ? 'grabbing' : 'grab',
                  zIndex: selectedNode === node.id || dragState.nodeId === node.id ? 10 : 2,
                  transition: dragState.isDragging && dragState.nodeId === node.id ? 'none' : 'all 0.2s',
                  userSelect: 'none',
                }}
              >
                {/* 노드 헤더 */}
                <div
                  style={{
                    padding: '12px 16px',
                    background: `${getNodeColor(node.type)}15`,
                    borderBottom: `1px solid ${getNodeColor(node.type)}30`,
                    borderRadius: '9px 9px 0 0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: getNodeColor(node.type),
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {getNodeTypeLabel(node.type)}
                    </span>
                    <div style={{ flex: 1 }} />
                    {node.type !== 'start' && node.type !== 'end' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
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
                      </>
                    )}
                  </div>
                </div>

                {/* 노드 바디 */}
                <div style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '12px', lineHeight: 1.4 }}>
                    {node.label}
                  </div>

                  {/* 노드 타입별 내용 */}
                  {node.type === 'ai-answer' && node.config && (
                    <div style={{ marginTop: '12px' }}>
                      <div
                        style={{
                          background: '#f9fafb',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', fontWeight: 600 }}>
                          Attribute
                        </div>
                        <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ color: '#6b7280' }}>프롬프트</span>
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#06b6d4',
                            fontWeight: 600,
                            background: '#ecfeff',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            marginTop: '6px',
                          }}
                        >
                          {node.config.prompt}
                        </div>
                      </div>
                    </div>
                  )}

                  {node.type === 'end' && node.config && (
                    <div style={{ marginTop: '12px' }}>
                      <span
                        style={{
                          padding: '6px 12px',
                          background: '#fef2f2',
                          color: '#dc2626',
                          fontSize: '12px',
                          fontWeight: 600,
                          borderRadius: '6px',
                          display: 'inline-block',
                        }}
                      >
                        {node.config.action}
                      </span>
                    </div>
                  )}
                </div>

                {/* 좌측 연결점 (입력) */}
                <div
                  onMouseDown={(e) => handleConnectEnd(e, node.id)}
                  style={{
                    position: 'absolute',
                    left: '-8px',
                    top: '60px',
                    width: '16px',
                    height: '16px',
                    background: '#3b82f6',
                    border: '3px solid #fff',
                    borderRadius: '50%',
                    cursor: 'crosshair',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
                    top: '60px',
                    width: '16px',
                    height: '16px',
                    background: getNodeColor(node.type),
                    border: '3px solid #fff',
                    borderRadius: '50%',
                    cursor: 'crosshair',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    pointerEvents: 'auto',
                    zIndex: 100,
                  }}
                />
              </div>
            ))}
            </div>
            {/* 캔버스 작업 영역 닫기 */}
          </div>

          {/* 노드 선택 사이드바 */}
          {showNodePicker && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '300px',
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
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>노드 추가</h3>
                  <button
                    onClick={() => setShowNodePicker(false)}
                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {[
                    { type: 'ai-answer' as const, icon: '🤖', label: 'AI 답변', desc: '프롬프트 기반 AI 응답' },
                    { type: 'state-change' as const, icon: '🔄', label: '상태 변경', desc: '워크플로우 전환' },
                  ].map((nodeType) => (
                    <div
                      key={nodeType.type}
                      onClick={() => addNode(nodeType.type)}
                      style={{
                        padding: '14px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
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
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{nodeType.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{nodeType.label}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>{nodeType.desc}</div>
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
                  선택됨: {nodes.find((n) => n.id === selectedNode)?.label}
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

