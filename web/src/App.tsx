import React, { useEffect, useState } from 'react'

type Node = {
  id: string
  title: string
  body?: string
  x: number
  y: number
}

type Edge = {
  from: string
  to: string
}

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [showKeyModal, setShowKeyModal] = useState(true)
  const [topic, setTopic] = useState('')
  const [template, setTemplate] = useState('Write a short document about {{topic}} with 3 bullet points.')
  const [model, setModel] = useState('gpt-4o-mini')
  const [orgId, setOrgId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [maxTokens, setMaxTokens] = useState<number>(200)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const k = sessionStorage.getItem('ai_api_key')
    if (k) {
      setApiKey(k)
      setShowKeyModal(false)
    }
    const saved = localStorage.getItem('ai_mindmap')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setNodes(parsed.nodes || [])
        setEdges(parsed.edges || [])
      } catch (e) {
        console.warn('failed to parse saved map')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ai_mindmap', JSON.stringify({ nodes, edges }))
  }, [nodes, edges])

  function saveApiKey() {
  const k = (apiKey || '').trim()
  if (!k) return alert('유효한 API 키를 입력하세요')
  sessionStorage.setItem('ai_api_key', k)
  setApiKey(k)
  setShowKeyModal(false)
  }

  function addNode(title: string, body?: string) {
    const id = Math.random().toString(36).slice(2, 9)
    const newNode: Node = { id, title, body, x: 200 + nodes.length * 30, y: 100 + nodes.length * 30 }
    setNodes((s) => [...s, newNode])
    return newNode
  }

  async function generate() {
    if (!topic) return alert('주제를 입력하세요')
    const prompt = template.replace('{{topic}}', topic)
    // demo mode: if no apiKey, generate fake nodes
    if (!apiKey) {
      const root = addNode(topic, 'Root topic')
      const a = addNode(topic + ' - A', 'Detail A')
      const b = addNode(topic + ' - B', 'Detail B')
      setEdges((s) => [...s, { from: root.id, to: a.id }, { from: root.id, to: b.id }])
      return
    }

    try {
      setLoading(true)
      console.log('AI 요청 프롬프트:', prompt)
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      }
      if (orgId) headers['OpenAI-Organization'] = orgId.trim()
      if (projectId) headers['OpenAI-Project'] = projectId.trim()

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
        }),
      })

      if (!res.ok) {
        let message = ''
        try {
          const errJson = await res.json()
          message = errJson?.error?.message || JSON.stringify(errJson)
        } catch (_) {
          message = await res.text()
        }
        console.error('AI 응답 에러:', res.status, message)
        if (res.status === 429 && /quota/i.test(message)) {
          alert(`AI 호출 실패 (429: Quota exceeded).\n- OpenAI Billing에서 결제 수단 및 크레딧을 설정하세요.\n- 사용 중인 조직/프로젝트에 크레딧이 있는지 확인하세요.\n- 필요하면 아래의 Organization/Project 값을 지정해보세요.\n상세: ${message}`)
        } else {
          alert(`AI 호출 실패 (${res.status}). 상세: ${message}`)
        }
        return
      }
      const data = await res.json()
      console.log('AI 응답:', data)
      const text = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || ''
      // simple split by lines for demo
      const lines = text.split('\n').filter(Boolean)
      const root = addNode(topic, lines[0] || topic)
      const childNodes = lines.slice(1, 5).map((l) => addNode(l.trim()))
      setEdges((s) => [...s, ...childNodes.map((c) => ({ from: root.id, to: c.id }))])
    } catch (e) {
      console.error(e)
      const msg = e instanceof Error ? e.message : '알 수 없는 오류'
      alert(`AI 호출 실패: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  function exportJson() {
    const data = JSON.stringify({ nodes, edges }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mindmap.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJson(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        setNodes(parsed.nodes || [])
        setEdges(parsed.edges || [])
      } catch (e) {
        alert('파일 파싱 실패')
      }
    }
    reader.readAsText(file)
  }

  function openKeyModalForChange() {
    // clear any saved key in session and force the modal to appear so user can input/change key
    sessionStorage.removeItem('ai_api_key')
    setApiKey(null)
    setShowKeyModal(true)
  }

  return (
    <div className="app">
      {showKeyModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>API 키 입력</h3>
            <input value={apiKey ?? ''} onChange={(e) => setApiKey(e.target.value)} placeholder="OpenAI API Key" />
            <div className="modal-actions">
              <button onClick={saveApiKey}>저장(세션)</button>
              <button onClick={() => setShowKeyModal(false)}>데모로 계속</button>
            </div>
            <p className="warning">이 앱은 키를 서버에 저장하지 않습니다. 공개적으로 사용하실 때는 주의하세요.</p>
          </div>
        </div>
      )}

      <header>
        <h1>AI MindMap (클라이언트 전용 데모)</h1>
        <div style={{ float: 'right' }}>
          <button onClick={openKeyModalForChange}>API 키 변경</button>
        </div>
      </header>

      {/* API 키가 없을 때 상단에 눈에 띄는 안내 배너 표시 */}
      {!apiKey && !showKeyModal && (
        <div className="banner">
          <div>현재 API 키가 설정되어 있지 않습니다. 데모 모드로 동작합니다.</div>
          <div>
            <button onClick={() => setShowKeyModal(true)}>API 키 입력</button>
          </div>
        </div>
      )}

      <main>
        <section className="controls">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="주제를 입력하세요 (예: AActor)" />
          <textarea value={template} onChange={(e) => setTemplate(e.target.value)} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label>모델:</label>
            <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-4o-mini" style={{ width: 200 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label>Organization:</label>
            <input value={orgId} onChange={(e) => setOrgId(e.target.value)} placeholder="org_... (선택)" style={{ width: 220 }} />
            <label>Project:</label>
            <input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="proj_... (선택)" style={{ width: 220 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label>max_tokens:</label>
            <input type="number" min={32} max={1000} step={10} value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} style={{ width: 120 }} />
          </div>
          <div className="actions">
            <button onClick={generate} disabled={loading}>{loading ? '생성중...' : '생성'}</button>
            <button onClick={exportJson}>내보내기</button>
            <input type="file" onChange={(e) => importJson(e.target.files?.[0] ?? null)} />
          </div>
        </section>

        <section className="canvas">
          <svg width="800" height="600">
            {edges.map((edge, i) => {
              const from = nodes.find((n) => n.id === edge.from)
              const to = nodes.find((n) => n.id === edge.to)
              if (!from || !to) return null
              return (
                <line
                  key={i}
                  x1={from.x + 50}
                  y1={from.y + 20}
                  x2={to.x + 50}
                  y2={to.y + 20}
                  stroke="#666"
                />
              )
            })}

            {nodes.map((n) => (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`} onClick={() => setSelectedNode(n)} style={{ cursor: 'pointer' }}>
                <rect width={120} height={40} fill="#fff" stroke="#333" rx={6} ry={6} />
                <text x={10} y={22}>{n.title}</text>
              </g>
            ))}

            {/* 노드가 없는 경우 안내 표시 */}
            {nodes.length === 0 && (
              <g>
                <rect x={50} y={50} width={700} height={500} fill="#fff" stroke="#ccc" />
                <text x={400} y={300} textAnchor="middle" style={{ fill: '#888', fontSize: 18 }}>
                  주제를 입력하고 '생성'을 눌러 마인드맵을 시작하세요
                </text>
              </g>
            )}
          </svg>

          <aside className="side">
            <h3>선택된 노드</h3>
            {selectedNode ? (
              <div>
                <h4>{selectedNode.title}</h4>
                <p>{selectedNode.body}</p>
                <button onClick={() => {
                  // AI 생성: 간단히 add more
                  const newN = addNode(selectedNode.title + ' 더', '추가 정보')
                  setEdges((s) => [...s, { from: selectedNode.id, to: newN.id }])
                }}>AI생성</button>
              </div>
            ) : (
              <p>노드를 선택하세요</p>
            )}
          </aside>
        </section>
      </main>
    </div>
  )
}
