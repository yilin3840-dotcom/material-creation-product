const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const goalButtons = document.querySelectorAll('[data-goal]');
const goalSpecimen = document.querySelector('#goal-specimen');
const goalNote = document.querySelector('#goal-note');
const specimenStage = document.querySelector('.specimen-stage');
goalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    goalButtons.forEach((item) => item.classList.remove('is-selected'));
    button.classList.add('is-selected');
    goalNote.classList.add('is-changing');
    specimenStage.classList.add('is-reconfiguring');
    window.setTimeout(() => {
      goalSpecimen.textContent = button.dataset.specimen;
      goalNote.textContent = button.dataset.note;
      specimenStage.dataset.goal = button.dataset.goal;
      goalNote.classList.remove('is-changing');
      specimenStage.classList.remove('is-reconfiguring');
    }, 140);
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (specimenStage) {
  specimenStage.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches) return;
    const bounds = specimenStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    specimenStage.style.setProperty('--spot-x', `${x * 100}%`);
    specimenStage.style.setProperty('--spot-y', `${y * 100}%`);
    specimenStage.style.setProperty('--tilt-x', `${(0.5 - y) * 8}deg`);
    specimenStage.style.setProperty('--tilt-y', `${(x - 0.5) * 10}deg`);
  });
  specimenStage.addEventListener('pointerleave', () => {
    specimenStage.style.setProperty('--spot-x', '50%');
    specimenStage.style.setProperty('--spot-y', '45%');
    specimenStage.style.setProperty('--tilt-x', '0deg');
    specimenStage.style.setProperty('--tilt-y', '0deg');
  });
}

const materialData = {
  metal: '正在观察：金属 / 强度、延展与导电',
  ceramic: '正在观察：陶瓷 / 耐热、耐磨与绝缘',
  polymer: '正在观察：高分子 / 轻盈、柔韧与成型',
  composite: '正在观察：复合材料 / 协同不同材料的优势',
  semiconductor: '正在观察：半导体 / 信息处理与传递'
};
const materialCards = document.querySelectorAll('[data-material]');
const materialSelection = document.querySelector('#material-selection');
materialCards.forEach((card) => {
  const selectMaterial = () => {
    materialCards.forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-pressed', 'false');
    });
    card.classList.add('is-active');
    card.setAttribute('aria-pressed', 'true');
    materialSelection.textContent = materialData[card.dataset.material];
  };
  card.addEventListener('click', selectMaterial);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectMaterial(); }
  });
});

const chainStepData = {
  composition: { hint: '先看成分：它决定材料最初的“配方”。', inspect: 'atom' },
  process: { hint: '再看制备：加热、冷却或成型会改变材料内部。', inspect: 'process' },
  structure: { hint: '接着看结构：原子怎样排列，会影响材料的性格。', inspect: 'structure' },
  performance: { hint: '然后看性能：结构最终表现为强度、导电或耐热。', inspect: 'application' },
  application: { hint: '最后回到应用：材料能力要落到真实问题上。', inspect: 'application' }
};
const chainButtons = [...document.querySelectorAll('[data-chain-step]')];
const chainHint = document.querySelector('#learning-chain-hint');
const chainNext = document.querySelector('#learning-next');
const headerProgress = document.querySelector('#header-progress');
const chainOrder = ['composition', 'process', 'structure', 'performance', 'application'];
let activeChainIndex = 0;
function activateChainStep(button, shouldFocus = false) {
  if (!button) return;
  chainButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });
  const step = chainStepData[button.dataset.chainStep];
  activeChainIndex = Math.max(0, chainOrder.indexOf(button.dataset.chainStep));
  chainHint.textContent = step.hint;
  if (headerProgress) headerProgress.textContent = `学习 ${String(activeChainIndex + 1).padStart(2, '0')} / 05`;
  if (shouldFocus) button.focus({ preventScroll: true });
  const inspector = document.querySelector(`[data-inspect="${step.inspect}"]`);
  if (inspector) inspector.click();
}
chainButtons.forEach((button) => {
  button.addEventListener('click', () => activateChainStep(button));
});
chainNext.addEventListener('click', () => {
  const nextIndex = (activeChainIndex + 1) % chainOrder.length;
  activateChainStep(document.querySelector(`[data-chain-step="${chainOrder[nextIndex]}"]`), true);
});

const inspectData = {
  atom: {
    index: '01', symbol: 'Fe', title: '先选择合适的元素',
    beginner: '材料的成分像一份“配方”。元素不同，材料能做到的事情也不同。',
    expert: '元素种类、比例与电子结构共同构成后续结构和性能的起点。'
  },
  structure: {
    index: '02', symbol: '⌬', title: '再看它们如何排列',
    beginner: '同样的原子，排成不同形状，可能就会更坚硬、更柔韧或更容易导电。',
    expert: '晶体结构、相组成、缺陷与界面，会显著改变材料的宏观响应。'
  },
  process: {
    index: '03', symbol: 'Δ', title: '工艺会改变材料内部',
    beginner: '加热、冷却、压制或沉积，都会让材料内部重新组织。',
    expert: '热处理、烧结、沉积和形变加工可调控相结构、晶粒与残余应力。'
  },
  application: {
    index: '04', symbol: '→', title: '最后回到现实问题',
    beginner: '材料的价值，最终体现在它是否能让产品更好用、更安全或更环保。',
    expert: '应用需求将被转译为可量化性能指标与服役条件，并反向约束材料设计。'
  }
};
const inspectorTabs = document.querySelectorAll('[data-inspect]');
const inspectIndex = document.querySelector('.output-index');
const inspectTitle = document.querySelector('#inspect-title');
const inspectText = document.querySelector('#inspect-text');
const inspectSymbol = document.querySelector('#inspect-symbol');
let expertMode = false;

function renderInspector(key) {
  const item = inspectData[key];
  inspectIndex.textContent = item.index;
  inspectTitle.textContent = item.title;
  inspectText.textContent = expertMode ? item.expert : item.beginner;
  inspectSymbol.textContent = item.symbol;
}

inspectorTabs.forEach((button) => {
  button.addEventListener('click', () => {
    inspectorTabs.forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-selected', 'false');
    });
    button.classList.add('is-active');
    button.setAttribute('aria-selected', 'true');
    renderInspector(button.dataset.inspect);
  });
});

const processData = {
  goal: { index: 'STEP 01', title: '把模糊的愿望变成可研究的目标。', text: '例如“更高效”会被转成可比较的性能指标与实际约束条件。', input: '目标性能与应用场景' },
  candidate: { index: 'STEP 02', title: '从可能性空间中提出候选。', text: '系统根据目标与候选元素池，形成值得进一步研究的组成方案。', input: '元素候选池与配方约束' },
  screen: { index: 'STEP 03', title: '让计算先缩小搜索范围。', text: '高通量组合筛选和性能预测，帮助研究者优先关注更有潜力的候选。', input: '候选组成与预测模型' },
  verify: { index: 'STEP 04', title: '用实验回答“它真的有效吗？”', text: '模型给出方向，材料是否符合预期仍需要制备与表征进行验证。', input: '候选方案与实验条件' },
  iterate: { index: 'STEP 05', title: '把每次结果变成下一次线索。', text: '根据实验或计算反馈继续优化，逐步接近目标性能。', input: '验证结果与优化策略' }
};
const processModeData = {
  goal: {
    beginner: { title: '把“想要更好”说清楚。', text: '例如“更高效”会被转成可以比较的指标，系统才知道要往哪里找。', input: '想解决的问题' },
    expert: { title: '定义可计算的目标函数。', text: '把应用需求转译为性能指标、边界条件与可行域，作为逆向设计的约束。', input: '目标函数与约束' }
  },
  candidate: {
    beginner: { title: '先列出可能的配方。', text: '系统根据目标和元素候选池，整理出值得继续观察的材料组合。', input: '候选元素与比例' },
    expert: { title: '在组合空间中生成候选。', text: '基于成分空间、结构先验与任务约束，形成可进入筛选的组成方案。', input: '成分空间与先验' }
  },
  screen: {
    beginner: { title: '让计算先帮忙排队。', text: '预测会帮助我们优先关注更有潜力的候选，减少盲目试错。', input: '候选方案与预测' },
    expert: { title: '用高通量筛选压缩搜索空间。', text: '通过代理模型或原子级势能预测候选性能，并排除低潜力区域。', input: '筛选器与预测模型' }
  },
  verify: {
    beginner: { title: '用实验回答“真的有效吗？”', text: '模型只是给出方向，制备和表征才会告诉我们材料是否符合预期。', input: '样品与实验条件' },
    expert: { title: '以制备、表征闭环验证预测。', text: '将合成窗口、表征结果与模型预测进行对照，识别误差来源。', input: '合成窗口与表征' }
  },
  iterate: {
    beginner: { title: '把这次结果变成下一条线索。', text: '成功或失败都能帮助下一轮更接近目标性能。', input: '结果与下一步' },
    expert: { title: '用反馈更新下一轮优化。', text: '将实验或计算反馈回灌到候选生成与优化策略中，形成闭环。', input: '反馈数据与优化器' }
  }
};
const processCards = document.querySelectorAll('[data-process]');
const processIndex = document.querySelector('#process-index');
const processTitle = document.querySelector('#process-title');
const processText = document.querySelector('#process-text');
const processInput = document.querySelector('#process-input');
const processProgressLabel = document.querySelector('#process-progress-label');
const processProgressFill = document.querySelector('#process-progress-fill');
const processOrder = ['goal', 'candidate', 'screen', 'verify', 'iterate'];
function renderProcess(key) {
  const item = processData[key];
  const modeItem = processModeData[key][expertMode ? 'expert' : 'beginner'];
  const processIndexValue = Math.max(0, processOrder.indexOf(key));
  processIndex.textContent = item.index;
  processTitle.textContent = modeItem.title;
  processText.textContent = modeItem.text;
  processInput.textContent = modeItem.input;
  if (processProgressLabel) processProgressLabel.textContent = `${String(processIndexValue + 1).padStart(2, '0')} / 05`;
  if (processProgressFill) processProgressFill.style.width = `${((processIndexValue + 1) / processOrder.length) * 100}%`;
  processCards.forEach((card) => card.setAttribute('aria-current', card.dataset.process === key ? 'step' : 'false'));
}
processCards.forEach((card) => {
  const selectCard = () => {
    processCards.forEach((item) => item.classList.remove('is-active'));
    card.classList.add('is-active');
    renderProcess(card.dataset.process);
  };
  card.addEventListener('click', selectCard);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectCard(); }
  });
});

const glossary = {
  成分: '材料由哪些元素、分子或相组成。它像一份配方，决定后续可以形成什么结构。',
  结构: '原子、晶粒、孔隙和界面如何排列、连接。微小的排列差异，可能带来完全不同的性能。',
  性能: '材料在特定环境和任务下表现出的能力，例如强度、导电、耐热或催化活性。',
  过电位: '实际反应需要额外施加的电压。数值越低，通常意味着反应更省力。'
};
const termPopover = document.querySelector('#term-popover');
const termName = document.querySelector('#term-name');
const termDefinition = document.querySelector('#term-definition');
const termClose = document.querySelector('#term-close');
function closeGlossary() {
  if (!termPopover) return;
  termPopover.classList.remove('is-open');
  window.setTimeout(() => { termPopover.hidden = true; }, 180);
}
document.querySelectorAll('[data-term]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const term = trigger.dataset.term;
    termName.textContent = term;
    termDefinition.textContent = glossary[term] || '这个词将在后续资料中展开。';
    termPopover.hidden = false;
    requestAnimationFrame(() => termPopover.classList.add('is-open'));
  });
});
termClose.addEventListener('click', closeGlossary);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeGlossary(); });

const modeToggle = document.querySelector('#mode-toggle');
const heroText = document.querySelector('.hero-description');
const modeStatus = document.querySelector('#mode-status');
const aiModeTitle = document.querySelector('#ai-mode-title');
const aiListItems = [...document.querySelectorAll('.ai-list li')];
const aiModeCopy = {
  beginner: {
    title: 'AI 会怎么帮忙？<br />先把问题拆小，再找答案。',
    status: '小白模式 · 先看结论',
    items: [
      ['找资料', '从可靠的材料知识中找到线索'],
      ['拆步骤', '把复杂问题拆成可以执行的小任务'],
      ['预估结果', '提前看看哪些候选更值得尝试'],
      ['继续改进', '把每次结果变成下一轮线索']
    ]
  },
  expert: {
    title: 'AI 不替代实验。<br />它让探索更有方向。',
    status: '专家模式 · 模型链路与证据',
    items: [
      ['RAG 检索', '从材料学术知识库找到线索'],
      ['任务规划', '形成工具调用链与执行策略'],
      ['MACE 预测', '预测原子级能量与结构'],
      ['梯度优化', '迭代推荐合金组分']
    ]
  }
};
function renderModeContent() {
  const key = expertMode ? 'expert' : 'beginner';
  const copy = aiModeCopy[key];
  modeStatus.textContent = copy.status;
  aiModeTitle.innerHTML = copy.title;
  aiListItems.forEach((item, index) => {
    item.querySelector('strong').textContent = copy.items[index][0];
    item.querySelector('small').textContent = copy.items[index][1];
  });
  const activeProcess = document.querySelector('[data-process].is-active');
  if (activeProcess) renderProcess(activeProcess.dataset.process);
  normalizeProductLanguage();
}
modeToggle.addEventListener('click', () => {
  expertMode = !expertMode;
  document.body.classList.toggle('expert-mode', expertMode);
  document.body.dataset.mode = expertMode ? 'expert' : 'beginner';
  modeToggle.setAttribute('aria-pressed', String(expertMode));
  // Switch the two product surfaces immediately; the delayed render only
  // animates the hand-off and must not leave the exhibition underneath.
  if (typeof syncWorkbenchDom === 'function') syncWorkbenchDom();
  heroText.textContent = expertMode
    ? '以成分、制备、结构、性能与应用的关联为线索，认识目标导向的材料创制。'
    : '从原子、结构与工艺出发，理解每一种材料如何被设计、验证，并走向真实世界。';
  const activeInspector = document.querySelector('[data-inspect].is-active');
  renderInspector(activeInspector.dataset.inspect);
  renderModeContent();
});
document.body.dataset.mode = 'beginner';

