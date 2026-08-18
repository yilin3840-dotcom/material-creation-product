const finalFunnelStages = {
  space: {
    label: '当前范围',
    value: '十亿级候选',
    copy: '先铺开组成和结构的可能性，再根据目标逐层缩小范围'
  },
  constraints: {
    label: '正在判断',
    value: '5 类关键条件',
    copy: '把性能、成本、周期、可制造性与使用环境转化为明确约束'
  },
  model: {
    label: '筛选方式',
    value: '知识与模型协同',
    copy: '利用材料知识、结构预测和性能排序，排除低潜力区域'
  },
  experiment: {
    label: '验证策略',
    value: '计算与实验闭环',
    copy: '优先验证最有信息价值的候选，并把结果反馈到下一轮'
  },
  final: {
    label: '最终输出',
    value: '3–5 个优先候选',
    copy: '得到可以比较、可以解释，并且能够继续验证的材料方案'
  }
};

function activateFinalFunnel(stageKey) {
  const stages = [...document.querySelectorAll('[data-final-funnel]')];
  const activeIndex = stages.findIndex((item) => item.dataset.finalFunnel === stageKey);
  stages.forEach((item, index) => {
    item.classList.toggle('is-active', index === activeIndex);
    item.classList.toggle('is-passed', index < activeIndex);
    item.setAttribute('aria-pressed', String(index === activeIndex));
  });
  const data = finalFunnelStages[stageKey] || finalFunnelStages.space;
  const label = document.querySelector('#funnel-inspector-label');
  const value = document.querySelector('#funnel-inspector-value');
  const copy = document.querySelector('#funnel-inspector-copy');
  if (label) label.textContent = data.label;
  if (value) value.textContent = data.value;
  if (copy) copy.textContent = data.copy;
}

document.querySelectorAll('[data-final-funnel]').forEach((button) => {
  button.addEventListener('click', () => activateFinalFunnel(button.dataset.finalFunnel));
});

const finalMicroTranslations = {
  'MATERIAL CREATION / 01': '材料智能创制',
  'MATERIAL BASICS / 02': '认识材料',
  'SCIENCE VISUALIZATION / 03': '交互示意',
  'BEGINNER EXPLANATION': '小白解读',
  'EXPERT LAYERS': '专业视图',
  'LEARNING CONTEXT': '学习进度',
  'CURRENT STAGE': '当前阶段',
  'SOURCE INDEX / 07': '证据索引',
  'RESEARCH LOOP': '研究闭环',
  'EVIDENCE PANEL': '证据详情',
  'CANDIDATE SPACE': '候选空间',
  'PREDICTION VS VALIDATION': '预测与验证',
  'MODEL PREDICTION': '模型预测',
  'EXPERIMENTAL VALIDATION': '实验验证',
  'QUICK GLOSSARY': '快速解释',
  'CONCEPTUAL VISUALIZATION': '概念示意',
  'CURRENT TASK': '当前任务',
  'RESEARCH PATH': '研究路径'
};

function removeHeadingPunctuation(root = document) {
  root.querySelectorAll('h1,h2,h3,h4').forEach((heading) => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) node.nodeValue = node.nodeValue.replace(/[。！？!?：:；;]+/g, ' ');
  });
}

function normalizeChineseUi(root = document) {
  document.documentElement.lang = 'zh-CN';
  const setText = (item, value) => { if (item && item.textContent !== value) item.textContent = value; };
  const nav = { home: '智能创制', material: '认识材料', process: '创制流程', ai: '智能研究', case: '真实案例' };
  Object.entries(nav).forEach(([view, label]) => {
    root.querySelectorAll(`[data-view-link="${view}"]`).forEach((item) => {
      if (item.closest('.main-nav')) setText(item, label);
    });
  });
  root.querySelectorAll('#mode-toggle span:first-child').forEach((item) => setText(item, '小白'));
  root.querySelectorAll('#mode-toggle span:last-child').forEach((item) => setText(item, '专家'));
  const modeStatus = document.querySelector('#mode-status');
  const modeToggle = document.querySelector('#mode-toggle');
  setText(modeStatus, modeToggle?.getAttribute('aria-pressed') === 'true' ? '专家模式 查看模型与边界' : '小白模式 先看结论');
  root.querySelectorAll('.micro-tag,.eyebrow,.conceptual-label,.evidence-tag').forEach((item) => {
    const normalized = item.textContent.trim().replace(/\s+/g, ' ');
    if (finalMicroTranslations[normalized]) setText(item, finalMicroTranslations[normalized]);
    if (normalized.startsWith('CONCEPTUAL VISUALIZATION')) setText(item, '概念示意');
  });
  root.querySelectorAll('.nav-note').forEach((item) => { if (!item.textContent.includes('证据索引')) item.innerHTML = '证据索引 <span>↗</span>'; });
  removeHeadingPunctuation(root);
}

