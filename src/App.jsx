import { useState, useEffect, useCallback } from 'react';
import { slides } from './slides';
import { d1Flashcards, d2Flashcards, d3Flashcards, d4Flashcards, d5Flashcards } from './flashcardsData';

const flashcardSets = { d1Flashcards, d2Flashcards, d3Flashcards, d4Flashcards, d5Flashcards };

// ===== TITLE SLIDE =====
function TitleSlide() {
  return (
    <div className="title-slide">
      <div className="title-logo animate-in">CC</div>
      <h1 className="title-main animate-in-delay-1">Claude Certification<br/>Preparations</h1>
      <p className="title-sub animate-in-delay-2">CCA-F — Claude Certified Architect: Foundations</p>
      <div className="title-credits animate-in-delay-4">
        Created by Abhijit Das 
        <br/>
        with contributions from Prayas Mohanty
      </div>
    </div>
  );
}

// ===== DISCLAIMER SLIDE =====
function DisclaimerSlide() {
  return (
    <>
      <div className="slide-header animate-in">
        <h2>Disclaimer</h2>
        <p className="subtitle">Important notes about these study materials</p>
      </div>
      <div className="slide-content">
        <div className="callout callout-warn animate-in-delay-1">
          The content in these slides is <strong>not a complete study guide</strong> for the CCA-F certification exam.
        </div>
        <div className="callout callout-key animate-in-delay-2">
          These pages contain <strong>important points, key tips, and common pitfalls</strong> carefully distilled from the exam domains — designed to act as a <strong>quick refresher</strong> before you sit the certification exam.
        </div>
        <div className="callout callout-tip animate-in-delay-3">
          <strong>For complete preparation:</strong> Please refer to the official Anthropic documentation, the full exam guide, and other comprehensive study materials.
        </div>
        <div className="callout callout-warn animate-in-delay-4" style={{marginTop: 20}}>
          <strong>Best used as a final review · not as a primary study resource</strong>
        </div>
      </div>
    </>
  );
}