const runDemo = document.querySelector('#run-demo');
const aiDemo = document.querySelector('.ai-demo');
const aiDemoStatus = document.querySelector('#ai-demo-status');
const runMeterFill = document.querySelector('#run-meter-fill');
runDemo.addEventListener('click', async () => {
  if (aiDemo.classList.contains('is-running')) return;
  const sequence = [
    ['检索材料学术知识库…', '25%'],
    ['规划工具调用路径…', '52%'],
    ['预测候选结构与能量…', '76%'],
    ['整理一份可验证的建议…', '100%']
  ];
  aiDemo.classList.add('is-running');
  runDemo.disabled = true;
  aiListItems.forEach((item) => item.classList.remove('is-current', 'is-done'));
  for (const [index, [status, progress]] of sequence.entries()) {
    aiListItems.forEach((item, itemIndex) => {
      item.classList.toggle('is-current', itemIndex === index);
      item.classList.toggle('is-done', itemIndex < index);
    });
    aiDemoStatus.textContent = status;
    runMeterFill.style.width = progress;
    await sleep(620);
  }
  aiDemoStatus.textContent = '推演完成：建议进入验证环节';
  aiListItems.forEach((item) => { item.classList.remove('is-current'); item.classList.add('is-done'); });
  aiDemo.classList.remove('is-running');
  runDemo.disabled = false;
});

const poolRange = document.querySelector('#pool-range');
const poolOutput = document.querySelector('#pool-output');
const poolCopy = document.querySelector('#pool-copy');
const combinationOutput = document.querySelector('#combination-output');
const caseRun = document.querySelector('#case-run');
const caseControl = document.querySelector('.case-control');
const caseStatus = document.querySelector('#case-status');
poolRange.addEventListener('input', () => {
  const size = Number(poolRange.value);
  poolOutput.value = String(size);
  const combinations = size < 5 ? 0 : (size * (size - 1) * (size - 2) * (size - 3) * (size - 4)) / 120;
  if (combinationOutput) combinationOutput.textContent = combinations.toLocaleString('zh-CN');
  poolCopy.textContent = size === 8
    ? '候选池越大，可能组合越多；示例设置为 8。'
    : `当前用 ${size} 种候选元素解释搜索空间变化；这不是实际配方生成。`;
});
caseRun.addEventListener('click', async () => {
  if (caseControl.classList.contains('is-running')) return;
  caseControl.classList.add('is-running');
  caseRun.disabled = true;
  caseStatus.textContent = '正在将性能目标转成候选筛选条件…';
  await sleep(700);
  caseStatus.textContent = '概念结论：候选空间扩大后，更需要预测与验证共同缩小范围。';
  caseControl.classList.remove('is-running');
  caseRun.disabled = false;
});

const caseEvidenceToggle = document.querySelector('#case-evidence-toggle');
const caseEvidenceClose = document.querySelector('#case-evidence-close');
const caseSection = document.querySelector('#case');
function setCaseEvidence(open) {
  caseSection.classList.toggle('is-evidence-open', open);
  caseEvidenceToggle.setAttribute('aria-expanded', String(open));
  caseEvidenceToggle.classList.toggle('is-active', open);
  caseEvidenceToggle.querySelector('span').textContent = open ? '↘' : '↗';
}
caseEvidenceToggle.addEventListener('click', () => setCaseEvidence(!caseSection.classList.contains('is-evidence-open')));
caseEvidenceClose.addEventListener('click', () => setCaseEvidence(false));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && caseSection.classList.contains('is-evidence-open')) setCaseEvidence(false); });

// 应用式页面切换：其他功能页不会因为滚轮而出现，只能通过按钮进入。
const appViews = [...document.querySelectorAll('[data-view]')];
const viewLinks = [...document.querySelectorAll('[data-view-link]')];

// 空白区域支持鼠标按住上下拖动；交互控件保留点击、拖拽滑块等原生行为。
appViews.forEach((view) => {
  let dragging = false;
  let pointerId = null;
  let startY = 0;
  let startScrollTop = 0;
  const isControl = (target) => target.closest('button,a,input,textarea,select,[role="button"],[role="tab"],.term-popover');
  const stopDragging = () => {
    if (!dragging) return;
    dragging = false;
    pointerId = null;
    view.classList.remove('is-dragging');
    view.style.removeProperty('user-select');
  };
  view.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || isControl(event.target) || view.scrollHeight <= view.clientHeight) return;
    dragging = true;
    pointerId = event.pointerId;
    startY = event.clientY;
    startScrollTop = view.scrollTop;
    view.classList.add('is-dragging');
    view.style.userSelect = 'none';
    view.setPointerCapture(pointerId);
  });
  view.addEventListener('pointermove', (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    const distance = event.clientY - startY;
    if (Math.abs(distance) > 2) event.preventDefault();
    view.scrollTop = startScrollTop - distance;
  });
  view.addEventListener('pointerup', stopDragging);
  view.addEventListener('pointercancel', stopDragging);
  view.addEventListener('lostpointercapture', stopDragging);
});

const viewTitles = {
  home: '材料智能创制',
  material: '认识材料',
  process: '创制流程',
  ai: '智能研究',
  case: '真实案例',
  sources: '证据索引'
};

function showView(name, updateHash = true) {
  const target = document.querySelector(`[data-view="${name}"]`);
  if (!target) return;
  closeGlossary();
  if (name !== 'case' && caseSection.classList.contains('is-evidence-open')) setCaseEvidence(false);
  appViews.forEach((view) => {
    const active = view === target;
    view.classList.toggle('is-active', active);
    view.setAttribute('aria-hidden', String(!active));
  });
  target.scrollTop = 0;
  target.classList.remove('is-entering');
  requestAnimationFrame(() => target.classList.add('is-entering'));
  viewLinks.forEach((link) => link.classList.toggle('is-current', link.dataset.viewLink === name));
  document.title = viewTitles[name] || viewTitles.home;
  if (updateHash && window.location.hash !== `#${name}`) history.pushState({ view: name }, '', `#${name}`);
}

viewLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showView(link.dataset.viewLink);
  });
});

document.querySelectorAll('[data-open-view]').forEach((control) => {
  control.addEventListener('click', () => showView(control.dataset.openView));
});

const initialView = window.location.hash.slice(1);
showView(viewTitles[initialView] ? initialView : 'home', false);
window.addEventListener('popstate', () => {
  const route = window.location.hash.slice(1);
  showView(viewTitles[route] ? route : 'home', false);
});

const modelData = {
  panshi: {
    kicker: '01 / FOUNDATION MODEL',
    title: '磐石·祝融',
    text: '面向材料研发的基础模型，帮助研究者从知识发现走向按需设计与精准制备。',
    metric: '按需设计',
    capability: '知识发现 → 精准制备',
    link: false
  },
  matmind: {
    kicker: '02 / MATERIAL AGENT',
    title: 'MatMind Agent',
    text: '未知晶体空间探索效率可提高 3–5 倍，按需结构生成准确度为 75%；闭环案例还展示了 4 轮迭代将 7 万候选缩至 20 种。',
    metric: '闭环案例效率 3500×',
    capability: '另一案例：电导率 +40.8%，规律发现 200×',
    link: false
  },
  s1: {
    kicker: '03 / CASE VALIDATION',
    title: 'S1-MatAgent',
    text: '规划器驱动的多智能体案例，围绕碱性析氢反应筛选高熵合金催化剂，并把预测结果交给实验验证。',
    metric: '性能提升 27.7%',
    capability: '当前边界：仅支持五元 HEA 配方',
    link: true
  }
};
const modelButtons = [...document.querySelectorAll('[data-model]')];
const modelDetailKicker = document.querySelector('#model-detail-kicker');
const modelDetailTitle = document.querySelector('#model-detail-title');
const modelDetailText = document.querySelector('#model-detail-text');
const modelDetailMetric = document.querySelector('#model-detail-metric');
const modelDetailCapability = document.querySelector('#model-detail-capability');
const modelDetailLink = document.querySelector('#model-detail-link');
function renderModel(key) {
  const item = modelData[key];
  modelButtons.forEach((button) => {
    const active = button.dataset.model === key;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  modelDetailKicker.textContent = item.kicker;
  modelDetailTitle.textContent = item.title;
  modelDetailText.textContent = item.text;
  modelDetailMetric.textContent = item.metric;
  modelDetailCapability.textContent = item.capability;
  modelDetailLink.hidden = !item.link;
}
modelButtons.forEach((button) => button.addEventListener('click', () => renderModel(button.dataset.model)));
renderModeContent();
renderModel('panshi');

// PDF 证据图只在当前功能页内切换，不触发页面移动。
document.querySelectorAll('[data-evidence-group]').forEach((button) => {
  button.addEventListener('click', () => {
    const group = button.dataset.evidenceGroup;
    const tabs = document.querySelectorAll(`[data-evidence-group="${group}"]`);
    const image = document.querySelector(`#${group}-evidence-image`);
    const caption = document.querySelector(`#${group}-evidence-caption`);
    tabs.forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    image.classList.add('is-switching');
    window.setTimeout(() => {
      image.style.setProperty('--evidence-image', `url('${button.dataset.src}')`);
      image.setAttribute('aria-label', `${button.textContent.trim()}原始资料图的背景化信息层`);
      caption.textContent = button.dataset.caption;
      const structured = image.querySelector('.evidence-structured');
      if (structured) {
        structured.dataset.mode = button.dataset.structured || 'system';
        structured.classList.remove('is-animated');
        window.setTimeout(() => structured.classList.add('is-animated'), 40);
      }
      window.setTimeout(() => image.classList.remove('is-switching'), 260);
    }, 150);
  });
});

// 第一阶段学习骨架：只在前端保存当前阶段、已理解内容与推荐下一步。
const learningStorageKey = 'material-learning-state-v1';
const learningViewData = {
  home: { stage: '从需求出发', understood: '材料研发，是把一个现实需求翻译成材料能力。', next: '先认识材料的组成、结构与用途。', nextView: 'material', nextLabel: '开始学习' },
  material: { stage: '认识材料', understood: '材料由成分、制备与结构共同决定性能。', next: '看看科学家如何从目标性能反向设计材料。', nextView: 'process', nextLabel: '进入创制流程' },
  process: { stage: '材料创制', understood: '材料可以从目标性能出发，被逐步反向设计。', next: '再看看 AI 如何参与检索、规划与预测。', nextView: 'ai', nextLabel: '了解 AI 研究伙伴' },
  ai: { stage: 'AI 研究伙伴', understood: 'AI 可以帮助缩小搜索范围，但不会替代实验。', next: '查看一次真实的材料创制案例。', nextView: 'case', nextLabel: '查看真实案例' },
  case: { stage: '真实案例', understood: '预测、计算和实验需要组成一个闭环。', next: '回到原始资料，继续核对证据。', nextView: 'sources', nextLabel: '打开资料索引' },
  sources: { stage: '知识库与原始资料', understood: '每个结论都应该能被来源与证据追溯。', next: '重新选择一条学习路径。', nextView: 'home', nextLabel: '回到首页' }
};
let learningState = { currentView: 'home', materialStep: 0, processStep: 0 };
try {
  const storedLearningState = JSON.parse(window.localStorage.getItem(learningStorageKey) || 'null');
  if (storedLearningState && typeof storedLearningState === 'object') learningState = { ...learningState, ...storedLearningState };
} catch (error) { /* 隐私模式下仍可正常使用，只是不持久化学习进度。 */ }

function persistLearningState() {
  try { window.localStorage.setItem(learningStorageKey, JSON.stringify(learningState)); } catch (error) { /* no-op */ }
}
function renderLearningContexts() {
  document.querySelectorAll('[data-learning-context]').forEach((context) => {
    const view = context.dataset.learningContext || learningState.currentView;
    const copy = learningViewData[view] || learningViewData.home;
    const stage = context.querySelector('[data-context-stage]');
    const understood = context.querySelector('[data-context-understood]');
    const nextCopy = context.querySelector('[data-context-next-copy]');
    const nextButton = context.querySelector('[data-context-next]');
    if (stage) stage.textContent = copy.stage;
    if (understood) understood.textContent = copy.understood;
    if (nextCopy) nextCopy.textContent = copy.next;
    if (nextButton) { nextButton.dataset.openView = copy.nextView; nextButton.innerHTML = `${copy.nextLabel} <span>→</span>`; }
  });
}
function markLearningView(view) {
  if (!learningViewData[view]) return;
  learningState.currentView = view;
  persistLearningState();
  renderLearningContexts();
}
const learningRouteControls = [...document.querySelectorAll('[data-open-view],[data-view-link]')];
learningRouteControls.forEach((control) => control.addEventListener('click', () => {
  const destination = control.dataset.openView || control.dataset.viewLink;
  if (destination) markLearningView(destination);
}));
document.querySelectorAll('[data-chain-step]').forEach((button) => button.addEventListener('click', () => {
  learningState.materialStep = Math.max(0, chainOrder.indexOf(button.dataset.chainStep));
  persistLearningState();
  renderLearningContexts();
}));
document.querySelectorAll('[data-process]').forEach((button) => button.addEventListener('click', () => {
  learningState.processStep = Math.max(0, processOrder.indexOf(button.dataset.process));
  persistLearningState();
  renderLearningContexts();
}));

const journeyCopy = {
  atom: '组成：先选择合适的元素，就像先准备一份配方。',
  structure: '结构：同样的原子，排列方式不同，可能产生不同能力。',
  material: '性能：结构把微观差异放大成强度、导电或耐热等表现。',
  product: '应用：最终要回到产品，材料能力必须回应真实需求。'
};
document.querySelectorAll('[data-science-step]').forEach((button) => button.addEventListener('click', () => {
  const key = button.dataset.scienceStep;
  const visual = document.querySelector('#journey-visual');
  if (!visual) return;
  visual.dataset.activeStage = key;
  document.querySelectorAll('[data-science-step]').forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });
  const caption = document.querySelector('#journey-caption');
  if (caption) caption.textContent = journeyCopy[key] || journeyCopy.atom;
}));