window.normalizeProductLanguage = normalizeChineseUi;
normalizeChineseUi();
activateFinalFunnel('space');

const finalModeToggle = document.querySelector('#mode-toggle');
if (finalModeToggle) {
  finalModeToggle.addEventListener('click', () => {
    window.setTimeout(() => {
      document.querySelectorAll('.app-view').forEach((view) => {
        const active = view.classList.contains('is-active');
        view.setAttribute('aria-hidden', String(!active));
      });
      const workbench = document.querySelector('#workbench-root');
      if (workbench) {
        const expert = document.body.classList.contains('expert-mode');
        workbench.hidden = !expert;
        workbench.setAttribute('aria-hidden', String(!expert));
      }
      normalizeChineseUi();
    }, 0);
  });
}

/* 专家工作台保留少量专业英文缩写，其余界面文案统一为中文 */
const finalWorkbenchTranslations = {
  'SCIENTIFIC WORKBENCH': '专业研究工作台',
  'ANALYSIS READY': '分析就绪',
  'RESEARCH PIPELINE': '研究链路',
  'Research Question': '研究问题',
  'Research question': '研究问题',
  'Candidate Space': '候选空间',
  'Knowledge': '知识检索',
  'Planning': '任务规划',
  'Experiment': '实验验证',
  'Generation': '候选生成',
  'Prediction': '性能预测',
  'Optimization': '候选优化',
  'Validation': '实验验证',
  'Product': '产品',
  'Material': '材料',
  'Structure': '结构',
  'Atom': '原子',
  'Evidence Index': '证据索引',
  'Source Map': '来源地图',
  'WORKBENCH': '工作台',
  'EVIDENCE INSPECTOR': '证据检查器',
  'Agent Research Run': 'AI 研究任务',
  'Definition': '定义',
  'Mechanism': '作用机制',
  'Process': '过程',
  'Evidence': '证据',
  'Limitations': '边界',
  'Source': '来源',
  'TRADITIONAL LOOP': '传统研发链路',
  'AI-ASSISTED LOOP': 'AI 辅助链路',
  'AI DID NOT PRODUCE A VERIFIED MATERIAL.': 'AI 不会直接产出已验证材料',
  'AI helped narrow the search space.': '它帮助研究员缩小搜索空间',
  'ACTIVE RESEARCH TASK': '当前研究任务',
  'No active task yet': '尚未创建研究任务',
  'Start a task from the product home to populate this workbench.': '从产品首页创建任务后，这里会显示完整研究状态',
  'CREATE TASK': '创建任务',
  'STATE': '状态',
  'INTAKE': '待输入',
  'STEP': '步骤',
  'CONFIDENCE': '可信度',
  'NOT SET': '未设置',
  'MATERIAL DNA': '材料 DNA',
  'AGENT RESEARCH RUN': 'AI 研究任务',
  'RESEARCH REQUEST': '研究任务',
  'CANDIDATE SPACE': '候选空间',
  'INPUT': '输入',
  'Input': '输入',
  'Action': '动作',
  'Output': '输出',
  'ACTION': '动作',
  'OUTPUT': '输出',
  'CONCEPTUAL VISUALIZATION': '概念示意',
  'MODEL PREDICTION': '模型预测',
  'EXPERIMENTAL VALIDATION': '实验验证',
  'EVIDENCE SELECTED': '已选择证据'
};

function normalizeWorkbenchLanguage() {
  const root = document.querySelector('#workbench-root');
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  nodes.forEach((textNode) => {
    if (!textNode.parentElement || textNode.parentElement.closest('script,style')) return;
    let value = textNode.nodeValue;
    Object.entries(finalWorkbenchTranslations).forEach(([from, to]) => { value = value.split(from).join(to); });
    textNode.nodeValue = value;
  });
}
normalizeWorkbenchLanguage();

let finalNormalizationScheduled = false;
const finalObserver = new MutationObserver(() => {
  if (finalNormalizationScheduled) return;
  finalNormalizationScheduled = true;
  window.requestAnimationFrame(() => {
    finalNormalizationScheduled = false;
    normalizeChineseUi();
    normalizeWorkbenchLanguage();
  });
});
finalObserver.observe(document.body, { childList: true, subtree: true });
