import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@kimgseok/design-button/web';
import '@kimgseok/design-tokens/css';
import '../specimen.css';

function App() {
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    return () => { document.documentElement.dataset.theme = 'light'; };
  }, [dark]);
  return <div data-theme={dark ? 'dark' : 'light'}><main>
    <header><div><p className="eyebrow">BUTTON / WEB</p><h1>읽기 쉽고, 행동이 분명한 인터페이스</h1><p className="body">실제 Button 컴포넌트의 상태와 한국어 레이블을 확인합니다.</p></div><Button aria-pressed={dark} onAction={() => setDark(!dark)} variant="tertiary">{dark ? '라이트 모드' : '다크 모드'}</Button></header>
    <section><h2>Action states</h2><div className="actions"><Button onAction={async () => { setLoading(true); setResult(''); await new Promise((resolve) => setTimeout(resolve, 500)); setLoading(false); setResult('변경사항을 저장했어요.'); }} loading={loading}>저장하기</Button><Button variant="secondary">나중에 하기</Button><Button variant="tertiary">자세히 보기</Button><Button variant="danger">삭제하기</Button><Button disabled>저장하기</Button></div><p aria-live="polite">{result}</p></section>
  </main></div>;
}
createRoot(document.getElementById('root')!).render(<App />);