const elementCopy = {
  Ni: { name: 'Ni · 镍基骨架', copy: '作为概念示例，Ni 代表稳定的主体框架。', structure: '主体排列更连续', performance: '稳定性 / 活性' },
  Fe: { name: 'Fe · 铁元素', copy: '加入 Fe，示意局部化学环境发生变化。', structure: '局部环境改变', performance: '强度 / 磁性可能变化' },
  Co: { name: 'Co · 钴元素', copy: '加入 Co，示意电子与配位关系发生变化。', structure: '配位关系改变', performance: '活性 / 稳定性可能变化' },
  Mo: { name: 'Mo · 钼元素', copy: '加入 Mo，示意表面位点与耐受性需要重新评估。', structure: '表面位点示意', performance: '耐久性 / 活性可能变化' }
};
document.querySelectorAll('[data-element-choice]').forEach((button) => button.addEventListener('click', () => {
  const key = button.dataset.elementChoice;
  const item = elementCopy[key] || elementCopy.Ni;
  const visual = document.querySelector('#composition-visual');
  if (visual) { visual.dataset.element = key; visual.querySelector('.composition-symbol').textContent = key; }
  document.querySelectorAll('[data-element-choice]').forEach((control) => control.classList.toggle('is-active', control === button));
  const name = document.querySelector('#composition-name');
  const copy = document.querySelector('#composition-copy');
  const structure = document.querySelector('#cause-structure');
  const performance = document.querySelector('#cause-performance');
  const composition = document.querySelector('#cause-composition');
  if (name) name.textContent = item.name;
  if (copy) copy.textContent = item.copy;
  if (composition) composition.textContent = `${key} 参与组合`;
  if (structure) structure.textContent = item.structure;
  if (performance) performance.textContent = item.performance;
}));

const candidateStages = {
  many: { label: '大量候选', count: '1000+', note: '先把可能性铺开', amount: 64 },
  screened: { label: '初步筛选', count: '120', note: '快速排除明显不合适者', amount: 38 },
  few: { label: '少量候选', count: '20', note: '聚焦值得验证的方向', amount: 18 },
  optimize: { label: '优化', count: '5', note: '根据反馈继续迭代', amount: 8 },
  verify: { label: '验证', count: '1–2', note: '交给制备与实验确认', amount: 3 }
};
const candidateCloud = document.querySelector('#candidate-cloud');
if (candidateCloud) {
  candidateCloud.innerHTML = Array.from({ length: 64 }, (_, index) => {
    const left = (index * 37) % 97;
    const top = (index * 61) % 91;
    return `<i style="--i:${index};left:${left}%;top:${top}%"></i>`;
  }).join('');
}
document.querySelectorAll('.candidate-controls [data-candidate-stage]').forEach((button) => button.addEventListener('click', () => {
  const key = button.dataset.candidateStage;
  const item = candidateStages[key] || candidateStages.many;
  const visual = document.querySelector('#candidate-visual');
  if (visual) visual.dataset.candidateStage = key;
  document.querySelectorAll('.candidate-controls [data-candidate-stage]').forEach((control) => {
    const active = control === button;
    control.classList.toggle('is-active', active);
    control.setAttribute('aria-selected', String(active));
  });
  const label = document.querySelector('#candidate-stage-label');
  const count = document.querySelector('#candidate-stage-count');
  const note = document.querySelector('#candidate-stage-note');
  if (label) label.textContent = item.label;
  if (count) count.textContent = item.count;
  if (note) note.textContent = item.note;
}));

renderLearningContexts();

/* Phase 2: evidence-led AI workflow and S1-MatAgent case study. */
const evidenceData = {
  scienceoneTools: {
    value: '100+', label: '材料研发工具', status: 'FACT', case: 'ScienceOne 材料智能创制体系', source: '《材料创制资料(1).pdf》 p2', detail: 'PDF 明确展示 ScienceOne 体系包含 100+ 材料研发工具。这里不把工具数量解释成模型准确率或实验成功率。'
  },
  scienceoneTokens: {
    value: '65B', label: '理论引导 Tokens', status: 'FACT', case: 'ScienceOne 材料智能创制体系', source: '《材料创制资料(1).pdf》 p2', detail: 'PDF 将 65B 作为理论引导 Tokens 展示。资料未进一步说明其训练、推理或有效性口径。'
  },
  scienceoneData: {
    value: '50 万+', label: '材料科学数据', status: 'FACT', case: 'ScienceOne 材料智能创制体系', source: '《材料创制资料(1).pdf》 p2', detail: 'PDF 展示 50 万+ 材料科学数据。资料未说明数据的具体构成与去重方式。'
  },
  unknownSpace: {
    value: '>10⁹', label: '候选空间', status: 'FACT', case: '材料智能创制背景', source: '《材料创制资料(1).pdf》 p2', detail: 'PDF 用大于 10⁹ 表示材料组合与结构可能性的巨大规模。它用于解释搜索难度，不是某个具体配方数量。'
  },
  matmindSpeed: {
    value: '3–5×', label: '探索效率提升', status: 'CASE RESULT', case: 'MatMind 未知空间探索', source: '《材料创制资料(1).pdf》 p3', detail: '这是资料中对 MatMind 未知空间探索效率的案例口径，不应改写为所有材料研发都能提升 3–5 倍。'
  },
  matmindAccuracy: {
    value: '75%', label: '结构设计准确度', status: 'CASE RESULT', case: 'MatMind 按需晶体结构生成', source: '《材料创制资料(1).pdf》 p3', detail: 'PDF 展示按需晶体结构生成的准确度约 75%。资料未说明该指标的测试集与误差定义。'
  },
  limnCandidates: {
    value: '7 万 → 20', label: '候选缩减', status: 'CASE RESULT', case: 'LiMnTiOF 材料探索', source: '《材料创制资料(1).pdf》 p4', detail: 'PDF 展示从约 7 万候选到 20 个重点候选，用于说明候选空间被压缩。资料未说明每一步的筛选阈值。'
  },
  limnEfficiency: {
    value: '3500×', label: '探索效率对比', status: 'CASE RESULT', case: 'LiMnTiOF 材料探索', source: '《材料创制资料(1).pdf》 p4', detail: 'PDF 将 7 万到 20 个候选的案例转译为约 3500× 的探索效率对比；这里保留案例限定，不外推为通用效率。'
  },
  limnConductivity: {
    value: '+40.8%', label: '电导率变化', status: 'CASE RESULT', case: 'LiMnTiOF 材料探索', source: '《材料创制资料(1).pdf》 p4', detail: 'PDF 展示电导率提升至 3.52 mS cm⁻¹，并给出 +40.8% 的案例结果。资料未说明基准样品的全部实验条件。'
  },
  timeCompression: {
    value: '≈66 天 → ≈7 天', label: '研发周期对比', status: 'CASE RESULT', case: '资料中的智能研发案例', source: '《材料创制资料(1).pdf》 p5', detail: 'PDF 对比传统流程与智能研发案例的时间尺度。它描述案例流程效率，不等于所有项目都能稳定达到 7 天。'
  },
  s1Initial: {
    value: '17', label: '初始组合', status: 'CASE RESULT', case: 'S1-MatAgent 高熵合金析氢催化剂', source: '《材料创制资料(1).pdf》 p7', detail: 'PDF 结果页展示 17 个初始组合。'
  },
  s1Optimized: {
    value: '11', label: '优化配方', status: 'CASE RESULT', case: 'S1-MatAgent 高熵合金析氢催化剂', source: '《材料创制资料(1).pdf》 p7', detail: 'PDF 结果页展示 11 个优化配方。'
  },
  s1Best: {
    value: '-23.04', label: '最佳结果标记', status: 'CASE RESULT', case: 'S1-MatAgent 高熵合金析氢催化剂', source: '《材料创制资料(1).pdf》 p7', detail: 'PDF 结果页展示最佳结果标记 -23.04，但资料在当前页面未清晰说明其完整物理量、单位与实验含义，因此不在这里擅自补充。'
  },
  unclear277: {
    value: '27.7%', label: '指标口径待核对', status: 'SOURCE', case: '当前页面旧版展示', source: 'PDF 未提供清晰定义', detail: '当前页面曾展示 27.7%，但在已核对的 PDF 页面中没有找到足够明确的指标定义。本阶段不把它作为性能提升结论。'
  }
};

const workflowData = {
  steps: [
    { key: 'knowledge', label: 'Knowledge', title: '知识检索', kicker: '01 / KNOWLEDGE RETRIEVAL', beginner: '先把相关资料、数据和已有线索找出来。', expert: 'Input: sources · Process: retrieval and grounding · Output: evidence-linked context', output: '可信的研究上下文', status: 'FACT / WORKFLOW' },
    { key: 'planning', label: 'Planning', title: '任务规划', kicker: '02 / TASK PLANNING', beginner: '把一个大问题拆成可以执行的小步骤。', expert: 'Input: research goal · Process: task decomposition · Output: tool and evaluation plan', output: '可执行的研究计划', status: 'CONCEPTUAL' },
    { key: 'generation', label: 'Generation', title: '候选生成', kicker: '03 / CANDIDATE GENERATION', beginner: '在巨大的可能性里，先提出值得继续看的候选。', expert: 'Input: composition space and constraints · Process: candidate generation · Output: candidate set', output: '候选材料集合', status: 'MODEL PREDICTION' },
    { key: 'prediction', label: 'Prediction', title: '性能预测', kicker: '04 / PERFORMANCE PREDICTION', beginner: '用模型先估计哪些方向更值得尝试。', expert: 'Input: candidate structures · Process: model or computational evaluation · Output: ranked hypotheses', output: '优先验证的方向', status: 'MODEL PREDICTION' },
    { key: 'optimization', label: 'Optimization', title: '候选优化', kicker: '05 / OPTIMIZATION', beginner: '根据反馈继续调整，让下一轮更接近目标。', expert: 'Input: predictions and feedback · Process: iterative optimization · Output: refined compositions', output: '优化后的候选', status: 'CONCEPTUAL' },
    { key: 'experiment', label: 'Experiment', title: '实验验证', kicker: '06 / EXPERIMENTAL VALIDATION', beginner: '真正是否有效，最终还要制备材料并做实验。', expert: 'Input: selected candidates · Process: synthesis and characterization · Output: experimental evidence', output: '可复核的实验结果', status: 'EXPERIMENTAL VALIDATION' }
  ],
  systems: [
    { key: 'scienceone', label: 'ScienceOne', layer: '基础科学能力', text: '提供材料知识、理论引导、工具与数据基础。', detail: 'PDF 明确展示 100+ 工具、65B 理论引导 Tokens、50 万+ 材料科学数据。', evidence: ['scienceoneTools', 'scienceoneTokens', 'scienceoneData'], boundary: '资料未说明这些规模指标与具体实验成功率的直接关系。' },
    { key: 'matmind', label: 'MatMind Agent', layer: '材料智能创制', text: '面向未知空间探索、按需结构生成与性能预测。', detail: 'PDF 给出未知空间探索 3–5×、结构设计准确度 75%，并展示 LiMnTiOF 案例。', evidence: ['matmindSpeed', 'matmindAccuracy', 'limnCandidates', 'limnConductivity'], boundary: '案例指标的测试口径与适用范围，PDF 未完全展开。' },
    { key: 's1', label: 'S1-MatAgent', layer: '具体科研案例', text: '围绕高熵合金析氢催化剂进行组合筛选、预测与优化。', detail: 'PDF 结果页展示 17 个初始组合、11 个优化配方与 -23.04 最佳结果标记。', evidence: ['s1Initial', 's1Optimized', 's1Best'], boundary: '当前资料明确提到主要支持五元高熵合金设计。' }
  ]
};

const caseData = {
  stages: [
    { key: 'question', kicker: '01 / RESEARCH QUESTION', title: '我们想设计什么？', beginner: '碱性环境中的析氢反应需要催化剂帮助反应更顺利地发生。', expert: 'Definition: HER（hydrogen evolution reaction） · alkaline environment · high-entropy alloy catalyst', outputLabel: '研究目标', output: '高活性高熵合金析氢催化剂', status: 'FACT / PDF 描述', annotation: '先定义需要解决的材料问题', visual: 'question' },
    { key: 'difficulty', kicker: '02 / WHY IS IT DIFFICULT?', title: '为什么不能逐个试？', beginner: '元素越多、结构越复杂，可能的组合就越大，人工逐个尝试会很慢。', expert: 'Mechanism: composition space × structure space × process sensitivity creates a large search problem.', outputLabel: '困难来源', output: '多元素 + 复杂结构 + 巨大候选空间', status: 'FACT / PDF p2', annotation: '候选不是一个答案，而是一片空间', visual: 'difficulty' },
    { key: 'space', kicker: '03 / CANDIDATE SPACE', title: '候选空间有多大？', beginner: 'AI 的价值之一，是帮助研究员在巨大候选空间里先找到值得看的方向。', expert: 'Parameter: candidate space >10⁹ is a scale description from the PDF, not a count of validated materials.', outputLabel: '资料中的规模', output: '>10⁹ 可能性', status: 'FACT / PDF p2', annotation: '先展开，再逐步收缩', visual: 'space' },
    { key: 'workflow', kicker: '04 / AGENT WORKFLOW', title: 'AI 在每一步帮什么？', beginner: '它把资料、规划、生成、预测和优化串成一条工作流。', expert: 'Input → method → output: retrieval, planning, generation, prediction, optimization; experimental validation remains external.', outputLabel: '工作流', output: 'Knowledge → Planning → Generation → Prediction → Optimization', status: 'CONCEPTUAL WORKFLOW', annotation: '节点依次激活，信息沿工作流传递', visual: 'workflow' },
    { key: 'screening', kicker: '05 / CANDIDATE SCREENING', title: '候选如何被筛选？', beginner: '先有一批初始组合，再根据反馈留下更值得继续研究的配方。', expert: 'Evidence: 17 initial combinations → 11 optimized formulations in the S1-MatAgent result page.', outputLabel: '案例数量', output: '17 初始 → 11 优化', status: 'CASE RESULT / PDF p7', annotation: '数量变化来自 PDF 案例结果页', visual: 'screening' },
    { key: 'result', kicker: '06 / RESULT', title: '案例结果意味着什么？', beginner: '结果说明这条路线可以帮助研究员更有方向地探索，但不能代表所有材料都一样。', expert: 'Evidence: the PDF shows a best-result marker of -23.04; its complete physical meaning is not defined in the source page.', outputLabel: '案例结果', output: '-23.04（最佳结果标记）', status: 'CASE RESULT / PDF p7', annotation: '保留原始标记，不擅自补全单位和物理意义', visual: 'result' },
    { key: 'validation', kicker: '07 / VALIDATION', title: '为什么还需要实验？', beginner: '模型给的是建议，材料是否真的有效，要靠制备、表征和实验确认。', expert: 'Boundary: model prediction and computational result are hypotheses until synthesis, characterization and experimental validation.', outputLabel: '证据链', output: '建议 → 预测 → 计算 → 实验验证', status: 'EXPERIMENTAL VALIDATION', annotation: '把模型输出与实验事实分开', visual: 'validation' },
    { key: 'limitation', kicker: '08 / LIMITATIONS', title: '这套方法目前到哪里为止？', beginner: '资料明确的边界是：当前主要支持五元高熵合金设计，还有很多内容需要进一步验证。', expert: 'Boundary: current material states support for five-element HEA design; other systems and generalization require further evidence.', outputLabel: '适用边界', output: '主要支持五元高熵合金设计', status: 'BOUNDARY / PDF p6', annotation: '知道边界，才能正确理解结果', visual: 'limitation' }
  ]
};

