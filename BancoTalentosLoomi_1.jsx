import { useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Banco de Talentos Loomi — formulário multi-etapas
   Etapa 0 = Informativo (página de abertura, com botão Start)
   As próximas etapas entram no array STEPS conforme o conteúdo for chegando.

   Motor de campos já suporta: short_text, email, tel, url, long_text,
   select, radio, checkbox (múltipla). Adicionar uma página nova = adicionar
   um objeto em STEPS. Nada além disso.
   ────────────────────────────────────────────────────────────────────────── */

const PS_LINK =
  "https://forest-brownie-850.notion.site/Processo-Seletivo-Loomi-1ba00e5aacfa80d6967be9de394fb2ac";

const STEPS = [
  {
    id: "intro",
    type: "intro",
  },

  /* 1 · Identidade */
  {
    id: "identidade",
    type: "questions",
    title: "Identidade",
    subtitle: "Queremos te conhecer como pessoa, antes de tudo.",
    fields: [
      { id: "nome_completo", type: "short_text", label: "Nome completo" },
      {
        id: "como_chamada",
        type: "short_text",
        label: "Como você gostaria de ser chamade?",
        required: true,
      },
      {
        id: "pronome",
        type: "radio",
        label: "Qual pronome de tratamento você prefere?",
        options: [
          "Ela/Dela",
          "Ela/Dele",
          "Ele/Dele",
          "Ele/Dela",
          "Ela/Delu",
          "Ele/Delu",
          "Elu/Delu",
        ],
      },
    ],
  },

  /* 2 · Contato */
  {
    id: "contato",
    type: "questions",
    title: "Contato",
    subtitle: "Para que possamos te encontrar facilmente.",
    fields: [
      {
        id: "cidade",
        type: "short_text",
        label: "Em qual cidade você mora?",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "E-mail",
        required: true,
        placeholder: "voce@email.com",
      },
      {
        id: "telefone",
        type: "tel",
        label: "Telefone",
        required: true,
        placeholder: "(00) 00000-0000",
      },
      {
        id: "linkedin",
        type: "url",
        label: "LinkedIn",
        required: true,
        placeholder: "https://linkedin.com/in/...",
      },
      {
        id: "curriculo",
        type: "file",
        label: "Currículo / Portfólio (PDF)",
        required: true,
        accept: ".pdf",
        hint: "Garanta que o seu currículo tenha todos os acessos importantes, como: portfólio, Behance, GitHub, etc.",
      },
    ],
  },

  /* 3 · Perfil profissional */
  {
    id: "perfil",
    type: "questions",
    title: "Perfil profissional",
    subtitle: "Onde você está hoje na sua carreira.",
    fields: [
      {
        id: "senioridade",
        type: "select",
        label: "Nível de senioridade",
        placeholder: "Selecione...",
        options: [
          "Estágio",
          "Júnior",
          "Pleno",
          "Sênior",
          "Especialista",
          "Liderança / Gestão",
        ],
      },
      {
        id: "remuneracao",
        type: "short_text",
        label: "Expectativa de remuneração",
        placeholder: "Ex.: R$ 8.000",
      },
      {
        id: "stacks",
        type: "long_text",
        label: "Stacks, frameworks ou especializações",
        placeholder: "Conta o que você domina...",
      },
      {
        id: "competencias",
        type: "long_text",
        label: "Competências e habilidades",
      },
    ],
  },

  /* 4 · Formação & experiência */
  {
    id: "trajetoria",
    type: "questions",
    title: "Formação & experiência",
    subtitle: "Os caminhos que te trouxeram até aqui.",
    fields: [
      { id: "formacao", type: "long_text", label: "Formação" },
      { id: "experiencia", type: "long_text", label: "Experiência profissional" },
    ],
  },

  /* 5 · O que te move */
  {
    id: "fit",
    type: "questions",
    title: "O que te move",
    subtitle: "O que importa pra você num lugar de trabalho.",
    fields: [
      {
        id: "valoriza",
        type: "checkbox",
        label: "O que você mais valoriza?",
        options: [
          "Estabilidade e segurança no vínculo",
          "Oportunidade de crescimento e evolução na carreira",
          "Remuneração competitiva e benefícios",
          "Autonomia e liberdade para decisões",
          "Participar de projetos desafiadores e inovadores",
          "Cultura de colaboração, confiança e pertencimento",
          "Flexibilidade de horário e/ou modelo remoto",
        ],
      },
      {
        id: "motivacao",
        type: "long_text",
        label: "Sua motivação para entrar na Loomi",
      },
      {
        id: "futuro",
        type: "long_text",
        label: "Como você imagina o seu futuro?",
      },
    ],
  },

  /* 6 · Você e a IA */
  {
    id: "ia",
    type: "questions",
    title: "Você e a IA",
    subtitle: "Como a inteligência artificial entra no seu dia a dia.",
    fields: [
      {
        id: "ia_nivel",
        type: "select",
        label: "Nível de uso de IA",
        placeholder: "Selecione...",
        options: [
          "Não uso",
          "Uso ocasionalmente",
          "Uso no dia a dia",
          "Uso de forma avançada / integrada ao trabalho",
        ],
      },
      {
        id: "ia_finalidade",
        type: "long_text",
        label: "Para que você usa IA?",
      },
      {
        id: "ia_automacao",
        type: "long_text",
        label: "Você já criou alguma automação com IA? Conta pra gente.",
      },
    ],
  },

  /* 7 · Quase lá */
  {
    id: "final",
    type: "questions",
    title: "Quase lá",
    subtitle: "Só mais alguns detalhes.",
    fields: [
      {
        id: "como_conheceu",
        type: "select",
        label: "Como você conheceu a Loomi?",
        placeholder: "Selecione...",
        options: [
          "LinkedIn",
          "Instagram",
          "Indicação de alguém",
          "Site / Blog",
          "Evento",
          "Outro",
        ],
      },
      {
        id: "indicacao",
        type: "short_text",
        label: "Quem te indicou?",
        showIf: { field: "como_conheceu", equals: "Indicação de alguém" },
      },
      {
        id: "banco_afirmativo",
        type: "checkbox",
        label: "Você gostaria de entrar em um banco afirmativo?",
        hint: "Opcional. Essa informação nos ajuda em ações afirmativas e é tratada com confidencialidade.",
        options: ["Pessoas LGBTQIA+", "Mulheres", "Pessoas pretas", "Prefiro não informar"],
      },
    ],
  },
];

export default function BancoTalentosLoomi() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const step = STEPS[stepIndex];
  const isIntro = step.type === "intro";
  const questionSteps = STEPS.filter((s) => s.type === "questions");
  const currentQuestionPos = questionSteps.findIndex((s) => s.id === step.id);
  const totalQuestions = questionSteps.length;

  const setAnswer = (id, value) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const goNext = () =>
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <div className="loomi-root">
      <style>{CSS}</style>

      {/* Aurora / glass de fundo */}
      <div className="aurora" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>

      <main className="stage">
        {isIntro ? (
          <IntroCard onStart={goNext} />
        ) : (
          <QuestionCard
            step={step}
            answers={answers}
            setAnswer={setAnswer}
            onBack={goBack}
            onNext={goNext}
            isLast={isLast}
            position={currentQuestionPos + 1}
            total={totalQuestions}
          />
        )}
      </main>
    </div>
  );
}

