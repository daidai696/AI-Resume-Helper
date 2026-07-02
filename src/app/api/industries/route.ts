import { NextRequest, NextResponse } from 'next/server';

// 行业数据API - 返回行业关键词、技能、模板建议
const INDUSTRIES = {
  it: {
    id: 'it', name: '互联网/IT', nameEn: 'Internet/IT', icon: '💻',
    description: '软件开发、产品、运维等技术岗位',
    keywords: ['JavaScript','TypeScript','Python','Java','Go','React','Vue','Next.js','Node.js','MySQL','PostgreSQL','Redis','Docker','Kubernetes','AWS','微服务','高并发','Git','CI/CD'],
    skills: { required: ['编程语言','数据结构与算法','Git','Linux'], preferred: ['云服务','容器化','开源贡献'] },
    templates: ['coder','developer','modern','minimal','tech'],
    tips: ['突出技术栈和项目经验','添加GitHub链接','量化项目成果(用户量、性能提升)','列出参与的技术社区'],
  },
  finance: {
    id: 'finance', name: '金融', nameEn: 'Finance', icon: '💰',
    description: '银行、证券、保险、基金等金融行业',
    keywords: ['CFA','CPA','FRM','风险管理','资产配置','投资分析','Bloomberg','Wind','Python量化','尽职调查','估值建模','Excel','VBA'],
    skills: { required: ['Excel高级应用','财务分析','风险意识'], preferred: ['编程能力','数据可视化','英语'] },
    templates: ['classic','executive','professional','formal','finance'],
    tips: ['突出专业证书(CFA/CPA/FRM)','强调实习经历','使用金融专业术语','量化业绩(管理资产规模、收益率)'],
  },
  design: {
    id: 'design', name: '设计', nameEn: 'Design', icon: '🎨',
    description: 'UI/UX设计、视觉设计、交互设计',
    keywords: ['Figma','Sketch','Photoshop','Illustrator','UI设计','UX设计','交互设计','用户体验','用户研究','设计系统','动效设计'],
    skills: { required: ['设计工具','设计思维','作品集'], preferred: ['代码能力(HTML/CSS)','动效设计','插画'] },
    templates: ['creative','designer','minimal','modern','artistic'],
    tips: ['一定要附上作品集链接','展示设计思维','突出设计成果(用户满意度、转化率)','添加设计成果数据'],
  },
  marketing: {
    id: 'marketing', name: '市场/营销', nameEn: 'Marketing', icon: '📈',
    description: '品牌、营销、增长、运营',
    keywords: ['品牌营销','内容营销','社交媒体','SEO','SEM','Google Analytics','用户增长','AARRR','转化率优化','私域流量','AB测试'],
    skills: { required: ['文案能力','数据分析','创意思维'], preferred: ['设计能力','视频制作','英语'] },
    templates: ['modern','creative','minimal','startup','magazine'],
    tips: ['用数据说话(GMV/ROI/用户增长)','展示成功案例','强调对用户心理的洞察'],
  },
  education: {
    id: 'education', name: '教育', nameEn: 'Education', icon: '📚',
    description: '教师、教育产品、教务管理',
    keywords: ['教学设计','课程开发','教育技术','在线教育','学生发展','学科知识','普通话','教师资格证'],
    skills: { required: ['学科专业知识','沟通能力','耐心'], preferred: ['教育技术','数据分析'] },
    templates: ['classic','academic','professional','teacher','clean'],
    tips: ['突出教师资格证','展示教学成果','强调课程开发能力'],
  },
  medical: {
    id: 'medical', name: '医疗/医药', nameEn: 'Medical', icon: '⚕️',
    description: '医生、护士、医药研发',
    keywords: ['执业医师','执业药师','临床经验','GCP','药物临床试验','医学影像','循证医学','PubMed'],
    skills: { required: ['执业资格证','临床能力','医学伦理'], preferred: ['科研能力','英语'] },
    templates: ['classic','academic','professional','medical','clean'],
    tips: ['必须突出执业资格证书','详细描述临床经验','强调科研和论文发表'],
  },
  sales: {
    id: 'sales', name: '销售', nameEn: 'Sales', icon: '💼',
    description: 'B端销售、大客户销售、销售管理',
    keywords: ['B2B销售','大客户管理','KAM','销售漏斗','CRM','Salesforce','业绩达成','商务谈判','招投标'],
    skills: { required: ['沟通能力','抗压能力','客户意识'], preferred: ['行业知识','数据分析'] },
    templates: ['modern','executive','classic','professional','consultant'],
    tips: ['用具体业绩数据说话','突出大客户开发经验','展示业绩排名和获奖'],
  },
  general: {
    id: 'general', name: '通用', nameEn: 'General', icon: '📄',
    description: '通用模板，适合大多数岗位',
    keywords: [],
    skills: { required: ['沟通能力','学习能力','执行力'], preferred: ['团队协作','抗压能力'] },
    templates: ['classic','modern','minimal','professional','ats','clean','elegant','compact'],
    tips: ['突出与岗位JD匹配的核心能力','使用STAR法则','量化所有可量化的成就'],
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const industry = (INDUSTRIES as any)[id];
    if (!industry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }
    return NextResponse.json({ industry });
  }

  return NextResponse.json({
    industries: Object.values(INDUSTRIES).map(i => ({
      id: i.id, name: i.name, nameEn: i.nameEn, icon: i.icon,
      description: i.description, templateCount: i.templates.length,
    })),
    total: Object.keys(INDUSTRIES).length,
  });
}