function phase2EvidenceText(key) {
  const item = evidenceData[key];
  return item ? `${item.value} · ${item.label}\n状态：${item.status}\n案例：${item.case}\n来源：${item.source}\n${item.detail}` : '资料未说明';
}

function openPhase2Evidence(scope, key) {
  const item = evidenceData[key];
  if (!item) return;
  const panel = document.querySelector(`#${scope}-evidence-panel`);
  const title = document.querySelector(`#${scope}-evidence-title`);
  const detail = document.querySelector(`#${scope}-evidence-detail`);
  if (!panel || !title || !detail) return;
  title.textContent = `${item.value} · ${item.label}`;
  detail.textContent = phase2EvidenceText(key);
  panel.hidden = false;
  panel.classList.add('is-open');
}

function renderWorkflow(activeKey = 'knowledge') {
  const track = document.querySelector('#ai-workflow');
  if (!track) return;
  track.innerHTML = workflowData.steps.map((step, index) => `<button type="button" role="listitem" class="workflow-node${step.key === activeKey ? ' is-active' : ''}" data-workflow-step="${step.key}" aria-selected="${step.key === activeKey}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${step.label}</strong><small>${step.title}</small></button>${index < workflowData.steps.length - 1 ? '<i class="workflow-link" aria-hidden="true"></i>' : ''}`).join('');
  track.dataset.active = activeKey;
  track.querySelectorAll('[data-workflow-step]').forEach((button) => button.addEventListener('click', () => renderWorkflow(button.dataset.workflowStep)));
  const step = workflowData.steps.find((item) => item.key === activeKey) || workflowData.steps[0];
  const set = (selector, value) => { const node = document.querySelector(selector); if (node) node.textContent = value; };
  set('#ai-workflow-kicker', step.kicker); set('#ai-workflow-title', step.title); set('#ai-workflow-copy', step.output); set('#ai-workflow-beginner', step.beginner); set('#ai-workflow-expert', step.expert);
  const readout = document.querySelector('.workflow-readout'); if (readout) readout.dataset.status = step.status;
}

function renderSystemLadder() {
  const root = document.querySelector('#ai-system-ladder');
  if (!root) return;
  root.innerHTML = workflowData.systems.map((system, index) => `<button type="button" class="capability-row" data-system-key="${system.key}" aria-expanded="${index === 0}"><span class="capability-row__index">0${index + 1}</span><span class="capability-row__layer">${system.layer}</span><strong>${system.label}</strong><span class="capability-row__text">${system.text}</span><span class="capability-row__detail">${system.detail}<br /><em>边界：${system.boundary}</em></span><span class="capability-row__arrow">↘</span></button>`).join('');
  root.querySelectorAll('[data-system-key]').forEach((button) => button.addEventListener('click', () => {
    const active = button.classList.toggle('is-expanded');
    button.setAttribute('aria-expanded', String(active));
    root.querySelectorAll('[data-system-key]').forEach((item) => { if (item !== button) { item.classList.remove('is-expanded'); item.setAttribute('aria-expanded', 'false'); } });
  }));
}

function renderEvidenceMetrics(rootSelector, keys, scope) {
  const root = document.querySelector(rootSelector);
  if (!root) return;
  root.innerHTML = keys.map((key) => { const item = evidenceData[key]; return `<button type="button" class="evidence-metric" data-evidence-key="${key}" data-evidence-scope="${scope}"><span class="evidence-tag">${item.status}</span><strong>${item.value}</strong><span>${item.label}</span><small>${item.case}</small></button>`; }).join('');
  root.querySelectorAll('[data-evidence-key]').forEach((button) => button.addEventListener('click', () => openPhase2Evidence(button.dataset.evidenceScope, button.dataset.evidenceKey)));
}

function renderCaseStage(key = 'question') {
  const stage = caseData.stages.find((item) => item.key === key) || caseData.stages[0];
  const nav = document.querySelector('#case-stage-nav');
  if (nav) nav.querySelectorAll('[data-case-stage]').forEach((button) => { const active = button.dataset.caseStage === stage.key; button.classList.toggle('is-active', active); button.setAttribute('aria-selected', String(active)); });
  const set = (selector, value) => { const node = document.querySelector(selector); if (node) node.textContent = value; };
  set('#case-stage-kicker', stage.kicker); set('#case-stage-title', stage.title); set('#case-stage-beginner', stage.beginner); set('#case-stage-expert', stage.expert); set('#case-stage-output-label', stage.outputLabel); set('#case-stage-output', stage.output); set('#case-stage-status', stage.status); set('#case-visual-annotation', stage.annotation); set('#case-visual-symbol', stage.key === 'question' ? 'H₂' : stage.key === 'validation' ? '↔' : stage.key === 'limitation' ? '!' : 'AI');
  const visual = document.querySelector('#case-stage-visual'); if (visual) visual.dataset.stage = stage.visual;
  const body = document.querySelector('#case-study-v2'); if (body) body.dataset.activeStage = stage.key;
}

const caseCandidateStages = [
  { key: 'space', label: '巨大空间', count: '>10⁹', note: 'PDF 用于描述材料可能性的规模', visible: 64 },
  { key: 'initial', label: '初始组合', count: '17', note: 'S1-MatAgent 结果页明确展示', visible: 30 },
  { key: 'optimized', label: '优化配方', count: '11', note: 'S1-MatAgent 结果页明确展示', visible: 14 },
  { key: 'validation', label: '实验验证', count: '资料未说明', note: '不擅自推算验证数量', visible: 5 }
];
function renderCaseCandidates(activeKey = 'space') {
  const visual = document.querySelector('#case-candidate-visual'); const cloud = document.querySelector('#case-candidate-cloud'); const controls = document.querySelector('#case-candidate-controls');
  if (!visual || !cloud || !controls) return;
  if (!cloud.childElementCount) cloud.innerHTML = Array.from({ length: 64 }, (_, index) => `<i style="left:${(index * 37) % 97}%;top:${(index * 61) % 91}%"></i>`).join('');
  controls.innerHTML = caseCandidateStages.map((stage) => `<button type="button" data-case-candidate="${stage.key}" class="${stage.key === activeKey ? 'is-active' : ''}" aria-selected="${stage.key === activeKey}"><span>${stage.label}</span><strong>${stage.count}</strong></button>`).join('');
  visual.dataset.candidateStage = activeKey;
  const stage = caseCandidateStages.find((item) => item.key === activeKey) || caseCandidateStages[0];
  const label = document.querySelector('#case-candidate-label'); const count = document.querySelector('#case-candidate-count'); const note = document.querySelector('#case-candidate-note');
  if (label) label.textContent = stage.label; if (count) count.textContent = stage.count; if (note) note.textContent = stage.note;
  controls.querySelectorAll('[data-case-candidate]').forEach((button) => button.addEventListener('click', () => renderCaseCandidates(button.dataset.caseCandidate)));
}

function renderPhase2() {
  renderWorkflow(document.querySelector('#ai-workflow')?.dataset.active || 'knowledge');
  renderSystemLadder();
  renderEvidenceMetrics('#ai-evidence-metrics', ['scienceoneTools', 'scienceoneTokens', 'scienceoneData', 'matmindSpeed', 'matmindAccuracy', 'timeCompression'], 'ai');
  const caseNav = document.querySelector('#case-stage-nav');
  if (caseNav) {
    caseNav.innerHTML = caseData.stages.map((stage, index) => `<button type="button" data-case-stage="${stage.key}" aria-selected="${index === 0}"><span>0${index + 1}</span><strong>${stage.title}</strong></button>`).join('');
    caseNav.querySelectorAll('[data-case-stage]').forEach((button) => button.addEventListener('click', () => renderCaseStage(button.dataset.caseStage)));
  }
  renderCaseStage(document.querySelector('#case-study-v2')?.dataset.activeStage || 'question');
  renderCaseCandidates(document.querySelector('#case-candidate-visual')?.dataset.candidateStage || 'space');
  renderEvidenceMetrics('#case-evidence-metrics', ['unknownSpace', 's1Initial', 's1Optimized', 's1Best', 'limnConductivity', 'unclear277'], 'case');
  document.querySelectorAll('[data-close-evidence]').forEach((button) => button.addEventListener('click', () => { const panel = document.querySelector(`#${button.dataset.closeEvidence}-evidence-panel`); if (panel) { panel.hidden = true; panel.classList.remove('is-open'); } }));
}

if (modeToggle) modeToggle.addEventListener('click', () => { window.setTimeout(renderPhase2, 0); });
renderPhase2();

// Keep the public learning path focused on confirmed content. Boundary notes,
// unsupported placeholder metrics and limitation-only panels are removed from
// the rendered interface rather than shown as secondary disclaimers.
function sanitizeUnsupportedUi() {
  document.querySelectorAll('.boundary-note, .case-limitations').forEach((node) => node.remove());
  document.querySelectorAll('.capability-row__detail em').forEach((node) => node.remove());
  document.querySelectorAll('.expert-layer-grid details').forEach((detail) => {
    const summary = detail.querySelector('summary');
    if (summary && summary.textContent.includes('Limitations')) detail.remove();
  });
  document.querySelectorAll('[data-case-stage="limitation"], [data-case-candidate="validation"], [data-evidence-key="unclear277"]').forEach((node) => node.remove());
}
sanitizeUnsupportedUi();
document.addEventListener('click', (event) => {
  if (event.target.closest('#mode-toggle')) window.setTimeout(sanitizeUnsupportedUi, 0);
});

const expertData = {
  workflow: workflowData.steps.map(({ key, expert, status }) => ({ key, expert, status })),
  caseStages: caseData.stages.map(({ key, expert, status }) => ({ key, expert, status })),
  evidenceFields: ['Definition', 'Mechanism', 'Input', 'Process', 'Output', 'Evidence', 'Limitations', 'Source']
};

/* Scientific Workbench: a separate expert-mode product surface. */
const workbenchRoot = document.querySelector('#workbench-root');
const workbenchState = {
  materialStage: 'product',
  element: 'Ni',
  agentStep: 0,
  candidateStage: 'space',
  candidateFunnelState: 'idle',
  caseLane: 'prediction',
  dnaGoal: 'LIGHT'
};
let workbenchRunToken = 0;
let candidateFunnelRunToken = 0;

function syncWorkbenchDom() {
  document.querySelectorAll('.app-view').forEach((node) => {
    if (expertMode) {
      node.style.setProperty('display', 'none', 'important');
      node.style.setProperty('visibility', 'hidden', 'important');
      node.style.setProperty('opacity', '0', 'important');
      node.style.setProperty('pointer-events', 'none', 'important');
      node.setAttribute('aria-hidden', 'true');
    } else {
      node.style.removeProperty('display');
      node.style.removeProperty('visibility');
      node.style.removeProperty('opacity');
      node.style.removeProperty('pointer-events');
      node.setAttribute('aria-hidden', node.classList.contains('is-active') ? 'false' : 'true');
    }
  });
  if (workbenchRoot) {
    workbenchRoot.hidden = !expertMode;
    workbenchRoot.setAttribute('aria-hidden', String(!expertMode));
  }
}

const workbenchPipeline = {
  home: [['orientation', 'Research Question'], ['dna', 'Material DNA'], ['path', 'Learning Path']],
  material: [['product', 'Product'], ['material', 'Material'], ['structure', 'Structure'], ['atom', 'Atom']],
  process: [['goal', 'Research Question'], ['candidate', 'Candidate Space'], ['prediction', 'Prediction'], ['validation', 'Validation']],
  ai: [['question', 'Research Question'], ['candidate', 'Candidate Space'], ['generation', 'Generation'], ['prediction', 'Prediction'], ['optimization', 'Optimization'], ['validation', 'Validation']],
  case: [['question', 'Research Question'], ['candidate', 'Candidate Space'], ['generation', 'Generation'], ['prediction', 'Prediction'], ['optimization', 'Optimization'], ['validation', 'Validation']],
  sources: [['evidence', 'Evidence Index'], ['source', 'Source Map']]
};