/* ── Página 0: Informativo ─────────────────────────────────────────────── */
function IntroCard({ onStart }) {
  return (
    <section className="card intro" aria-labelledby="intro-title">
      <p className="eyebrow">Loomi · Carreiras</p>
      <h1 id="intro-title" className="intro-title">
        Banco de Talentos <span className="accent">Loomi</span>
      </h1>

      <p className="intro-body">
        Na Loomi, acreditamos que talento nasce de histórias diversas, caminhos
        únicos e sonhos autênticos. Este espaço foi criado para que você possa se
        apresentar de forma leve, honesta e inteira. Queremos conhecer quem você
        é, como você trabalha e o que te move, além do que está no currículo{" "}
        <span className="heart">💜</span>
      </p>

      <p className="intro-body">
        Sempre que surge uma nova oportunidade por aqui, este é o primeiro lugar
        que procuramos por pessoas candidatas!
      </p>

      <p className="intro-cta-line">Vamos nessa? 🌟</p>

      <a
        className="ps-link"
        href={PS_LINK}
        target="_blank"
        rel="noopener noreferrer"
      >
        Saiba mais sobre o PS Loomi!
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path
            d="M7 17L17 7M17 7H9M17 7V15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      <button className="btn-start" onClick={onStart}>
        Start
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}

/* ── Páginas de perguntas ──────────────────────────────────────────────── */
function QuestionCard({
  step,
  answers,
  setAnswer,
  onBack,
  onNext,
  isLast,
  position,
  total,
}) {
  return (
    <section className="card question" aria-labelledby="q-title">
      <div className="progress">
        <span className="progress-label">
          Etapa {position} de {total}
        </span>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${(position / Math.max(total, 1)) * 100}%` }}
          />
        </div>
      </div>

      <h2 id="q-title" className="q-title">
        {step.title}
      </h2>
      {step.subtitle && <p className="q-subtitle">{step.subtitle}</p>}

      <div className="fields">
        {step.fields
          .filter(
            (f) => !f.showIf || answers[f.showIf.field] === f.showIf.equals
          )
          .map((f) => (
            <Field
              key={f.id}
              field={f}
              value={answers[f.id]}
              onChange={(v) => setAnswer(f.id, v)}
            />
          ))}
      </div>

      <div className="nav">
        <button className="btn-ghost" onClick={onBack}>
          Voltar
        </button>
        <button className="btn-start" onClick={onNext}>
          {isLast ? "Enviar" : "Continuar"}
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}

/* ── Renderizador de campos ────────────────────────────────────────────── */
function Field({ field, value, onChange }) {
  const { type, label, placeholder, required, options = [] } = field;

  const labelEl = (
    <div className="field-head">
      <label className="field-label" htmlFor={field.id}>
        {label}
        {required && <span className="req">*</span>}
      </label>
      {field.hint && <p className="field-hint">{field.hint}</p>}
    </div>
  );

  if (type === "file") {
    return (
      <div className="field">
        {labelEl}
        <label className="filezone">
          <input
            id={field.id}
            className="file-input"
            type="file"
            accept={field.accept}
            onChange={(e) => onChange(e.target.files?.[0]?.name || "")}
          />
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="file-text">
            {value ? value : "Clique para anexar (PDF)"}
          </span>
        </label>
      </div>
    );
  }

  if (["short_text", "email", "tel", "url"].includes(type)) {
    const inputType =
      type === "email" ? "email" : type === "tel" ? "tel" : type === "url" ? "url" : "text";
    return (
      <div className="field">
        {labelEl}
        <input
          id={field.id}
          className="input"
          type={inputType}
          placeholder={placeholder || ""}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (type === "long_text") {
    return (
      <div className="field">
        {labelEl}
        <textarea
          id={field.id}
          className="input textarea"
          rows={4}
          placeholder={placeholder || ""}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="field">
        {labelEl}
        <select
          id={field.id}
          className="input select"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            {placeholder || "Selecione..."}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "radio") {
    return (
      <div className="field">
        {labelEl}
        <div className="options">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              className={`chip ${value === o ? "chip-on" : ""}`}
              onClick={() => onChange(o)}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "checkbox") {
    const arr = Array.isArray(value) ? value : [];
    const toggle = (o) =>
      arr.includes(o) ? onChange(arr.filter((x) => x !== o)) : onChange([...arr, o]);
    return (
      <div className="field">
        {labelEl}
        <div className="options">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              className={`chip ${arr.includes(o) ? "chip-on" : ""}`}
              onClick={() => toggle(o)}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

/* ── Estilos ───────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

.loomi-root{
  --purple:#5014BA;
  --purple-bright:#7B3FE4;
  --purple-soft:#9B6BF0;
  --ink:#0C0912;
  --ink-60:rgba(12,9,18,.6);
  --ink-40:rgba(12,9,18,.4);
  --lilac:#F4EFFC;
  --line:rgba(80,20,186,.14);
  position:relative;
  min-height:100%;
  width:100%;
  display:flex;
  font-family:'Sora',system-ui,-apple-system,sans-serif;
  color:var(--ink);
  background:
    radial-gradient(120% 90% at 50% -10%, #fbf9ff 0%, #f4eefc 45%, #efe7fb 100%);
  overflow:hidden;
  padding:clamp(20px,5vw,56px);
  box-sizing:border-box;
}
.loomi-root *{box-sizing:border-box}

.aurora{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}
.blob{position:absolute;border-radius:50%;filter:blur(70px);opacity:.5}
.blob-a{width:46vmax;height:46vmax;background:var(--purple-soft);top:-22vmax;left:-12vmax;animation:float1 18s ease-in-out infinite}
.blob-b{width:38vmax;height:38vmax;background:#c9b3f5;bottom:-20vmax;right:-10vmax;animation:float2 22s ease-in-out infinite}
.blob-c{width:26vmax;height:26vmax;background:var(--purple-bright);opacity:.22;top:30%;right:18%;animation:float1 26s ease-in-out infinite}
@keyframes float1{0%,100%{transform:translate(0,0)}50%{transform:translate(3vmax,4vmax)}}
@keyframes float2{0%,100%{transform:translate(0,0)}50%{transform:translate(-4vmax,-3vmax)}}

.stage{position:relative;z-index:1;margin:auto;width:100%;max-width:600px;display:flex}

.card{
  width:100%;
  background:rgba(255,255,255,.72);
  backdrop-filter:blur(22px) saturate(140%);
  -webkit-backdrop-filter:blur(22px) saturate(140%);
  border:1px solid rgba(255,255,255,.7);
  box-shadow:0 1px 0 rgba(255,255,255,.6) inset, 0 30px 70px -28px rgba(80,20,186,.45);
  border-radius:28px;
  padding:clamp(28px,5vw,48px);
  animation:rise .7s cubic-bezier(.2,.8,.2,1) both;
}
@keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}

.eyebrow{
  margin:0 0 18px;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;color:var(--purple);
}
.intro-title{
  margin:0 0 22px;font-weight:600;line-height:1.05;letter-spacing:-.02em;
  font-size:clamp(32px,6vw,46px);
}
.intro-title .accent{
  background:linear-gradient(105deg,var(--purple),var(--purple-soft));
  -webkit-background-clip:text;background-clip:text;color:transparent;
}
.intro-body{margin:0 0 16px;font-weight:300;font-size:clamp(15px,2.2vw,17px);line-height:1.6;color:var(--ink)}
.heart{font-style:normal}
.intro-cta-line{margin:22px 0 10px;font-weight:500;font-size:18px}

.ps-link{
  display:inline-flex;align-items:center;gap:6px;
  color:var(--purple);font-weight:500;font-size:15px;text-decoration:none;
  border-bottom:1.5px solid var(--line);padding-bottom:2px;
  transition:border-color .2s,gap .2s;margin-bottom:34px;
}
.ps-link:hover{border-color:var(--purple);gap:9px}

.btn-start{
  display:inline-flex;align-items:center;gap:10px;cursor:pointer;
  font-family:inherit;font-weight:600;font-size:16px;color:#fff;
  background:linear-gradient(105deg,var(--purple),var(--purple-bright));
  border:none;border-radius:999px;padding:15px 30px;
  box-shadow:0 14px 30px -10px rgba(80,20,186,.7);
  transition:transform .18s ease,box-shadow .18s ease,filter .18s ease;
}
.btn-start:hover{transform:translateY(-2px);box-shadow:0 20px 38px -12px rgba(80,20,186,.75);filter:saturate(115%)}
.btn-start:active{transform:translateY(0)}

.intro .btn-start{display:flex;width:100%;justify-content:center}

/* perguntas */
.progress{margin-bottom:26px}
.progress-label{font-size:12px;font-weight:600;letter-spacing:.08em;color:var(--purple);text-transform:uppercase}
.progress-track{margin-top:8px;height:6px;border-radius:999px;background:rgba(80,20,186,.12);overflow:hidden}
.progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--purple),var(--purple-soft));transition:width .5s cubic-bezier(.2,.8,.2,1)}

.q-title{margin:0 0 8px;font-weight:600;font-size:clamp(22px,4vw,28px);letter-spacing:-.01em}
.q-subtitle{margin:0 0 26px;font-weight:300;color:var(--ink-60);line-height:1.55;font-size:15px}
.empty-hint{color:var(--ink-40);font-style:italic;font-weight:300}

.fields{display:flex;flex-direction:column;gap:22px;margin-bottom:30px}
.field{display:flex;flex-direction:column;gap:8px}
.field-head{display:flex;flex-direction:column;gap:3px}
.field-label{font-weight:500;font-size:15px}
.field-hint{margin:0;font-weight:300;font-size:13px;line-height:1.45;color:var(--ink-60)}
.req{color:var(--purple);margin-left:3px}

.filezone{
  display:flex;align-items:center;gap:12px;cursor:pointer;color:var(--purple);
  background:rgba(80,20,186,.05);border:1.5px dashed var(--line);
  border-radius:14px;padding:16px 18px;transition:border-color .18s,background .18s;
}
.filezone:hover{border-color:var(--purple-soft);background:rgba(80,20,186,.08)}
.file-input{position:absolute;width:1px;height:1px;opacity:0;overflow:hidden}
.file-text{font-weight:400;font-size:14px;color:var(--ink)}

.input{
  font-family:inherit;font-size:15px;font-weight:300;color:var(--ink);
  background:rgba(255,255,255,.85);border:1.5px solid var(--line);
  border-radius:14px;padding:13px 15px;width:100%;transition:border-color .18s,box-shadow .18s;
}
.input::placeholder{color:var(--ink-40)}
.input:focus{outline:none;border-color:var(--purple);box-shadow:0 0 0 4px rgba(80,20,186,.13)}
.textarea{resize:vertical;min-height:110px;line-height:1.5}
.select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235014BA' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 15px center;padding-right:40px}

.options{display:flex;flex-wrap:wrap;gap:10px}
.chip{
  font-family:inherit;font-size:14px;font-weight:400;cursor:pointer;color:var(--ink);
  background:rgba(255,255,255,.7);border:1.5px solid var(--line);
  border-radius:999px;padding:10px 16px;transition:all .16s;
}
.chip:hover{border-color:var(--purple-soft)}
.chip-on{background:var(--purple);border-color:var(--purple);color:#fff}

.nav{display:flex;justify-content:space-between;align-items:center;gap:12px}
.btn-ghost{
  font-family:inherit;font-weight:500;font-size:15px;cursor:pointer;color:var(--purple);
  background:transparent;border:none;padding:12px 6px;border-radius:999px;transition:opacity .16s;
}
.btn-ghost:hover{opacity:.65}

:focus-visible{outline:2.5px solid var(--purple);outline-offset:3px;border-radius:6px}

@media (prefers-reduced-motion:reduce){
  .blob,.card{animation:none}
  *{transition:none!important}
}
@media (max-width:520px){
  .card{border-radius:22px}
  .nav{flex-direction:row}
}
`;
