export const POSTS = [
  {
    id: 1,
    slug: 'salesforce-agentforce-enterprise',
    category: 'Salesforce',
    tag: '#AgentForce',
    title: 'How AgentForce Is Redefining Enterprise CRM in 2025',
    excerpt:
      'Salesforce AgentForce moves CRM from a system of record to a system of action. We break down what autonomous agents mean for your sales pipeline.',
    author: 'Genufy Team',
    date: 'Jun 10, 2025',
    readTime: '6 min read',
    featured: true,
    accentColor: '#24baac',
    icon: '⚡',
    body: [
      {
        type: 'lead',
        text: 'Salesforce AgentForce isn\'t just another AI feature — it\'s a fundamental shift in how CRM software operates. Instead of waiting for a human to trigger an action, AgentForce deploys autonomous agents that plan, execute, and adapt in real time.',
      },
      {
        type: 'h2',
        text: 'From System of Record to System of Action',
      },
      {
        type: 'p',
        text: 'Traditional CRM has always been a mirror of the past — a place to log calls, store contacts, and report on closed deals. AgentForce turns Salesforce into an active participant in revenue generation. Agents can qualify inbound leads, schedule follow-ups, draft personalised outreach, and escalate complex cases — all without a rep lifting a finger.',
      },
      {
        type: 'callout',
        text: 'Early adopters in financial services report a 34% reduction in time-to-first-contact for inbound leads after deploying AgentForce on their Service Cloud.',
      },
      {
        type: 'h2',
        text: 'What Autonomous Agents Actually Do',
      },
      {
        type: 'p',
        text: 'AgentForce agents operate within a defined scope — you configure what data they can read, what actions they can take, and when to hand off to a human. Common patterns we\'ve deployed at Genufy include: lead scoring and routing, renewal risk detection, and first-response drafting for support tickets.',
      },
      {
        type: 'h2',
        text: 'Implementation Considerations',
      },
      {
        type: 'p',
        text: 'The biggest implementation risk isn\'t the technology — it\'s data quality. AgentForce agents are only as good as the data they can see. Before enabling agents, audit your lead and contact records for completeness. Incomplete records lead to agents taking low-confidence actions, which erodes trust quickly.',
      },
      {
        type: 'p',
        text: 'At Genufy, our standard AgentForce engagement begins with a two-week data readiness assessment before any agent configuration begins. This single step has prevented every failed rollout we\'ve seen at other firms.',
      },
    ],
  },
  {
    id: 2,
    slug: 'snowflake-cortex-ai',
    category: 'Snowflake',
    tag: '#CortexAI',
    title: 'Snowflake Cortex AI: Running LLMs Directly on Your Data Warehouse',
    excerpt:
      "With Cortex AI, you no longer need to move data out of Snowflake to run inference. Here's how we're using it for real-time analytics at scale.",
    author: 'Genufy Team',
    date: 'Jun 3, 2025',
    readTime: '8 min read',
    featured: false,
    accentColor: '#5b9cf6',
    icon: '❄️',
    body: [
      {
        type: 'lead',
        text: 'For years, running ML inference on your data warehouse meant one thing: ETL it out, run a model elsewhere, and ETL the results back. Snowflake Cortex AI eliminates that pipeline entirely.',
      },
      {
        type: 'h2',
        text: 'What Cortex AI Actually Is',
      },
      {
        type: 'p',
        text: 'Cortex AI is a suite of LLM-powered functions — COMPLETE, SUMMARIZE, SENTIMENT, TRANSLATE, EXTRACT_ANSWER — that run natively inside Snowflake using SQL. There is no model to deploy, no Python environment to manage, no data to move.',
      },
      {
        type: 'callout',
        text: 'SELECT SNOWFLAKE.CORTEX.SENTIMENT(review_text) FROM customer_reviews — that\'s the entire inference pipeline.',
      },
      {
        type: 'h2',
        text: 'Real-World Use Cases We\'ve Deployed',
      },
      {
        type: 'p',
        text: 'We\'ve used Cortex AI for three production use cases: real-time sentiment scoring on support ticket streams, automatic summarisation of long-form sales call transcripts stored in Snowflake, and structured data extraction from unstructured contract text loaded via Snowpipe.',
      },
      {
        type: 'h2',
        text: 'Cost and Latency Profile',
      },
      {
        type: 'p',
        text: 'Cortex functions are billed per token, not per compute hour. For batch workloads this is very efficient. For streaming or near-real-time use cases, model the token cost carefully — a high-cardinality table with verbose text fields can burn credits quickly. We recommend running CORTEX functions inside a separate dedicated warehouse with auto-suspend set to 1 minute.',
      },
    ],
  },
  {
    id: 3,
    slug: 'mulesoft-api-led-patterns',
    category: 'MuleSoft',
    tag: '#APIDesign',
    title: 'API-Led Connectivity Patterns That Actually Scale',
    excerpt:
      'Most teams outgrow their first MuleSoft architecture within 18 months. These three structural patterns keep your integration layer maintainable as you grow.',
    author: 'Genufy Team',
    date: 'May 28, 2025',
    readTime: '7 min read',
    featured: false,
    accentColor: '#a78bfa',
    icon: '🔗',
    body: [
      {
        type: 'lead',
        text: 'API-led connectivity is one of the best ideas in enterprise integration — and one of the most commonly mis-implemented. The three-layer model (Experience, Process, System) is simple in theory. In practice, teams collapse layers, skip versioning, and create tight coupling that turns the integration layer into a bottleneck.',
      },
      {
        type: 'h2',
        text: 'Pattern 1: Hard Layer Boundaries',
      },
      {
        type: 'p',
        text: 'The most common mistake is letting Experience APIs call System APIs directly. Once you do this, you\'ve bypassed the Process layer and created a direct dependency between your consumer-facing interface and your backend systems. Any change to the backend now requires a frontend change. Enforce the rule: no layer skipping, ever.',
      },
      {
        type: 'h2',
        text: 'Pattern 2: Contract-First Versioning',
      },
      {
        type: 'callout',
        text: 'Version your API contracts in Anypoint Exchange before writing a single line of implementation code. The contract is the source of truth — not the code.',
      },
      {
        type: 'p',
        text: 'Every API should have a published RAML or OAS spec in Anypoint Exchange before implementation begins. When consumers discover and mock from Exchange, they\'re decoupled from your implementation timeline. Versioning becomes trivial: publish v2 alongside v1, migrate consumers, deprecate v1 on a published timeline.',
      },
      {
        type: 'h2',
        text: 'Pattern 3: System API Idempotency',
      },
      {
        type: 'p',
        text: 'System APIs sit closest to your backend. If a System API call fails mid-flight (network blip, timeout), will a retry cause a duplicate record? Build idempotency keys into every mutating System API endpoint. This single pattern eliminates an entire class of production incidents.',
      },
    ],
  },
  {
    id: 4,
    slug: 'ai-ml-production-checklist',
    category: 'AI / ML',
    tag: '#MLOps',
    title: 'The Production AI Checklist: 12 Things Most Teams Skip',
    excerpt:
      'Getting a model to 90% accuracy in a notebook is easy. Keeping it accurate, observable, and cost-efficient in production is a different problem entirely.',
    author: 'Genufy Team',
    date: 'May 20, 2025',
    readTime: '10 min read',
    featured: false,
    accentColor: '#90eb61',
    icon: '🤖',
    body: [
      {
        type: 'lead',
        text: 'The gap between a working notebook and a production-grade AI system is wider than most teams expect. Here are the twelve checkpoints we run through before any model goes live.',
      },
      {
        type: 'h2',
        text: 'Observability First',
      },
      {
        type: 'p',
        text: 'Before deployment, instrument your model with input distribution monitoring, prediction confidence tracking, and latency percentile logging. A model that degrades silently is worse than one that fails loudly. Tools like Arize, WhyLabs, or even a custom Snowflake logging layer give you the visibility to catch drift before users do.',
      },
      {
        type: 'callout',
        text: 'Most model failures in production are not accuracy failures — they\'re data pipeline failures. Monitor your inputs as rigorously as your outputs.',
      },
      {
        type: 'h2',
        text: 'Feedback Loops and Retraining Triggers',
      },
      {
        type: 'p',
        text: 'Define your retraining trigger before you go live, not after. Whether it\'s a drift threshold, a scheduled cadence, or a performance SLA breach, the trigger should be automated and version-controlled. Manual retraining decisions become bottlenecks as you scale.',
      },
      {
        type: 'h2',
        text: 'Cost Modelling',
      },
      {
        type: 'p',
        text: 'For LLM-based features specifically, model the token cost at P95 and P99 traffic levels before launch. A feature that costs $0.002 per call sounds cheap — at 2 million calls per day it\'s $4,000 daily. Build cost dashboards alongside performance dashboards from day one.',
      },
    ],
  },
  {
    id: 5,
    slug: 'informatica-idmc-cloud-migration',
    category: 'Informatica',
    tag: '#IDMC',
    title: 'Migrating to Informatica IDMC: Lessons from the Field',
    excerpt:
      "After migrating five enterprise clients from PowerCenter to IDMC, we've collected the surprises, shortcuts, and hard-won best practices.",
    author: 'Genufy Team',
    date: 'May 12, 2025',
    readTime: '9 min read',
    featured: false,
    accentColor: '#f97316',
    icon: '🔄',
    body: [
      {
        type: 'lead',
        text: 'PowerCenter-to-IDMC migrations look straightforward on paper. In practice, every engagement surfaces surprises. After five enterprise migrations, here is what we\'ve learned.',
      },
      {
        type: 'h2',
        text: 'The Mapping Conversion Reality',
      },
      {
        type: 'p',
        text: 'Informatica\'s Migration Accelerator converts a meaningful percentage of mappings automatically — but "converted" does not mean "validated". Budget one QA sprint for every 200 mappings, regardless of what the conversion report says. Edge cases in custom transformations, parameter files, and session configurations surface consistently during QA.',
      },
      {
        type: 'callout',
        text: 'Run both PowerCenter and IDMC in parallel for at least one full reconciliation cycle before cutover. Output reconciliation is non-negotiable.',
      },
      {
        type: 'h2',
        text: 'Connection Management at Scale',
      },
      {
        type: 'p',
        text: 'IDMC\'s Secure Agent model changes how you manage connections. Unlike PowerCenter, connection credentials live in IDMC Cloud — not in a local repository. For clients with strict secrets management policies, plan an extra sprint to integrate Secure Agent with your vault solution (HashiCorp, AWS Secrets Manager, etc.).',
      },
      {
        type: 'h2',
        text: 'Performance Tuning Differences',
      },
      {
        type: 'p',
        text: 'Pushdown optimisation behaves differently in IDMC than in PowerCenter. For Snowflake targets especially, enable ELT mode on your mappings and verify that transformation logic is executing in Snowflake\'s compute, not on the Secure Agent. The performance delta between agent-side and pushdown execution on large datasets can be 10x.',
      },
    ],
  },
  {
    id: 6,
    slug: 'devops-platform-engineering',
    category: 'DevOps',
    tag: '#PlatformEng',
    title: "Platform Engineering Is the New DevOps — Here's the Difference",
    excerpt:
      'DevOps asked developers to own operations. Platform engineering builds internal tools so developers never have to think about operations again.',
    author: 'Genufy Team',
    date: 'May 5, 2025',
    readTime: '5 min read',
    featured: false,
    accentColor: '#38bdf8',
    icon: '🚀',
    body: [
      {
        type: 'lead',
        text: 'DevOps was a cultural shift that asked developers to take ownership of deployment and operations. Platform engineering is the natural next step: building the internal tooling that makes operations invisible to developers entirely.',
      },
      {
        type: 'h2',
        text: 'The Core Distinction',
      },
      {
        type: 'p',
        text: 'DevOps: "You build it, you run it." Platform engineering: "We build the platform so you can ship without thinking about running it." The platform team is an internal service provider. Their customer is the developer. Their product is the Internal Developer Platform (IDP).',
      },
      {
        type: 'callout',
        text: 'A well-built IDP reduces the cognitive load of a typical feature deployment from dozens of manual steps to a single pull request.',
      },
      {
        type: 'h2',
        text: 'What an IDP Actually Contains',
      },
      {
        type: 'p',
        text: 'At minimum: a service catalogue, self-service environment provisioning, standardised CI/CD pipelines, secrets management, and observability scaffolding. Developers should be able to spin up a production-ready service from a template in under 15 minutes — including monitoring, alerting, and deployment pipeline.',
      },
      {
        type: 'h2',
        text: 'When to Start Building One',
      },
      {
        type: 'p',
        text: 'The right time to invest in an IDP is when your developers are spending more than 20% of their time on infrastructure concerns. At that point, a dedicated platform team pays for itself within two quarters. Start small: standardise one pipeline, one environment provisioning flow. Expand from there.',
      },
    ],
  },
  {
    id: 7,
    slug: 'salesforce-data-cloud-cdp',
    category: 'Salesforce',
    tag: '#DataCloud',
    title: 'Salesforce Data Cloud: Unifying Customer Identity Across Every Channel',
    excerpt:
      "Data Cloud isn't just another CDP — it's the connective tissue between your CRM, marketing, service, and commerce clouds. A practical implementation guide.",
    author: 'Genufy Team',
    date: 'Apr 28, 2025',
    readTime: '7 min read',
    featured: false,
    accentColor: '#24baac',
    icon: '☁️',
    body: [
      {
        type: 'lead',
        text: 'Most CDPs sit beside your CRM. Salesforce Data Cloud sits inside it — and that distinction changes everything about how you architect identity resolution, segmentation, and activation.',
      },
      {
        type: 'h2',
        text: 'Identity Resolution at the Core',
      },
      {
        type: 'p',
        text: 'Data Cloud\'s identity resolution engine merges customer records from every connected source into a single Unified Individual. This is not deduplication — it\'s probabilistic and deterministic matching across email, phone, cookie IDs, and custom identifiers simultaneously. For enterprises with fragmented customer data across Salesforce orgs, this alone justifies the investment.',
      },
      {
        type: 'callout',
        text: 'One retail client unified 4.2 million customer records from 3 separate orgs into 2.8 million Unified Individuals — eliminating 33% of duplicate marketing spend overnight.',
      },
      {
        type: 'h2',
        text: 'Activation Patterns',
      },
      {
        type: 'p',
        text: 'Once you have a Unified Individual, activation is the payoff. Data Cloud segments flow directly into Marketing Cloud for journey activation, into Service Cloud for agent context, and into Commerce Cloud for personalised storefront experiences — all from the same segment definition, with no export/import cycle.',
      },
    ],
  },
  {
    id: 8,
    slug: 'pega-decisioning-ai',
    category: 'Pega',
    tag: '#NextBestAction',
    title: 'Pega Next-Best-Action: Moving from Rules to Real-Time AI Decisioning',
    excerpt:
      "Static rule trees can't keep up with customer behavior in 2025. Here's how Pega's AI decisioning layer replaces hundreds of manual rules with one adaptive model.",
    author: 'Genufy Team',
    date: 'Apr 18, 2025',
    readTime: '6 min read',
    featured: false,
    accentColor: '#f43f5e',
    icon: '🧠',
    body: [
      {
        type: 'lead',
        text: 'Pega\'s Next-Best-Action Designer has always been powerful. The shift from rule-based eligibility filters to AI-driven propensity models is where that power compounds.',
      },
      {
        type: 'h2',
        text: 'The Problem with Rules at Scale',
      },
      {
        type: 'p',
        text: 'A typical enterprise NBA configuration accumulates hundreds of eligibility rules over time. Nobody fully understands the interaction effects. New rules get added defensively. The result: a system that\'s conservative by default and increasingly hard to change without regression testing every downstream action.',
      },
      {
        type: 'callout',
        text: 'One insurance client had 847 active eligibility rules across 12 action groups. After migrating to adaptive models, they replaced 640 of them with three propensity models — and improved conversion 28%.',
      },
      {
        type: 'h2',
        text: 'Adaptive Models vs. Predictive Models',
      },
      {
        type: 'p',
        text: 'Pega\'s adaptive models learn continuously from customer responses — no batch retraining, no MLOps pipeline, no separate model registry. For organisations without a mature data science function, this is transformative. For those with one, adaptive models handle the real-time layer while predictive models handle the longer-horizon propensity scoring.',
      },
      {
        type: 'h2',
        text: 'Getting Started',
      },
      {
        type: 'p',
        text: 'Start with one action group, one channel. Let adaptive models run alongside your existing rules for 30 days and compare outcomes. The data from that comparison builds the business case for broader rollout — and usually speaks for itself.',
      },
    ],
  },
];