const workbenchInspector = {
  home: { title: 'Material DNA', definition: '材料能力由组成、结构、工艺和应用共同决定。', mechanism: '目标性能反向约束材料设计路径。', input: '应用目标', process: 'Composition → Structure → Process → Properties', output: '可探索的材料路径', evidence: 'CONCEPTUAL', limitations: '概念示意不代表定量预测。', source: 'Platform learning path' },
  material: { title: 'Product → Material → Atom', definition: '产品性能最终与材料的微观组成和结构有关。', mechanism: '观察尺度逐步缩小，视觉对象从产品过渡到原子。', input: '产品选择', process: 'Product → Material → Structure → Atom', output: '当前观察层级', evidence: 'CONCEPTUAL', limitations: '视觉层级用于解释因果关系。', source: '材料学科基础章节' },
  process: { title: 'Composition → Structure → Performance', definition: '成分和制备路径共同影响材料结构与性能。', mechanism: '元素变化会改变概念结构，性能字段同步更新。', input: '元素选择', process: 'Composition → Structure → Performance', output: '概念趋势', evidence: 'CONCEPTUAL', limitations: '没有真实计算数据时不显示精确性能值。', source: '材料创制资料(1).pdf' },
  ai: { title: 'Agent Research Run', definition: 'AI 作为研究工作流，连接知识、任务、候选和验证。', mechanism: '检索、规划、生成、预测和优化逐步收缩搜索空间。', input: 'Research question', process: 'Retrieve → Plan → Generate → Predict → Optimize → Experiment', output: '下一步研究动作', evidence: 'MODEL PREDICTION', limitations: 'AI 输出不是实验验证结果。', source: '材料创制资料(1).pdf' },
  case: { title: 'Prediction → Experiment', definition: '模型预测与实验验证是两类不同证据。', mechanism: '候选排序先提出方向，制备和表征再确认结果。', input: 'Candidate structures', process: 'Ranking → Prediction → Synthesis → Characterization', output: '证据状态', evidence: 'CASE RESULT', limitations: '保留 PDF 原始标记，不补充未提供的单位。', source: '材料创制资料(1).pdf p7' },
  sources: { title: 'Evidence Index', definition: '每个重要数字都应能回到案例和来源页。', mechanism: '指标、案例、状态和页码组成可追溯链路。', input: 'Evidence data', process: 'Metric → Case → Source page', output: '可追溯证据', evidence: 'SOURCE', limitations: '没有来源的数据不会进入主界面。', source: '材料创制资料(1).pdf' }
};

function wbPipelineMarkup(view) {
  const items = workbenchPipeline[view] || workbenchPipeline.home;
  const funnelState = workbenchState.candidateFunnelState;
  const processActive = funnelState === 'validation' ? 'validation' : 'candidate';
  const activeKey = view === 'material' ? workbenchState.materialStage : view === 'ai' ? items[Math.min(workbenchState.agentStep, items.length - 1)]?.[0] : view === 'process' ? processActive : view === 'case' ? workbenchState.caseLane : items[0]?.[0];
  return `<div class="wb-pipeline-head"><span>RESEARCH PIPELINE</span><small>WORKBENCH</small></div><ol>${items.map((item, index) => `<li><button type="button" data-wb-pipeline="${item[0]}" class="${item[0] === activeKey ? 'is-active' : ''}"><span>0${index + 1}</span><strong>${item[1]}</strong><i></i></button></li>`).join('')}</ol>`;
}

function wbEvidenceTag(status) {
  return `<span class="wb-evidence-tag">${status}</span>`;
}

function wbMetric(key) {
  const item = evidenceData[key];
  if (!item) return '';
  return `<button type="button" class="wb-metric" data-wb-evidence="${key}">${wbEvidenceTag(item.status)}<strong>${item.value}</strong><small>${item.label}</small></button>`;
}

function wbMaterialCenter() {
  const stages = [
    ['product', 'PRODUCT', 'Phone / battery / chip'],
    ['material', 'MATERIAL', 'A material sample'],
    ['structure', 'MICROSTRUCTURE', 'Local arrangement'],
    ['atom', 'ATOM', 'Composition at a smaller scale']
  ];
  const active = workbenchState.materialStage;
  const current = stages.find((item) => item[0] === active) || stages[0];
  return `<div class="wb-section-kicker">SCIENTIFIC VISUALIZATION / 01</div><h1>从产品看到原子。</h1><p class="wb-lead">每点击一次，观察尺度缩小一层：产品 → 材料 → 微观结构 → 原子。</p><div class="wb-material-visual" data-wb-material-active="${active}"><div class="wb-material-layer wb-layer-product"><span>PHONE</span><b>◫</b></div><div class="wb-material-layer wb-layer-material"><span>MATERIAL</span><b></b></div><div class="wb-material-layer wb-layer-structure"><span>STRUCTURE</span><b></b><i></i><i></i><i></i></div><div class="wb-material-layer wb-layer-atom"><span>ATOM</span><b></b><i></i><i></i><i></i><i></i></div><div class="wb-visual-caption">CONCEPTUAL VISUALIZATION</div></div><div class="wb-step-readout"><span>0${stages.findIndex((item) => item[0] === active) + 1} / 04</span><strong>${current[1]}</strong><p>${current[2]}</p></div><div class="wb-step-controls">${stages.map((item) => `<button type="button" data-wb-material="${item[0]}" class="${item[0] === active ? 'is-active' : ''}"><span>${item[1]}</span><small>${item[2]}</small></button>`).join('')}</div>`;
}

function wbCompositionCenter() {
  const element = workbenchState.element;
  const copy = { Ni: 'backbone', Fe: 'magnetic / structural cue', Mo: 'active-site cue', Pt: 'noble-element cue' }[element] || 'composition cue';
  return `<div class="wb-section-kicker">SCIENTIFIC VISUALIZATION / 02</div><h1>成分改变，结构会怎样？</h1><p class="wb-lead">点击一个元素，观察概念结构和性能字段如何联动。</p><div class="wb-composition-grid"><div class="wb-composition-visual" data-wb-element="${element}"><div class="wb-alloy-core"><i></i><i></i><i></i><i></i><i></i><b>${element}</b></div><span class="wb-visual-caption">CONCEPTUAL VISUALIZATION</span></div><div class="wb-causal-readout"><div><span>COMPOSITION</span><strong>${element} selected</strong></div><div><span>STRUCTURE</span><strong>Local arrangement changes</strong></div><div><span>PERFORMANCE</span><strong>Potentially changes</strong></div><small>${copy}</small></div></div><div class="wb-element-controls">${['Ni', 'Fe', 'Mo', 'Pt'].map((item) => `<button type="button" data-wb-element="${item}" class="${item === element ? 'is-active' : ''}">${item}</button>`).join('')}</div>`;
}

function wbDnaCenter() {
  const goal = workbenchState.dnaGoal;
  return `<div class="wb-section-kicker">MATERIAL DNA / 00</div><h1>从目标性能反向寻找材料。</h1><p class="wb-lead">选择一个能力，观察材料创制链如何改变。</p><div class="wb-dna-chain">${['COMPOSITION', 'STRUCTURE', 'PROCESS', 'PROPERTIES', 'APPLICATION'].map((item, index) => `<div class="${index === 0 ? 'is-active' : ''}"><span>0${index + 1}</span><strong>${item}</strong><i></i></div>`).join('')}</div><div class="wb-goal-controls">${['LIGHT', 'STRONG', 'HEAT RESISTANT', 'HIGH EFFICIENCY'].map((item) => `<button type="button" data-wb-dna="${item}" class="${item === goal ? 'is-active' : ''}">${item}</button>`).join('')}</div><div class="wb-dna-note">Current target: <strong>${goal}</strong><span>CONCEPTUAL</span></div>`;
}

function wbAiCenter() {
  const steps = workflowData.steps.slice(0, 6);
  const active = Math.min(workbenchState.agentStep, steps.length - 1);
  const step = steps[active];
  return `<div class="wb-section-kicker">AGENT RESEARCH RUN / 05</div><h1>让 AI 跑一遍研究任务。</h1><p class="wb-lead">AI 不直接产生经过验证的材料，而是帮助研究员缩小搜索空间。</p><div class="wb-run-request"><span>RESEARCH REQUEST</span><strong>寻找更高效的析氢催化材料</strong><button type="button" data-wb-run>${workbenchState.agentStep === 0 ? '开始运行' : '继续运行'} <b>→</b></button></div><div class="wb-agent-steps">${steps.map((item, index) => `<button type="button" data-wb-agent-step="${index}" class="${index === active ? 'is-active' : index < active ? 'is-done' : ''}"><span>0${index + 1}</span><strong>${item.label}</strong><small>${item.title}</small></button>`).join('')}</div><div class="wb-agent-output"><div><span>INPUT</span><strong>${active === 0 ? 'Research question' : 'Question + previous output'}</strong></div><div><span>ACTION</span><strong>${step.title}</strong></div><div><span>OUTPUT</span><strong>${step.output}</strong></div></div><div class="wb-workflow-compare"><div><span>TRADITIONAL LOOP</span><strong>资料检索 → 人工规划 → 逐个试验</strong><small>候选空间大，反馈周期长。</small></div><div><span>AI-ASSISTED LOOP</span><strong>检索 → 规划 → 生成 → 预测 → 优化</strong><small>把更多时间留给科学判断与实验验证。</small></div></div><p class="wb-run-status">AI DID NOT PRODUCE A VERIFIED MATERIAL. <em>AI helped narrow the search space.</em></p>`;
}

function wbCaseCenter() {
  const lane = workbenchState.caseLane;
  return `<div class="wb-section-kicker">CASE RUN / S1-MATAGENT</div><h1>Prediction 和 Experiment 不是同一件事。</h1><p class="wb-lead">用同一条案例链路区分模型建议、计算结果和实验验证。</p><div class="wb-dual-lane"><button type="button" data-wb-lane="prediction" class="${lane === 'prediction' ? 'is-active' : ''}"><span>MODEL PREDICTION</span><strong>Candidate → Ranking → Prediction</strong><small>模型提出值得继续验证的方向。</small></button><div class="wb-lane-arrow">→</div><button type="button" data-wb-lane="validation" class="${lane === 'validation' ? 'is-active' : ''}"><span>EXPERIMENTAL VALIDATION</span><strong>Synthesis → Characterization → Validation</strong><small>制备和实验确认材料是否真正有效。</small></button></div><div class="wb-case-metrics">${wbMetric('s1Initial')}${wbMetric('s1Optimized')}${wbMetric('s1Best')}</div><div class="wb-case-note">S1-MatAgent / 高熵合金析氢催化剂 / 证据页 p7</div>`;
}

function wbLegacyCandidateCollapse() {
  const stages = [
    ['space', '>10⁹', '巨大候选空间', 'FACT', '材料组合与结构可能性的规模描述'],
    ['initial', '17', '初始组合', 'CASE RESULT', 'S1-MatAgent 结果页明确展示'],
    ['optimized', '11', '优化配方', 'CASE RESULT', 'S1-MatAgent 结果页明确展示'],
    ['validation', '资料未说明', '实验验证数量', 'SOURCE', '不在资料中补充验证数量']
  ];
  const active = stages.find((item) => item[0] === workbenchState.candidateStage) || stages[0];
  const particles = Array.from({ length: 48 }, (_, index) => `<i style="--x:${(index * 37) % 96}%;--y:${(index * 61) % 88}%;--d:${(index % 7) * 80}ms"></i>`).join('');
  return `<section class="wb-candidate-collapse"><div class="wb-candidate-head"><div><span class="wb-section-kicker">CANDIDATE SPACE / CONCEPTUAL</span><h2>让搜索空间逐步收缩。</h2><p>AI 的价值不是凭空给出答案，而是帮助研究人员更快找到值得验证的候选。</p></div>${wbEvidenceTag(active[3])}</div><div class="wb-candidate-visual" data-wb-candidate-active="${active[0]}"><div class="wb-particle-cloud">${particles}</div><strong>${active[1]}</strong><small>${active[2]}</small><em>CONCEPTUAL VISUALIZATION</em></div><div class="wb-candidate-controls">${stages.map((item) => `<button type="button" data-wb-candidate="${item[0]}" class="${item[0] === active[0] ? 'is-active' : ''}"><span>${item[1]}</span><small>${item[2]}</small></button>`).join('')}</div><p class="wb-candidate-note">${active[4]} · 每个数字都绑定 Evidence，不将概念动画当作真实计算。</p></section>`;
}

function candidateFunnelStateLabel(state) {
  return ({
    idle: ['>10⁹', 'Candidate Space', 'FACT', 'Start with the full conceptual search space.'],
    screening: ['>10⁹', 'Screening', 'FACT', 'Candidate filtering in progress.'],
    initial: ['17', '17 Initial Candidates', 'CASE RESULT', '17 initial combinations in the S1-MatAgent case.'],
    optimizing: ['17', 'Optimization', 'CASE RESULT', 'Candidates are being regrouped and ranked.'],
    optimized: ['11', '11 Optimized Candidates', 'CASE RESULT', '11 optimized formulations in the S1-MatAgent case.'],
    validation: ['11', 'Validation', 'PROCESS / CONCEPTUAL', 'Synthesis → Characterization → Experiment.']
  }[state] || ['>10⁹', 'Candidate Space', 'FACT', 'Start with the full conceptual search space.']);
}