// ===== EXAM INFO SLIDE =====
function ExamInfoSlide() {
  return (
    <>
      <div className="slide-header animate-in">
        <h2>Exam Information</h2>
        <p className="subtitle">Key facts about the CCA-F certification exam</p>
      </div>
      <div className="slide-content">
        <div className="exam-grid">
          {[
            { num: "60", label: "Multiple-choice questions" },
            { num: "120", label: "Minutes · Proctored" },
            { num: "720", label: "Score to pass (of 1000)" },
            { num: "$125", label: "Fee (waived for partners)" },
            { num: "12", label: "Months Validity" },
          ].map((s, i) => (
            <div key={i} className={`exam-stat animate-in-delay-${i+1}`}>
              <div className="number">{s.num}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="callout callout-key animate-in-delay-3" style={{marginTop: 16}}>
          <strong>Exam mechanics:</strong> One correct answer + three distractors each · no penalty for guessing — never leave a blank. Questions hand you a production symptom and ask for the <em>most effective</em> fix.
        </div>
        <div className="callout callout-tip animate-in-delay-4">
          <strong>Green-light rule:</strong> Score 900+ on the Practice Exam first — that's your go/no-go signal. If you don't pass, you can retake the exam after a short waiting period: 14 days after your first attempt, 30 days after your second, and 90 days after your third. You can take up to 4 attempts per exam in any rolling 12-month period.
        </div>
        <table className="slide-table animate-in-delay-4">
          <thead><tr><th>Domain</th><th>Weight</th><th>≈ Questions</th></tr></thead>
          <tbody>
            <tr><td>D1 · Agentic Architecture</td><td>27%</td><td>~16</td></tr>
            <tr><td>D2 · Tool Design & MCP</td><td>18%</td><td>~11</td></tr>
            <tr><td>D3 · Claude Code Config</td><td>20%</td><td>~12</td></tr>
            <tr><td>D4 · Prompt Engineering</td><td>20%</td><td>~12</td></tr>
            <tr><td>D5 · Context Management</td><td>15%</td><td>~9</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

// ===== TOC SLIDE =====
function TOCSlide({ goToSlide }) {
  const domains = [
    { id: 1, title: "Agentic Architecture & Orchestration", weight: "27%", color: "var(--d1)" },
    { id: 2, title: "Tool Design & MCP Integration", weight: "18%", color: "var(--d2)" },
    { id: 3, title: "Claude Code Configuration & Workflows", weight: "20%", color: "var(--d3)" },
    { id: 4, title: "Prompt Engineering & Structured Output", weight: "20%", color: "var(--d4)" },
    { id: 5, title: "Context Management & Reliability", weight: "15%", color: "var(--d5)" },
  ];

  const domainSlideIndices = [4, 15, 24, 33, 42];

  return (
    <>
      <div className="slide-header animate-in">
        <h2>Contents</h2>
        <p className="subtitle">Five domains covering 28 task statements</p>
      </div>
      <div className="slide-content" style={{justifyContent: 'center'}}>
        <ul className="toc-list">
          {domains.map((d, i) => (
            <li
              key={d.id}
              className={`toc-item animate-in-delay-${i+1}`}
              onClick={() => goToSlide(domainSlideIndices[i])}
            >
              <div className="toc-badge" style={{background: d.color}}>{d.id}</div>
              <div className="toc-text">
                <h3>{d.title}</h3>
                <span>{d.weight} of scored content</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ===== DOMAIN TITLE SLIDE =====
function DomainTitleSlide({ data }) {
  return (
    <div className="domain-title-slide">
      <div className="domain-big-badge animate-scale" style={{background: data.color}}>{data.domain}</div>
      <h2 className="animate-in-delay-1">{data.title}</h2>
      <p className="weight animate-in-delay-2">{data.weight}</p>
      <p className="desc animate-in-delay-3">{data.desc}</p>
    </div>
  );
}

// ===== CONTENT SLIDE =====
function ContentSlide({ data }) {
  return (
    <>
      <div className="slide-header animate-in">
        {data.task && <div className="task-badge" style={{background: data.color}}>{data.task}</div>}
        <h2>{data.title}</h2>
      </div>
      <div className="slide-content">
        {data.table && (
          <table className="slide-table animate-in-delay-1">
            <thead><tr>{data.table.headers.map((h,i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>{data.table.rows.map((row,i) => (
              <tr key={i}>{row.map((cell,j) => <td key={j}>{cell}</td>)}</tr>
            ))}</tbody>
          </table>
        )}
        {data.bullets && (
          <ul className="bullet-list animate-in-delay-1">
            {data.bullets.map((b, i) => (
              <li key={i} dangerouslySetInnerHTML={{__html: b}} />
            ))}
          </ul>
        )}
        {data.principles && (
          <div className="principles-list animate-in-delay-1">
            {data.principles.map((p, i) => (
              <div key={i} className="callout callout-key principle-box">
                <span dangerouslySetInnerHTML={{__html: p}} />
              </div>
            ))}
          </div>
        )}
        {data.code && (
          <div className="code-block animate-in-delay-2">{data.code}</div>
        )}
        {data.callout && (
          <div className={`callout callout-${data.callout.type} animate-in-delay-3`}>
            <span dangerouslySetInnerHTML={{__html: data.callout.text}} />
          </div>
        )}
        {data.example && (
          <div className="example-box animate-in-delay-4">
            <h4>{data.example.title}</h4>
            <p>{data.example.text}</p>
          </div>
        )}
      </div>
    </>
  );
}

// ===== FLASHCARD SLIDE =====
function FlashcardSlide({ data }) {
  const cards = flashcardSets[data.dataKey];
  const [flippedIdx, setFlippedIdx] = useState(null);

  const toggle = (i) => setFlippedIdx(prev => prev === i ? null : i);

  return (
    <div className="fc-slide">
      <div className="slide-header flashcard-header animate-in">
        <h2>{data.title}</h2>
        <p className="subtitle">Click any card to flip · All {cards.length} cards at a glance</p>
      </div>
      <div className="fc-grid">
        {cards.map((card, i) => (
          <div key={i} className="fc-cell" onClick={() => toggle(i)}>
            <div className={`fc-cell-inner ${flippedIdx === i ? 'flipped' : ''}`}>
              <div className="fc-cell-face fc-cell-front">
                <span className="fc-cell-num">Q{i + 1}</span>
                <p className="fc-cell-text">{card.q}</p>
                <span className="fc-cell-hint">tap to flip</span>
              </div>
              <div className="fc-cell-face fc-cell-back">
                <span className="fc-cell-num">A{i + 1}</span>
                <p className="fc-cell-text">{card.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== ANTI-PATTERNS SLIDE =====
function AntiPatternsSlide({ data }) {
  return (
    <>
      <div className="slide-header animate-in">
        <div className="task-badge" style={{ background: data.color }}>Anti-Patterns</div>
        <h2>{data.title}</h2>
        <p className="subtitle">{data.patterns.length} patterns — learn to spot and eliminate these as exam distractors</p>
      </div>
      <div className="slide-content">
        <div className="ap-list">
          {data.patterns.map((p, i) => (
            <div key={i} className={`ap-item animate-in-delay-${Math.min(i + 1, 5)}`}>
              <div className="ap-wrong-row">
                <span className="ap-icon ap-icon-wrong">✕</span>
                <div className="ap-text-block">
                  <div className="ap-header-row">
                    <span className="ap-wrong-title">{p.wrong}</span>
                    <span className={`ap-badge ap-badge-${p.severity.toLowerCase()}`}>{p.severity}</span>
                  </div>
                  <p className="ap-desc">{p.wrongDesc}</p>
                </div>
              </div>
              <div className="ap-right-row">
                <span className="ap-icon ap-icon-right">✓</span>
                <div className="ap-text-block">
                  <span className="ap-right-title">{p.right}</span>
                  <p className="ap-desc">{p.rightDesc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ===== SCENARIO SECTION TITLE SLIDE =====
function ScenarioSectionSlide({ data }) {
  return (
    <div className="domain-title-slide">
      <div className="domain-big-badge animate-scale" style={{background: data.color}}>S</div>
      <h2 className="animate-in-delay-1">{data.title}</h2>
      <p className="weight animate-in-delay-2">{data.subtitle}</p>
      <p className="desc animate-in-delay-3">{data.desc}</p>
    </div>
  );
}

// ===== SCENARIO SLIDE =====
function ScenarioSlide({ data }) {
  return (
    <>
      <div className="slide-header animate-in">
        <div className="task-badge" style={{background: data.color}}>Scenario {data.num}</div>
        <h2>{data.title}</h2>
        <p className="subtitle">{data.desc}</p>
      </div>
      <div className="slide-content">
        <div className="sc-tags animate-in-delay-1">
          {data.tags.map((tag, i) => (
            <span key={i} className="sc-tag">{tag}</span>
          ))}
        </div>
        <div className="sc-decisions animate-in-delay-2">
          {data.decisions.map((d, i) => (
            <div key={i} className={`ap-item animate-in-delay-${Math.min(i + 1, 5)}`}>
              <div className="sc-question-row">{d.question}</div>
              <div className="ap-right-row">
                <span className="ap-icon ap-icon-right">✓</span>
                <div className="ap-text-block">
                  <span className="ap-right-title">Correct</span>
                  <p className="ap-desc">{d.correct}</p>
                </div>
              </div>
              <div className="ap-wrong-row">
                <span className="ap-icon ap-icon-wrong">✕</span>
                <div className="ap-text-block">
                  <div className="ap-header-row">
                    <span className="ap-wrong-title">Anti-Pattern</span>
                  </div>
                  <p className="ap-desc">{d.antiPattern}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="callout callout-key sc-callout animate-in-delay-3">
          <strong>Domains — </strong>{data.domains.join(' · ')}
        </div>
        <div className="example-box animate-in-delay-4">
          <h4>Exam Strategy</h4>
          <p>{data.strategy}</p>
        </div>
      </div>
    </>
  );
}

// ===== THANK YOU SLIDE =====
function ThankYouSlide() {
  return (
    <div className="thankyou-slide">
      <div className="title-logo animate-in" style={{marginBottom: 30}}>CC</div>
      <h2 className="animate-in-delay-1">Thank You!</h2>
      <p className="animate-in-delay-2" style={{color: 'var(--muted)', fontSize: '1rem', marginTop: 12}}>
        Register for the certification at <a href="https://anthropic.skilljar.com/claude-certified-architect-foundations-certification"><span style={{color: 'var(--accent)', fontWeight: 600}}>this link</span></a>
      </p>
      <p className="animate-in-delay-2" style={{color: 'var(--muted)', fontSize: '1.1rem'}}>
        Good luck with your CCA-F certification!
      </p>
      <div className="thankyou-credits animate-in-delay-3">
        Created by Abhijit Das with contributions from Prayas Mohanty
      </div>
    </div>
  );
}

// ===== PARTICLES BACKGROUND =====
function Particles() {
  const particles = Array.from({length: 20}, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 8,
    size: 2 + Math.random() * 4,
  }));
  return (
    <div className="particles">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: `${p.left}%`, top: `${p.top}%`,
          width: p.size, height: p.size,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

// ===== MAIN APP =====
export default function App() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState('right');

  const goTo = useCallback((idx) => {
    if (idx === current || idx < 0 || idx >= slides.length) return;
    setDirection(idx > current ? 'right' : 'left');
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  const progress = ((current + 1) / slides.length) * 100;

  const renderSlide = (slide, index) => {
    const isActive = index === current;
    const isPrev = index < current;
    let className = 'slide';
    if (isActive) className += ' active';
    else if (isPrev) className += ' exit-left';

    if (!isActive && Math.abs(index - current) > 1) return null;

    let content;
    switch (slide.type) {
      case 'title': content = <TitleSlide />; break;
      case 'disclaimer': content = <DisclaimerSlide />; break;
      case 'exam-info': content = <ExamInfoSlide />; break;
      case 'toc': content = <TOCSlide goToSlide={goTo} />; break;
      case 'domain-title': content = <DomainTitleSlide data={slide} />; break;
      case 'content': content = <ContentSlide data={slide} />; break;
      case 'flashcard': content = <FlashcardSlide data={slide} />; break;
      case 'anti-patterns': content = <AntiPatternsSlide data={slide} />; break;
      case 'scenario-section': content = <ScenarioSectionSlide data={slide} />; break;
      case 'scenario': content = <ScenarioSlide data={slide} />; break;
      case 'thankyou': content = <ThankYouSlide />; break;
      default: content = null;
    }

    return (
      <div key={index} className={className}>
        {content}
      </div>
    );
  };

  return (
    <div className="presentation">
      <Particles />
      <div className="progress-bar" style={{width: `${progress}%`}} />
      {slides.map((slide, i) => renderSlide(slide, i))}
      <div className="slide-counter">{current + 1} / {slides.length}</div>
      <div className="nav-hint">← → Arrow keys to navigate</div>
      <div className="tap-zone tap-zone-left" onClick={prev} />
      <div className="tap-zone tap-zone-right" onClick={next} />
    </div>
  );
}
