import axios from "axios";
import { getFunctionUrl } from "./functionUrls";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const roadmapsTemplates = {
  'Senior Fullstack Engineer': {
    salary: '$185k',
    growth: '+22%',
    scarcity: 'High',
    timeToRole: '~6mo',
    stages: [
      {
        id: 'st1',
        number: 'Stage 01',
        title: 'Deep Tech Foundation',
        description: 'Mastering distributed systems and high-scale architecture patterns for modern cloud environments.',
        skills: ['Kubernetes Networking', 'Event-Driven Architecture'],
        project: 'Build a real-time analytics engine processing 1M events/sec.',
        targets: ['CAP Theorem in Practice', 'Consensus Algorithms (Raft/Paxos)'],
        status: 'Current Focus'
      },
      {
        id: 'st2',
        number: 'Stage 02',
        title: 'AI Integration & LLM Ops',
        description: 'Bridging traditional software engineering with the generative AI stack, focusing on RAG and agents.',
        skills: ['LangChain / LlamaIndex', 'Pinecone / Weaviate'],
        project: 'Deploy a self-correcting RAG pipeline with observability.',
        targets: ['Vector Database Indexing', 'Fine-tuning LLM Quantization'],
        status: 'Next Milestone'
      },
      {
        id: 'st3',
        number: 'Stage 03',
        title: 'Leadership & Strategy',
        description: 'Transitioning from technical implementation to high-level system strategy and team mentoring.',
        skills: ['Product Roadmap Design', 'Technical Advocacy'],
        project: 'Design a 12-month tech modernization roadmap for a legacy enterprise.',
        targets: ['Conflict Resolution Scenarios', 'Budgeting for Scale'],
        status: 'Advanced'
      }
    ]
  },
  'Product Manager (Technical)': {
    salary: '$160k',
    growth: '+18%',
    scarcity: 'Medium',
    timeToRole: '~4mo',
    stages: [
      {
        id: 'pm1',
        number: 'Stage 01',
        title: 'Technical Translation',
        description: 'Deep dive into APIs, system constraints, and technical feasibility heuristics.',
        skills: ['System Design Basics', 'SQL Analytics'],
        project: 'Draft functional requirements and system schemas for an e-commerce checkout API.',
        targets: ['API design best practices', 'Latency vs Throughput trade-offs'],
        status: 'Current Focus'
      },
      {
        id: 'pm2',
        number: 'Stage 02',
        title: 'Product Metrics & Growth',
        description: 'Formulating funnel metrics, cohorts analysis, and defining product success indexes.',
        skills: ['Amplitude / Mixpanel', 'A/B Testing'],
        project: 'Design and analyze an onboarding experiment to boost conversion rates by 5%.',
        targets: ['Statistical significance tests', 'Retention loops calculation'],
        status: 'Next Milestone'
      }
    ]
  },
  'AI/ML Researcher': {
    salary: '$210k',
    growth: '+35%',
    scarcity: 'Extreme',
    timeToRole: '~8mo',
    stages: [
      {
        id: 'ai1',
        number: 'Stage 01',
        title: 'Mathematical Foundations',
        description: 'Mastering multivariate calculus, linear algebra, probability, and optimization theory.',
        skills: ['PyTorch', 'Vector Algebra'],
        project: 'Write a neural network training loop from scratch in raw NumPy.',
        targets: ['Backpropagation mathematics', 'Gradient descent variants'],
        status: 'Current Focus'
      },
      {
        id: 'ai2',
        number: 'Stage 02',
        title: 'Transformer Architectures',
        description: 'In-depth study of self-attention mechanisms, encoder-decoder networks, and BERT/GPT internals.',
        skills: ['HuggingFace', 'Tokenization algorithms'],
        project: 'Implement a mini-GPT text generator model from scratch.',
        targets: ['Attention calculation flow', 'Position encodings rationale'],
        status: 'Next Milestone'
      }
    ]
  },
  'Cloud Architect': {
    salary: '$195k',
    growth: '+28%',
    scarcity: 'High',
    timeToRole: '~7mo',
    stages: [
      {
        id: 'ca1',
        number: 'Stage 01',
        title: 'Multi-Cloud Infrastructure Mastery',
        description: 'Design and deploy resilient, fault-tolerant infrastructure across AWS, GCP, and Azure using IaC tools.',
        skills: ['Terraform', 'AWS CDK', 'Pulumi'],
        project: 'Build a multi-region failover cluster with auto-scaling and zero-downtime deployments.',
        targets: ['VPC architecture & subnetting', 'IAM roles and least-privilege policies'],
        status: 'Current Focus'
      },
      {
        id: 'ca2',
        number: 'Stage 02',
        title: 'Kubernetes & Container Orchestration',
        description: 'Deep dive into production Kubernetes patterns including operators, service meshes, and advanced scheduling.',
        skills: ['Helm Charts', 'Istio Service Mesh', 'ArgoCD'],
        project: 'Deploy a microservices application with canary releases and automated rollbacks via GitOps.',
        targets: ['HPA & VPA autoscaling strategies', 'Pod disruption budgets'],
        status: 'Next Milestone'
      },
      {
        id: 'ca3',
        number: 'Stage 03',
        title: 'FinOps & Cloud Cost Governance',
        description: 'Establish cloud cost visibility, tagging policies, and right-sizing frameworks across engineering teams.',
        skills: ['AWS Cost Explorer', 'Spot Instance strategies'],
        project: 'Build a cost allocation dashboard with automated anomaly detection and budget alerts.',
        targets: ['Reserved vs. Spot vs. On-Demand trade-offs', 'Rightsizing workloads with Graviton processors'],
        status: 'Advanced'
      }
    ]
  }
};


export const roadmapService = {
  generate: async (role, level) => {
    try {
      const url = getFunctionUrl("generateRoadmap");
      const response = await axios.post(url, { role, level });
      const apiData = response.data.data;
      
      return {
        id: 'rm_' + Date.now(),
        role,
        level,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        salary: apiData.salary || '$130k',
        growth: apiData.growth || '+15%',
        scarcity: apiData.scarcity || 'High',
        timeToRole: apiData.timeToRole || '~6mo',
        stages: apiData.stages.map((s, idx) => ({
          ...s,
          id: `rm_stage_${idx}_` + Date.now()
        }))
      };
    } catch (err) {
      console.warn("Roadmap API synthesis failed, loading fallback local templates:", err);
      // Resilient local fallback template
      const key = Object.keys(roadmapsTemplates).find(
        k => k.toLowerCase().includes(role.toLowerCase())
      ) || 'Senior Fullstack Engineer';

      const baseData = roadmapsTemplates[key];

      return {
        id: 'rm_' + Date.now(),
        role,
        level,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        salary: baseData.salary,
        growth: baseData.growth,
        scarcity: baseData.scarcity,
        timeToRole: baseData.timeToRole,
        stages: baseData.stages.map(s => ({
          ...s,
          id: s.id + '_' + Date.now()
        }))
      };
    }
  }
};