function wbCandidateFunnel() {
  const state = workbenchState.candidateFunnelState || 'idle';
  const [value, label, status, note] = candidateFunnelStateLabel(state);
  const activeRail = state === 'screening' ? 'screening' : state === 'initial' ? 'initial' : ['optimizing'].includes(state) ? 'optimization' : ['optimized'].includes(state) ? 'optimized' : state === 'validation' ? 'validation' : 'space';
  const rail = [['space', 'SPACE'], ['screening', 'SCREENING'], ['initial', '17 INITIAL'], ['optimization', 'OPTIMIZATION'], ['optimized', '11 OPTIMIZED'], ['validation', 'VALIDATION']]
    .map(([key, text]) => `<span class="${key === activeRail ? 'is-active' : ''} ${railIndex(key) < railIndex(activeRail) ? 'is-complete' : ''}">${text}</span>`).join('');
  const nodeCount = ['initial', 'optimizing'].includes(state) ? 17 : ['optimized', 'validation'].includes(state) ? 11 : 36;
  const initialIds = Array.from({ length: 17 }, (_, index) => `C${String(index + 1).padStart(2, '0')}`);
  const optimizedIds = ['C01', 'C02', 'C04', 'C05', 'C07', 'C09', 'C11', 'C12', 'C14', 'C16', 'C17'];
  const visibleIds = ['initial', 'optimizing'].includes(state) ? initialIds : ['optimized', 'validation'].includes(state) ? optimizedIds : [];
  const nodes = Array.from({ length: nodeCount }, (_, index) => {
    const nodeId = visibleIds[index] || '';
    const muted = state === 'optimizing' && index >= 11;
    const focused = state === 'optimized' || state === 'validation' || (state === 'optimizing' && index < 11);
    return `<button type="button" class="wb-funnel-node${muted ? ' is-muted' : ''}${focused ? ' is-focused' : ''}${nodeId ? ' has-id' : ''}" style="--n:${index}" ${nodeId ? `data-wb-funnel-node="${nodeId}" aria-label="${nodeId} candidate"` : 'tabindex="-1" aria-hidden="true"'}>${nodeId ? `<span>${nodeId}</span>` : ''}</button>`;
  }).join('');
  const actions = { idle: ['START SCREENING', 'start'], screening: ['SCREENING…', 'busy'], initial: ['OPTIMIZE CANDIDATES', 'optimize'], optimizing: ['OPTIMIZING…', 'busy'], optimized: ['PREPARE VALIDATION', 'validation'], validation: ['RESET FUNNEL', 'reset'] }[state];
  const validation = state === 'validation' ? `<div class="wb-validation-chain"><div><span>11 CANDIDATES</span><strong>Selected candidates</strong></div><i>↓</i><div><span>SYNTHESIS</span><strong>Prepare material</strong></div><i>↓</i><div><span>CHARACTERIZATION</span><strong>Measure structure and properties</strong></div><i>↓</i><div><span>EXPERIMENT</span><strong>Verify the hypothesis</strong></div></div>` : '';
  const sourceKey = state === 'idle' || state === 'screening' ? 'unknownSpace' : state === 'initial' ? 's1Initial' : state === 'optimizing' || state === 'optimized' ? 's1Optimized' : null;
  return `<section class="wb-candidate-funnel" data-funnel-state="${state}"><div class="wb-funnel-heading"><div><span class="wb-section-kicker">MATERIAL DISCOVERY FUNNEL</span><h2>From a vast search space to candidates worth validating.</h2><p>AI narrows the search space; it does not turn a hypothesis into a verified material.</p></div><span class="wb-visual-caption">CONCEPTUAL VISUALIZATION</span></div><div class="wb-funnel-stage-rail" aria-label="Funnel progress">${rail}</div><div class="wb-funnel-source"><span>CANDIDATE SPACE</span><strong>${value}</strong>${sourceKey ? `<button type="button" data-wb-evidence="${sourceKey}">${wbEvidenceTag(status)}</button>` : wbEvidenceTag(status)}<small>${label}</small></div><div class="wb-funnel-graphic"><div class="wb-funnel-inlet" aria-hidden="true"></div><div class="wb-funnel-body"><div class="wb-funnel-node-grid">${nodes}</div><div class="wb-funnel-center"><strong>${value}</strong><span>${label}</span></div></div><div class="wb-funnel-outlet" aria-hidden="true"></div></div><div class="wb-funnel-action-row"><button type="button" class="wb-funnel-action" data-wb-funnel-action="${actions[1]}" ${actions[1] === 'busy' ? 'disabled' : ''}>${actions[0]} <b>→</b></button><span>${note}</span></div>${validation}<p class="wb-funnel-footnote">AI DOES NOT REPLACE EXPERIMENTS. It helps researchers decide what to test next. <em>MODEL PREDICTION ≠ EXPERIMENTAL VALIDATION</em></p></section>`;
}

function railIndex(key) {
  return ['space', 'screening', 'initial', 'optimization', 'optimized', 'validation'].indexOf(key);
}

function setCandidateFunnelState(state, view) {
  workbenchState.candidateFunnelState = state;
  workbenchState.candidateStage = state === 'validation' ? 'validation' : state === 'optimized' ? 'optimized' : state === 'initial' ? 'initial' : 'space';
  renderWorkbench(view);
  window.requestAnimationFrame(() => {
    const host = workbenchRoot?.parentElement;
    const funnel = workbenchRoot?.querySelector('.wb-candidate-funnel');
    if (!host || !funnel) return;
    // Keep the complete funnel chapter in view after an action click. This
    // avoids the browser's default focus scrolling to the bottom button and
    // hiding the heading that explains the state transition.
    host.scrollTop = Math.max(0, funnel.offsetTop - 24);
  });
}

function runCandidateFunnel(action, view) {
  const token = ++candidateFunnelRunToken;
  if (action === 'reset') { setCandidateFunnelState('idle', view); return; }
  if (action === 'start' && workbenchState.candidateFunnelState === 'idle') {
    setCandidateFunnelState('screening', view);
    window.setTimeout(() => { if (token === candidateFunnelRunToken) setCandidateFunnelState('initial', view); }, 900);
  } else if (action === 'optimize' && workbenchState.candidateFunnelState === 'initial') {
    setCandidateFunnelState('optimizing', view);
    window.setTimeout(() => { if (token === candidateFunnelRunToken) setCandidateFunnelState('optimized', view); }, 980);
  } else if (action === 'validation' && workbenchState.candidateFunnelState === 'optimized') {
    setCandidateFunnelState('validation', view);
  }
}

function wbProcessCenter() {
  return `<div class="wb-section-kicker">RESEARCH DESIGN / 03</div><h1>把目标变成可验证的路径。</h1><p class="wb-lead">在工作台中查看目标、候选、预测和验证之间的关系。</p><div class="wb-process-flow"><div>GOAL<strong>目标函数</strong></div><i>→</i><div>CANDIDATE<strong>候选组合</strong></div><i>→</i><div>PREDICTION<strong>优先级</strong></div><i>→</i><div>VALIDATION<strong>实验反馈</strong></div></div>${wbCandidateCollapse()}<div class="wb-process-evidence">${wbMetric('unknownSpace')}${wbMetric('timeCompression')}${wbMetric('limnEfficiency')}</div>`;
}

// Override the legacy process renderer with the stateful funnel renderer.
function wbProcessCenter() {
  return `<div class="wb-section-kicker">RESEARCH DESIGN / 03</div><h1>Turn a research goal into a testable path.</h1><p class="wb-lead">The funnel makes the causal sequence visible: search space → screening → optimization → validation.</p><div class="wb-process-flow"><div>GOAL<strong>Target property</strong></div><i>→</i><div>CANDIDATE<strong>Composition set</strong></div><i>→</i><div>PREDICTION<strong>Priority ranking</strong></div><i>→</i><div>VALIDATION<strong>Experimental feedback</strong></div></div>${wbCandidateFunnel()}<div class="wb-process-evidence">${wbMetric('unknownSpace')}${wbMetric('timeCompression')}${wbMetric('limnEfficiency')}</div>`;
}

function wbSourcesCenter() {
  return `<div class="wb-section-kicker">SOURCE MAP / 07</div><h1>把每个数字放回它的来源。</h1><p class="wb-lead">专家模式将指标、案例和 PDF 页码放在同一个可追溯界面中。</p><div class="wb-source-grid">${['scienceoneTools', 'scienceoneTokens', 'scienceoneData', 'matmindSpeed', 'matmindAccuracy', 'limnConductivity', 's1Initial', 's1Optimized'].map(wbMetric).join('')}</div>`;
}

function wbCenter(view) {
  if (view === 'material') return `${wbMaterialCenter()}<section class="wb-composition-inline">${wbCompositionCenter()}</section>`;
  if (view === 'process') return wbProcessCenter();
  if (view === 'ai') return `${wbAiCenter()}${agentTaskWorkbenchMarkup()}`;
  if (view === 'case') return wbCaseCenter();
  if (view === 'sources') return wbSourcesCenter();
  return wbDnaCenter();
}

function wbInspectorMarkup(view) {
  const info = workbenchInspector[view] || workbenchInspector.home;
  const fields = [['Definition', info.definition], ['Mechanism', info.mechanism], ['Input', info.input], ['Process', info.process], ['Output', info.output], ['Evidence', info.evidence], ['Limitations', info.limitations], ['Source', info.source]];
  return `<div class="wb-inspector-head"><span>EVIDENCE INSPECTOR</span><small>${info.title}</small></div><div class="wb-inspector-fields">${fields.map((field, index) => `<details ${index < 2 ? 'open' : ''}><summary>${field[0]}<b>+</b></summary><p>${field[1]}</p></details>`).join('')}</div>`;
}

function showWorkbenchEvidence(key) {
  const item = evidenceData[key];
  const inspector = workbenchRoot?.querySelector('.wb-inspector');
  if (!item || !inspector) return;
  inspector.querySelector('.wb-evidence-callout')?.remove();
  inspector.insertAdjacentHTML('afterbegin', `<div class="wb-evidence-callout"><span>EVIDENCE SELECTED</span><strong>${item.value}</strong><b>${item.status}</b><p>${item.label}<br />${item.case}</p><small>${item.source}</small></div>`);
}

function renderWorkbench(view = window.location.hash.slice(1) || 'home') {
  if (!workbenchRoot) return;
  syncWorkbenchDom();
  if (!expertMode) {
    return;
  }
  const scrollHost = workbenchRoot.parentElement;
  const previousScrollTop = scrollHost?.scrollTop || 0;
  const activeView = viewTitles[view] ? view : 'home';
  workbenchRoot.hidden = false;
  workbenchRoot.setAttribute('aria-hidden', 'false');
  workbenchRoot.innerHTML = `<section class="workbench-shell" data-wb-view="${activeView}"><header class="wb-topbar"><div><span class="wb-mode-label">SCIENTIFIC WORKBENCH</span><strong>${viewTitles[activeView]}</strong></div><span class="wb-live-status"><i></i> ANALYSIS READY</span></header><div class="wb-grid"><aside class="wb-pipeline">${wbPipelineMarkup(activeView)}</aside><main class="wb-stage">${wbCenter(activeView)}</main><aside class="wb-inspector">${wbInspectorMarkup(activeView)}</aside></div></section>`;
  bindWorkbench(activeView);
  // Workbench views are re-rendered after every expert interaction. Normalize
  // the newly inserted text here so the expert surface never falls back to
  // the legacy bilingual labels used by the older data model.
  normalizeProductLanguage();
  // Replacing the workbench DOM can make the browser scroll the focused
  // action back into view. Keep the user's reading position stable instead of
  // making every funnel transition feel like a jump to a different page.
  if (scrollHost) scrollHost.scrollTop = previousScrollTop;
}

function bindWorkbench(view) {
  workbenchRoot.querySelectorAll('[data-wb-material]').forEach((button) => button.addEventListener('click', () => { workbenchState.materialStage = button.dataset.wbMaterial; renderWorkbench(view); }));
  workbenchRoot.querySelectorAll('[data-wb-element]').forEach((button) => button.addEventListener('click', () => { workbenchState.element = button.dataset.wbElement; renderWorkbench(view); }));
  workbenchRoot.querySelectorAll('[data-wb-dna]').forEach((button) => button.addEventListener('click', () => { workbenchState.dnaGoal = button.dataset.wbDna; renderWorkbench(view); }));
  workbenchRoot.querySelectorAll('[data-wb-lane]').forEach((button) => button.addEventListener('click', () => { workbenchState.caseLane = button.dataset.wbLane; renderWorkbench(view); }));
  workbenchRoot.querySelectorAll('[data-wb-agent-step]').forEach((button) => button.addEventListener('click', () => { workbenchState.agentStep = Number(button.dataset.wbAgentStep); renderWorkbench(view); }));
  workbenchRoot.querySelectorAll('[data-wb-candidate]').forEach((button) => button.addEventListener('click', () => { workbenchState.candidateStage = button.dataset.wbCandidate; renderWorkbench(view); }));
  workbenchRoot.querySelectorAll('[data-wb-funnel-action]').forEach((button) => button.addEventListener('click', () => runCandidateFunnel(button.dataset.wbFunnelAction, view)));
  workbenchRoot.querySelectorAll('[data-wb-funnel-node]').forEach((button) => button.addEventListener('click', () => {
    workbenchRoot.querySelector('.wb-funnel-node-note')?.remove();
    button.closest('.wb-candidate-funnel')?.insertAdjacentHTML('beforeend', `<div class="wb-funnel-node-note"><span>CONCEPTUAL FILTERING</span><strong>${button.dataset.wbFunnelNode} remains in the working set.</strong><small>Its status is a case-stage marker, not a verified material result.</small></div>`);
  }));
  workbenchRoot.querySelectorAll('[data-wb-run]').forEach((button) => button.addEventListener('click', () => runWorkbenchAgent(view)));
  workbenchRoot.querySelectorAll('[data-wb-evidence]').forEach((button) => button.addEventListener('click', () => showWorkbenchEvidence(button.dataset.wbEvidence)));
  workbenchRoot.querySelectorAll('[data-wb-pipeline]').forEach((button) => button.addEventListener('click', () => {
    workbenchRoot.querySelectorAll('[data-wb-pipeline]').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const stage = button.dataset.wbPipeline;
    if (view === 'material' && ['product', 'material', 'structure', 'atom'].includes(stage)) { workbenchState.materialStage = stage; renderWorkbench(view); }
    if (view === 'process' && stage === 'candidate') { workbenchState.candidateFunnelState = 'idle'; renderWorkbench(view); }
    if (view === 'process' && stage === 'validation') { workbenchState.candidateFunnelState = 'validation'; renderWorkbench(view); }
    if (view === 'ai' && stage === 'validation') { workbenchState.agentStep = 5; renderWorkbench(view); }
  }));
}

function runWorkbenchAgent(view) {
  const token = ++workbenchRunToken;
  workbenchState.agentStep = 0;
  renderWorkbench(view);
  const tick = () => {
    if (token !== workbenchRunToken || !expertMode) return;
    if (workbenchState.agentStep >= 5) return;
    workbenchState.agentStep += 1;
    renderWorkbench(view);
    window.setTimeout(tick, 680);
  };
  window.setTimeout(tick, 680);
}

function renderWorkbenchCurrentView() {
  syncWorkbenchDom();
  if (expertMode) renderWorkbench(window.location.hash.slice(1) || 'home');
}

modeToggle.addEventListener('click', () => {
  document.body.classList.add('mode-transitioning');
  // 先完成工作台渲染，再结束短暂过渡，避免隐藏主视图后出现空白帧
  renderWorkbenchCurrentView();
  window.requestAnimationFrame(() => document.body.classList.remove('mode-transitioning'));
});
document.addEventListener('click', (event) => {
  if (event.target.closest('[data-view-link], [data-open-view]')) window.setTimeout(renderWorkbenchCurrentView, 0);
});
window.addEventListener('popstate', () => window.setTimeout(renderWorkbenchCurrentView, 0));
renderWorkbenchCurrentView();

/* Agent product layer: one task state shared by the exhibition and workbench. */
const agentTaskStorageKey = 'material-agent-task-v2';
const agentTaskDefaults = {
  stage: 'intake',
  modalStep: 1,
  goal: '',
  priorities: { performance: 70, cost: 50, speed: 50, manufacturability: 50, impact: 40 },
  constraints: [],
  questions: [],
  activeStep: 0,
  selectedCandidate: null,
  reportSaved: false,
  runToken: 0
};
let agentTask = { ...agentTaskDefaults };
try {
  const storedAgentTask = JSON.parse(window.localStorage.getItem(agentTaskStorageKey) || 'null');
  if (storedAgentTask && typeof storedAgentTask === 'object') agentTask = { ...agentTaskDefaults, ...storedAgentTask, priorities: { ...agentTaskDefaults.priorities, ...(storedAgentTask.priorities || {}) } };
} catch (error) { /* localStorage is optional */ }

function persistAgentTask() {
  try { window.localStorage.setItem(agentTaskStorageKey, JSON.stringify(agentTask)); } catch (error) { /* storage may be unavailable */ }
}

const agentGoalOptions = [
  ['lighter', '让材料更轻', '降低重量，同时保留应用所需的功能'],
  ['stronger', '让材料更强韧', '提升强度与韧性，应对更苛刻的使用环境'],
  ['battery', '让电池容量更高', '探索可能支持更高容量的材料方向'],
  ['catalyst', '让催化反应更高效', '探索适用于析氢反应的催化材料方向'],
  ['heat', '让材料更耐热', '让材料在高温环境中保持稳定功能'],
  ['custom', '输入我的研究问题', '从你自己的材料问题开始']
];
const agentWorkflowSteps = [
  ['clarify', '理解需求', '把日常语言中的目标转化为可研究的条件'],
  ['retrieve', '检索知识', '寻找相关材料、机理和可用证据'],
  ['generate', '生成候选', '在已有约束下形成候选材料集合'],
  ['predict', '预测性能', '比较候选潜力，预测结果仍需验证'],
  ['recommend', '推荐实验', '选择下一步值得合成和测量的对象'],
  ['report', '形成报告', '汇总推理、候选、证据和下一步行动']
];

function agentGoalLabel(key) { return agentGoalOptions.find((item) => item[0] === key)?.[1] || '材料研究问题'; }
function agentTaskSummary() {
  const goal = agentGoalLabel(agentTask.goal);
  const constraintLabels = { budget: '控制成本', 'fast validation': '快速验证', 'known elements only': '仅使用已知元素', 'scalable process': '可规模化制备' };
  const constraints = agentTask.constraints.length ? agentTask.constraints.map((item) => constraintLabels[item] || item).join('、') : '具体条件仍待澄清';
  return `${goal}，并优先考虑${constraints}`;
}

function agentTaskModalMarkup() {
  const step = agentTask.modalStep;
  const goalButtons = agentGoalOptions.map(([key, label, note]) => `<button type="button" class="agent-choice${agentTask.goal === key ? ' is-selected' : ''}" data-task-goal="${key}"><strong>${label}</strong><small>${note}</small></button>`).join('');
  const priorityNames = { performance: '性能', cost: '成本', speed: '研发速度', manufacturability: '可制造性', impact: '环境影响' };
  const priorityRows = Object.entries(agentTask.priorities).map(([key, value]) => `<label class="agent-priority"><span>${priorityNames[key] || key}</span><input type="range" min="0" max="100" value="${value}" data-task-priority="${key}"><output>${value}</output></label>`).join('');
  const constraintNames = { budget: '控制成本', 'fast validation': '快速验证', 'known elements only': '仅使用已知元素', 'scalable process': '可规模化制备' };
  const constraintButtons = Object.entries(constraintNames).map(([key, label]) => `<button type="button" class="agent-constraint${agentTask.constraints.includes(key) ? ' is-selected' : ''}" data-task-constraint="${key}">${label}</button>`).join('');
  const summary = `<div class="agent-task-summary"><span>当前任务摘要</span><strong>${agentTaskSummary()}</strong><small>缺失的信息会保持可见，Agent 会先提问再给出建议</small><div class="agent-missing"><b>仍需澄清</b><span>${agentTask.goal ? '材料体系和验证条件' : '研发目标、材料体系和验证条件'}</span></div></div>`;
  return `<div class="agent-task-modal" role="dialog" aria-modal="true" aria-labelledby="agent-task-title"><div class="agent-task-modal__sheet"><button type="button" class="agent-modal-close" data-close-task aria-label="关闭">×</button><div class="agent-modal-step"><span>第 ${String(step).padStart(2, '0')} 步 / 共 03 步</span><i style="--progress:${step * 33.33}%"></i></div>${step === 1 ? `<p class="agent-kicker">创建材料创制任务</p><h2 id="agent-task-title">你想解决什么问题</h2><p class="agent-modal-lead">先选择一个熟悉的目标，后续再补充专业条件</p><div class="agent-choice-grid">${goalButtons}</div><div class="agent-modal-actions"><button type="button" class="agent-primary" data-task-next ${agentTask.goal ? '' : 'disabled'}>继续 <span>→</span></button></div>` : step === 2 ? `<p class="agent-kicker">设置性能取舍</p><h2 id="agent-task-title">你最在意什么</h2><p class="agent-modal-lead">这些选择用于指导搜索方向，不代表实际测量结果</p><div class="agent-priority-list">${priorityRows}</div><div class="agent-constraint-list">${constraintButtons}</div><div class="agent-modal-actions"><button type="button" class="agent-ghost" data-task-back>返回</button><button type="button" class="agent-primary" data-task-next>检查任务 <span>→</span></button></div>` : `<p class="agent-kicker">确认任务</p><h2 id="agent-task-title">准备开始智能分析</h2>${summary}<div class="agent-modal-actions"><button type="button" class="agent-ghost" data-task-back>返回</button><button type="button" class="agent-primary" data-task-start>开始分析 <span>→</span></button></div>`}</div></div>`;
}

function openAgentTaskModal() {
  let modal = document.querySelector('.agent-task-modal');
  if (!modal) { document.body.insertAdjacentHTML('beforeend', agentTaskModalMarkup()); modal = document.querySelector('.agent-task-modal'); }
  modal.outerHTML = agentTaskModalMarkup();
  document.body.classList.add('agent-modal-open');
}

function closeAgentTaskModal() { document.querySelector('.agent-task-modal')?.remove(); document.body.classList.remove('agent-modal-open'); }

function updateAgentTask(patch) { agentTask = { ...agentTask, ...patch }; persistAgentTask(); }

function beginAgentRun() {
  updateAgentTask({ stage: 'running', activeStep: 0, reportSaved: false, runToken: agentTask.runToken + 1 });
  closeAgentTaskModal();
  if (typeof showView === 'function') showView('ai');
  renderAgentSurfaces();
  const token = agentTask.runToken;
  const advance = () => {
    if (agentTask.runToken !== token || agentTask.activeStep >= agentWorkflowSteps.length - 1) return;
    updateAgentTask({ activeStep: agentTask.activeStep + 1 });
    renderAgentSurfaces();
    window.setTimeout(advance, 760);
  };
  window.setTimeout(advance, 760);
}

function agentCandidatesMarkup() {
  const selected = agentTask.selectedCandidate;
  const candidates = [
    ['A01', '候选体系 A', '性能潜力较高', '模型预测', '与当前性能目标匹配较好，仍需验证稳定性'],
    ['B04', '候选体系 B', '综合取舍均衡', '交互示意', '同时兼顾成本与可制造性'],
    ['C07', '候选体系 C', '需要更多证据', '模型预测', '假设具有潜力，但验证条件仍需补充']
  ];
  return candidates.map(([id, name, fit, status, reason]) => `<button type="button" class="agent-candidate${selected === id ? ' is-selected' : ''}" data-agent-candidate="${id}"><span>${id}</span><strong>${name}</strong><em>${fit}</em><small>${status}</small><p>${reason}</p></button>`).join('');
}

function agentBeginnerWorkspaceMarkup() {
  const active = Math.min(agentTask.activeStep, agentWorkflowSteps.length - 1);
  const step = agentWorkflowSteps[active];
  const isRunning = agentTask.stage === 'running';
  return `<section class="agent-ai-surface shell" data-agent-surface="beginner"><header class="agent-ai-header"><div><span class="agent-kicker">材料智能研究伙伴</span><h2>${agentTask.goal ? agentGoalLabel(agentTask.goal) : '从一个真实材料问题开始'}</h2><p>${agentTask.goal ? agentTaskSummary() : '告诉 Agent 你希望材料完成什么任务，它会帮助你定义目标、比较候选并规划验证'}</p></div><button type="button" class="agent-secondary" data-open-task>${agentTask.goal ? '调整任务' : '创建任务'} <span>↗</span></button></header><div class="agent-ai-grid"><aside class="agent-research-rail"><span>研究路径</span><ol>${agentWorkflowSteps.map((item, index) => `<li class="${index === active ? 'is-active' : index < active ? 'is-done' : ''}"><b>0${index + 1}</b><div><strong>${item[1]}</strong><small>${index <= active ? item[2] : '等待上一步完成'}</small></div></li>`).join('')}</ol></aside><main class="agent-run-stage"><div class="agent-run-status"><span>${isRunning ? 'Agent 正在分析' : '等待你的下一步决定'}</span><strong>${step[1]}</strong><small>${step[2]}</small></div>${active >= 2 ? `<div class="agent-candidate-grid">${agentCandidatesMarkup()}</div>` : `<div class="agent-explanation"><div class="agent-explanation-visual"><i></i><i></i><i></i><strong>${active + 1}</strong></div><p>${active === 0 ? '先把日常语言中的愿望整理成明确的研究任务' : active === 1 ? 'Agent 正在把问题连接到材料知识和相关证据' : 'Agent 正在缩小巨大的候选空间'}</p></div>`}<div class="agent-run-controls"><button type="button" class="agent-primary" data-agent-run ${isRunning ? 'disabled' : ''}>${active >= agentWorkflowSteps.length - 1 ? '重新分析' : isRunning ? '分析中' : '继续分析'} <span>→</span></button><button type="button" class="agent-ghost" data-agent-ask>请 Agent 澄清</button></div></main><aside class="agent-result-panel"><span>Agent 解释</span><h3>${selectedCandidateTitle()}</h3><p>${selectedCandidateReason()}</p><div class="agent-result-list"><div><b>当前状态</b><strong>${selectedCandidateStatus()}</strong></div><div><b>下一步行动</b><strong>${agentTask.selectedCandidate ? '选择实验条件' : '选择一个候选查看详情'}</strong></div></div><button type="button" class="agent-ghost" data-agent-save-report>${agentTask.reportSaved ? '报告已保存 ✓' : '保存研究报告'}</button></aside></div></section>`;
}

function selectedCandidateTitle() { return agentTask.selectedCandidate ? `候选 ${agentTask.selectedCandidate}` : '尚未选择候选'; }
function selectedCandidateReason() { return agentTask.selectedCandidate ? '这是一个工作假设，Agent 可以解释取舍，但仍需合成与表征验证' : '选择一个候选后，可查看它为什么被保留，以及下一步应该验证什么'; }
function selectedCandidateStatus() { return agentTask.selectedCandidate ? '模型预测 待实验验证' : '等待输入'; }

function agentTaskWorkbenchMarkup() {
  return `<section class="agent-workbench-task" data-agent-surface="expert"><div class="agent-workbench-task__head"><div><span class="wb-section-kicker">ACTIVE RESEARCH TASK</span><h2>${agentTask.goal ? agentGoalLabel(agentTask.goal) : 'No active task yet'}</h2><p>${agentTask.goal ? agentTaskSummary() : 'Start a task from the product home to populate this workbench.'}</p></div><button type="button" class="wb-funnel-action" data-open-task>${agentTask.goal ? 'REFINE TASK' : 'CREATE TASK'} →</button></div><div class="agent-workbench-task__state"><span>STATE</span><strong>${agentTask.stage.toUpperCase()}</strong><span>STEP</span><strong>${String(Math.min(agentTask.activeStep + 1, agentWorkflowSteps.length)).padStart(2, '0')} / 06</strong><span>CONFIDENCE</span><strong>${agentTask.selectedCandidate ? 'WORKING HYPOTHESIS' : 'NOT SET'}</strong></div></section>`;
}

function ensureAgentProductSurfaces() {
  const home = document.querySelector('#view-home');
  if (home && !home.querySelector('.agent-home-product')) {
    const legacyHero = home.querySelector('.hero');
    const legacyContext = home.querySelector('.learning-context');
    legacyHero?.classList.add('agent-legacy-home');
    legacyContext?.classList.add('agent-legacy-home');
    home.insertAdjacentHTML('afterbegin', `<section class="agent-home-product shell"><div class="agent-home-product__intro"><span class="agent-kicker">MATERIAL INTELLIGENCE AGENT</span><h1>Turn a material question<br /><em>into a verifiable research path.</em></h1><p>Start from a real-world need. The Agent helps define the goal, find candidate materials, explain trade-offs and plan the next experiment.</p><div class="agent-home-actions"><button type="button" class="agent-primary" data-open-task>Start my creation task <span>→</span></button><button type="button" class="agent-secondary" data-open-view="material">Explore materials <span>↗</span></button></div></div><div class="agent-task-preview"><div class="agent-task-preview__head"><span>LIVE TASK PREVIEW</span><b>ANALYSIS READY</b></div><ol><li class="is-active"><b>01</b><div><strong>Target</strong><span>Make a battery last longer</span></div></li><li><b>02</b><div><strong>Constraints</strong><span>Cost · speed · manufacturability</span></div></li><li><b>03</b><div><strong>Candidate space</strong><span>AI narrows the possibilities</span></div></li><li><b>04</b><div><strong>Next experiment</strong><span>Validate the leading hypothesis</span></div></li></ol><div class="agent-task-preview__note">Click any step to see what the Agent is doing.</div></div><div class="agent-home-goals"><span>CHOOSE A RESEARCH DIRECTION</span>${agentGoalOptions.slice(0, 5).map(([key, label]) => `<button type="button" data-open-task data-prefill-goal="${key}">${label}</button>`).join('')}</div></section>`);
  }
  const ai = document.querySelector('#view-ai');
  if (ai && !ai.querySelector('.agent-ai-surface')) {
    ai.querySelector('.ai-section')?.classList.add('agent-legacy-ai');
    ai.insertAdjacentHTML('afterbegin', '<div id="agent-ai-mount"></div>');
  }
  renderAgentSurfaces();
}

function renderAgentSurfaces() {
  const mount = document.querySelector('#agent-ai-mount');
  if (mount) mount.innerHTML = agentBeginnerWorkspaceMarkup();
  const expertTask = document.querySelector('.agent-workbench-task');
  if (expertTask) expertTask.outerHTML = agentTaskWorkbenchMarkup();
  normalizeProductLanguage();
}

/* Keep the shared chrome and legacy exhibition controls readable while the
   older data model is migrated incrementally. New product surfaces remain
   English-first; this pass only touches visible labels and never changes PDF
   evidence values. */
function normalizeProductLanguage() {
  const setText = (selector, value) => document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
  const nav = { home: 'HOME', material: 'MATERIALS', process: 'CREATION PATH', ai: 'AGENT', case: 'CASE STUDY' };
  Object.entries(nav).forEach(([view, label]) => document.querySelectorAll(`[data-view-link="${view}"]`).forEach((node) => { if (node.closest('.main-nav')) node.textContent = label; }));
  setText('#mode-toggle span:first-child', 'BEGINNER');
  setText('#mode-toggle span:last-child', 'EXPERT');
  setText('#mode-status', expertMode ? 'EXPERT MODE · INSPECT THE EVIDENCE' : 'BEGINNER MODE · FOLLOW THE EXHIBIT');
  setText('#header-progress', 'LEARNING 01 / 05');
  document.documentElement.lang = 'en';
  const replacements = [
    ['材料创制', 'Material Discovery'], ['认识材料', 'Material Fundamentals'], ['真实案例', 'Real Case'], ['先提出问题', 'Start with a question'], ['再反推材料', 'Work back to a material'], ['材料创制难点', 'Why discovery is hard'], ['级候选空间', 'candidate search space'], ['制备工艺对时间与顺序敏感', 'Processing changes the outcome'], ['创制流程进度', 'Creation path progress'], ['材料创制五步流程', 'Five-step creation path'], ['先说清楚想要什么', 'Define what you need'], ['你应该记住', 'TAKEAWAY'], ['目标', 'Target'], ['候选', 'Candidates'], ['预测', 'Prediction'], ['性能', 'Performance'], ['应用', 'Application'], ['组成', 'Composition'], ['结构', 'Structure'], ['制备', 'Processing'], ['实验确认', 'Test in the lab'],
    ['逆向设计', 'INVERSE DESIGN'], ['先提出问题，再反推材料。', 'Start with a question. Work back to a material.'],
    ['材料创制不只依赖反复试错。研究者可以先定义目标性能，再逐步寻找更有可能的材料方案。', 'Material discovery does not have to rely on endless trial and error. Define the target first, then compare possible routes.'],
    ['以“设计更高效的析氢催化剂”为例', 'Example: designing a more efficient hydrogen-evolution catalyst'],
    ['点击步骤查看因果', 'Select a step to see the cause and effect'], ['设定目标', 'Define the target'], ['生成候选', 'Generate candidates'], ['高通量筛选', 'Screen candidates'], ['制备验证', 'Prepare and validate'], ['迭代优化', 'Iterate and improve'],
    ['更低的析氢过电位', 'Lower hydrogen-evolution overpotential'], ['提出元素组合与比例', 'Propose elements and ratios'], ['预测并排除低潜力方案', 'Predict and remove low-potential options'], ['在实验中验证性能', 'Test performance experimentally'], ['用结果继续改进', 'Use results to improve the next round'],
    ['把“想要更好”说清楚。', 'Make the goal measurable.'], ['例如“更高效”会被转成可以比较的指标，系统才知道要往哪里找。', 'A goal such as “more efficient” becomes a measurable target so the search has direction.'], ['输入', 'INPUT'], ['想解决的问题', 'The question to solve'],
    ['候选空间收缩概念示意', 'Candidate-space concept'], ['候选空间如何一步步收缩？', 'How does the candidate space narrow?'], ['AI 的价值不是凭空给出答案，而是帮助研究人员更快探索巨大的候选空间。', 'AI does not conjure an answer. It helps researchers explore a huge candidate space faster.'],
    ['大量候选', 'Many possibilities'], ['探索空间', 'Search space'], ['初步筛选', 'First screening'], ['快速排队', 'Quick ranking'], ['少量候选', 'Focused candidates'], ['聚焦潜力', 'Focus on potential'], ['优化', 'Optimization'], ['迭代建议', 'Next suggestion'], ['验证', 'Validation'], ['实验确认', 'Test in the lab'],
    ['创制流程学习上下文', 'Creation path context'], ['当前阶段', 'CURRENT STAGE'], ['你已经理解', 'WHAT YOU UNDERSTAND'], ['推荐下一步', 'RECOMMENDED NEXT STEP'], ['了解 AI 研究伙伴', 'Explore the AI research partner'],
    ['材料可以从目标性能出发，被逐步反向设计。', 'Materials can be designed backwards from a target property.'], ['再看看 AI 如何参与检索、规划与预测。', 'Next, see how AI supports retrieval, planning and prediction.'],
    ['知识检索', 'Knowledge Retrieval'], ['材料认识', 'Material Fundamentals'], ['材料创制', 'Material Discovery'], ['真实案例', 'Real Case'], ['开始筛选', 'START SCREENING'], ['优化', 'OPTIMIZE'], ['当前资料明确的边界', 'DOCUMENTED BOUNDARY'], ['证据检查器', 'EVIDENCE INSPECTOR'],
    ['创制流程', 'Creation Path'], ['研发周期对比', 'Research cycle comparison'], ['探索效率对比', 'Search efficiency comparison'], ['候选空间', 'Candidate Space'], ['成分和制备路径共同影响材料结构与性能。', 'Composition and processing shape structure and performance.'], ['元素变化会改变概念结构，性能字段同步更新。', 'Changing elements changes the conceptual structure and updates the performance readout.'],
    ['不只依赖反复试错', 'does not rely on endless trial and error'], ['研究者可以先定义', 'Researchers first define'], ['再逐步寻找更有可能的材料方案', 'then compare promising material routes'], ['制备工艺', 'Processing route'], ['设定', 'Define '], ['生成', 'Generate '], ['并排除低潜力方案', 'and remove low-potential options'], ['先把可能性铺开', 'Start with many possibilities'], ['如何一步步收缩', 'How does it narrow'], ['AI 的价值不是凭空给出答案，而是帮助研究人员更快探索巨大的', 'AI helps researchers explore a huge'], ['再开始找材料', 'before searching for materials'], ['这就像筛选旅行路线：先定目的地，再比较选项，最后亲自走一遍确认。', 'It is like choosing a route: set the destination, compare options, then test the route.'], ['材料可以从', 'Materials can be designed from'], ['出发，被逐步反向设计', 'and refined backwards'], ['再看看 AI 如何参与', 'Next, see how AI supports'], ['检索、规划与', 'retrieval, planning and'], ['低潜力', 'low-potential'], ['可能性', 'possibilities'], ['过程', 'Process'], ['步骤', 'Step'],
    ['Material Discoverydoes', 'Material Discovery does'], ['endless trial and error。', 'endless trial and error.'], ['defineTargetPerformance', 'define target performance'], ['then compare promising material routes。', 'then compare promising material routes.'], ['在实验中ValidationPerformance', 'Test performance experimentally'], ['Candidates空间', 'Candidate space'], ['交给制备与实验确认', 'Hand off to synthesis and testing'], ['大量Candidates', 'Many candidates'], ['少量Candidates', 'Fewer candidates'], ['fromTargetPerformanceand', 'from target performance and'], ['retrieval, planning andPrediction', 'retrieval, planning and prediction'], ['验证', 'Validation'], ['Candidate spaceHow does it narrow？', 'How does the candidate space narrow?'], ['，', ', '], ['。', '. '], ['：', ': '], ['？', '? ']
  ];
  const replaceText = (text) => replacements.reduce((result, [from, to]) => result.split(from).join(to), text)
    .replace(/≈66\s*天\s*→\s*≈7\s*天/g, '≈66 days → ≈7 days')
    .replace(/成分和Processing路径共同影响材料Structure与Performance\./g, 'Composition and processing shape material structure and performance.')
    .replace(/元素变化会改变概念Structure, Performance字段同步更新\./g, 'Changing elements changes the conceptual structure and updates the performance readout.')
    .replace(/元素选择/g, 'Element selection')
    .replace(/概念趋势/g, 'Conceptual trend')
    .replace(/没有真实计算数据时不显示精确Performance值\./g, 'Do not show precise performance values without real calculations.')
    .replace(/Material Discovery资料\(1\)\.pdf/g, 'Material Discovery materials (1).pdf');
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let current;
  while ((current = walker.nextNode())) textNodes.push(current);
  textNodes.forEach((node) => { if (node.parentElement && !node.parentElement.closest('script,style')) node.nodeValue = replaceText(node.nodeValue); });
}

/* Final language policy: Chinese is the product language. English is kept only
   for recognized scientific abbreviations and compact professional labels. */
function normalizeProductLanguage() {
  document.documentElement.lang = 'zh-CN';
  const labels = { home: '智能创制', material: '认识材料', process: '创制流程', ai: '智能研究', case: '真实案例' };
  Object.entries(labels).forEach(([view, label]) => {
    document.querySelectorAll(`[data-view-link="${view}"]`).forEach((node) => {
      if (node.closest('.main-nav') && node.textContent !== label) node.textContent = label;
    });
  });
  const beginner = document.querySelector('#mode-toggle span:first-child');
  const expert = document.querySelector('#mode-toggle span:last-child');
  const status = document.querySelector('#mode-status');
  if (beginner) beginner.textContent = '小白';
  if (expert) expert.textContent = '专家';
  if (status) status.textContent = expertMode ? '专家模式 查看模型与边界' : '小白模式 先看结论';
}

ensureAgentProductSurfaces();

document.addEventListener('click', (event) => {
  const openTask = event.target.closest('[data-open-task]');
  if (openTask) {
    const prefill = openTask.dataset.prefillGoal;
    if (prefill) updateAgentTask({ goal: prefill, modalStep: 1 });
    openAgentTaskModal();
    return;
  }
  if (event.target.closest('[data-close-task]')) { closeAgentTaskModal(); return; }
  const goal = event.target.closest('[data-task-goal]');
  if (goal) { updateAgentTask({ goal: goal.dataset.taskGoal }); openAgentTaskModal(); return; }
  const constraint = event.target.closest('[data-task-constraint]');
  if (constraint) {
    const value = constraint.dataset.taskConstraint;
    const next = agentTask.constraints.includes(value) ? agentTask.constraints.filter((item) => item !== value) : [...agentTask.constraints, value];
    updateAgentTask({ constraints: next }); openAgentTaskModal(); return;
  }
  if (event.target.closest('[data-task-next]')) { updateAgentTask({ modalStep: Math.min(3, agentTask.modalStep + 1) }); openAgentTaskModal(); return; }
  if (event.target.closest('[data-task-back]')) { updateAgentTask({ modalStep: Math.max(1, agentTask.modalStep - 1) }); openAgentTaskModal(); return; }
  if (event.target.closest('[data-task-start]')) { beginAgentRun(); return; }
  const candidate = event.target.closest('[data-agent-candidate]');
  if (candidate) { updateAgentTask({ selectedCandidate: candidate.dataset.agentCandidate }); renderAgentSurfaces(); if (expertMode) renderWorkbenchCurrentView(); return; }
  if (event.target.closest('[data-agent-run]')) { beginAgentRun(); return; }
  if (event.target.closest('[data-agent-ask]')) { updateAgentTask({ stage: 'clarify', questions: [...agentTask.questions, '需要使用哪一种材料体系和验证条件'] }); renderAgentSurfaces(); return; }
  if (event.target.closest('[data-agent-save-report]')) { updateAgentTask({ reportSaved: true, stage: 'report' }); renderAgentSurfaces(); if (expertMode) renderWorkbenchCurrentView(); }
});

document.addEventListener('input', (event) => {
  const priority = event.target.closest('[data-task-priority]');
  if (!priority) return;
  updateAgentTask({ priorities: { ...agentTask.priorities, [priority.dataset.taskPriority]: Number(priority.value) } });
  const output = priority.parentElement?.querySelector('output');
  if (output) output.textContent = priority.value;
});
