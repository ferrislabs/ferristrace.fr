import {
  Bell,
  Bot,
  Boxes,
  ChartGantt,
  ChartLine,
  Clock,
  Cpu,
  DollarSign,
  FileSearch,
  FileText,
  GitBranch,
  Gauge,
  History,
  KeyRound,
  Keyboard,
  Layers,
  ListChecks,
  Logs,
  MessageSquare,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Tags,
  Timer,
  UserCheck,
  Users,
} from 'lucide-react'
import { products } from '../landing/catalog'
import { Capabilities, CtaBand, DiagramSection, ExploreGrid, PageHero, PageShell } from './blocks'
import { AgentAccess } from './diagrams/agent-access'
import { AiCostExplorer } from './diagrams/ai-cost-explorer'
import { ClusterMap } from './diagrams/cluster-map'
import { IncidentPlayer } from './diagrams/incident-player'
import { ConnectTerminal } from './diagrams/connect-terminal'
import { TraceExplorer } from './diagrams/trace-explorer'
import { ProblemTabs } from './problem-tabs'
import {
  agentSprite,
  aiObsSprite,
  incidentSprite,
  infraSprite,
  tracesSprite,
} from '../pixel/sprites'

const others = (slug: string) => products.filter((p) => p.slug !== slug)

/**
 * One product page = one interactive diagram (the hero), one set of
 * problems told as before/after workflows, one short capability list.
 * Each thing is said once.
 */

export function ObservabilityPage() {
  return (
    <PageShell current="products">
      <PageHero
        sprite={tracesSprite}
        eyebrow="Traces, logs & metrics"
        title="Stop guessing why it's slow."
        accent="Look at the request."
        lead="Follow a slow request through every service it touched, with the logs it wrote and the metrics it moved right beside it."
      >
        <TraceExplorer />
        <p className="mt-4 text-center text-sm text-faint-foreground">
          Click a span to see its attributes and logs, and what they say about this checkout.
        </p>
      </PageHero>

      <ProblemTabs
        id="observability-problems"
        title="Debugging with fewer tabs open."
        description="Three bugs you have probably chased this quarter, and the steps each one takes."
        problems={[
          {
            id: 'slow',
            Icon: Timer,
            title: '"The app is slow"',
            before: [
              ['Slack', 'ask which endpoint and which customer'],
              ['Grafana', 'find the latency panel, guess the minute'],
              ['kubectl', 'grep logs on gateway, cart and payments'],
              ['spreadsheet', 'line up timestamps by hand'],
              ['git', 'diff the last deploys, hope for a match'],
            ],
            after: [
              ['FerrisTrace', 'filter slow requests on /checkout'],
              ['FerrisTrace', 'open one and see the slow span and its deploy'],
            ],
            result: 'You start from the request that was slow and work back from there.',
          },
          {
            id: 'error',
            Icon: Logs,
            title: 'An error without context',
            before: [
              ['log search', 'find "deadline exceeded"'],
              ['log search', 'guess the request from neighbouring lines'],
              ['APM', 'search a trace around the same second'],
              ['Slack', 'ask the owning team what it means'],
            ],
            after: [
              ['FerrisTrace', 'click the error line'],
              ['FerrisTrace', 'jump to its trace, user and deploy'],
            ],
            result: 'Each log line carries its trace id, so it leads straight to the request.',
          },
          {
            id: 'spike',
            Icon: ChartLine,
            title: 'A spike on a chart',
            before: [
              ['Grafana', 'notice the jump at 14:32'],
              ['APM', 'set the same time range by hand'],
              ['APM', 'scroll traces until one looks slow'],
            ],
            after: [['FerrisTrace', 'click the spike to open the traces from that minute']],
            result: 'You spend the minute on the cause instead of on the time picker.',
          },
        ]}
      />

      <DiagramSection
        id="observability-sources"
        alt
        title="Send what you already have."
        description="FerrisTrace takes plain OpenTelemetry. Pick your stack to see the setup, the same commands you would run for any OTLP backend."
      >
        <ConnectTerminal />
      </DiagramSection>

      <Capabilities
        title="What you get."
        items={[
          {
            Icon: ChartGantt,
            title: 'Waterfall by service',
            body: 'See where the time went, coloured by service, with each error on the span that threw it.',
          },
          {
            Icon: Search,
            title: 'Search any attribute',
            body: 'Attributes keep their types. Filter on status, duration, user, version or anything else you send.',
          },
          {
            Icon: Logs,
            title: 'Logs with a trace id',
            body: 'Filter by severity, text or trace, and click a line to open the request behind it.',
          },
          {
            Icon: ChartLine,
            title: 'Metrics that open traces',
            body: 'A chart per attribute set, linked to the traces recorded in the same minute.',
          },
          {
            Icon: Keyboard,
            title: 'Keyboard-first',
            body: 'G T, J K, Enter and / get you around. Handy on your tenth visit of the day.',
          },
          {
            Icon: Layers,
            title: 'OpenTelemetry only',
            body: 'There is no FerrisTrace SDK. Your instrumentation keeps working if you ever switch backends.',
          },
        ]}
      />
      <ExploreGrid title="The rest of FerrisTrace." entries={others('observability')} />
      <CtaBand
        title="Find your slowest request in the next ten minutes."
        body="Cloud is free while we are in beta. Self-hosting takes one docker run."
      />
    </PageShell>
  )
}

export function InfrastructurePage() {
  return (
    <PageShell current="products">
      <PageHero
        sprite={infraSprite}
        eyebrow="Infrastructure"
        title="Know which pod broke it,"
        accent="and which deploy shipped it."
        lead="Pods, nodes and deploys sit next to the services they run. When checkout starts crash-looping, you see the pod, its version and the failing request together."
      >
        <ClusterMap />
        <p className="mt-4 text-center text-sm text-faint-foreground">
          Click a pod or pick a deploy. The crash follows v2.14 around, whichever node it lands on.
        </p>
      </PageHero>

      <ProblemTabs
        id="infra-problems"
        title="Fewer kubectl commands per outage."
        description="The routine you know by heart, and the shorter version."
        problems={[
          {
            id: 'crashloop',
            Icon: ShieldAlert,
            title: 'A pod crash-loops',
            before: [
              ['kubectl', 'get pods, spot the CrashLoopBackOff'],
              ['kubectl', 'describe pod, read the events'],
              ['kubectl', 'logs --previous, scroll to the stack trace'],
              ['ArgoCD', 'find which sync shipped this image'],
              ['Grafana', 'check whether memory was the limit'],
            ],
            after: [
              ['FerrisTrace', 'click the red pod'],
              ['FerrisTrace', 'read deploy, restarts, memory and last trace on one card'],
            ],
            result: 'You read one card instead of running five commands.',
          },
          {
            id: 'deploy',
            Icon: GitBranch,
            title: '"Was it the deploy?"',
            before: [
              ['ArgoCD', 'note the rollout time'],
              ['Grafana', 'compare error rates before and after'],
              ['kubectl', 'list pods per image tag'],
              ['Slack', 'debate whether to roll back'],
            ],
            after: [
              ['FerrisTrace', 'filter by version and watch only the new pods fail'],
              ['FerrisTrace', 'roll back, with the evidence on screen'],
            ],
            result: 'You stop debating the rollback and start doing it.',
          },
          {
            id: 'noisy',
            Icon: Cpu,
            title: 'A noisy neighbour',
            before: [
              ['kubectl', 'top pods on every node'],
              ['Grafana', 'correlate memory with latency by eye'],
              ['APM', 'check which services slowed down'],
            ],
            after: [
              ['FerrisTrace', "open the node to see usage per pod beside each service's latency"],
            ],
            result: 'The pod hogging the node is usually obvious at a glance.',
          },
        ]}
      />

      <Capabilities
        title="What the cluster view shows."
        items={[
          {
            Icon: Server,
            title: 'Pods by node and service',
            body: 'State, restarts, CPU and memory, with unhealthy pods in red and amber.',
          },
          {
            Icon: Tags,
            title: 'Version on every pod',
            body: 'Put two deploys side by side and see which one the errors follow.',
          },
          {
            Icon: ChartGantt,
            title: 'Pod in every trace',
            body: 'Spans carry the pod, node and deployment, so you can filter traces by any of them.',
          },
          {
            Icon: Bell,
            title: 'Alerts that name the pod',
            body: 'Alerts name the pod and the deploy involved, next to the metric that fired.',
          },
          {
            Icon: Boxes,
            title: 'Any cluster',
            body: 'Managed or on-premise, it works wherever the OpenTelemetry Collector runs.',
          },
          {
            Icon: GitBranch,
            title: 'GitOps ready',
            body: 'Self-host it from the Kustomize manifests and let ArgoCD deploy it with your apps.',
          },
        ]}
      />
      <ExploreGrid title="The rest of FerrisTrace." entries={others('infrastructure')} />
      <CtaBand
        title="Put your pods next to your traces."
        body="Point an OpenTelemetry Collector at FerrisTrace and your pods show up on the map."
      />
    </PageShell>
  )
}

export function IncidentsPage() {
  return (
    <PageShell current="products">
      <PageHero
        sprite={incidentSprite}
        eyebrow="Incident response"
        title="Run the incident"
        accent="where the evidence already is."
        lead="Alerts, on-call, the timeline and the postmortem sit next to your traces and logs, so nobody spends the incident pasting screenshots into Slack."
      >
        <IncidentPlayer />
        <p className="mt-4 text-center text-sm text-faint-foreground">
          Press play or click through the steps to follow one incident from the first alert to the
          postmortem.
        </p>
      </PageHero>

      <ProblemTabs
        id="incident-problems"
        title="Where incident time goes."
        description="Count how much of it is spent on the bug itself."
        problems={[
          {
            id: 'start',
            Icon: Bell,
            title: 'The first ten minutes',
            before: [
              ['PagerDuty', 'acknowledge the page'],
              ['Slack', 'open a channel, invite people'],
              ['Grafana', 'find the right dashboard'],
              ['APM', 'look for a failing trace'],
              ['Slack', 'paste screenshots for everyone'],
            ],
            after: [
              ['FerrisTrace', 'declare from the alert with severity, owner and on-call set'],
              ['FerrisTrace', 'the failing trace is already attached'],
            ],
            result: 'The first ten minutes go to the bug instead of the channel setup.',
          },
          {
            id: 'who',
            Icon: Users,
            title: 'Who leads?',
            before: [
              ['Slack', 'three people ask who is on it'],
              ['spreadsheet', 'check the on-call rota'],
              ['phone', 'wake the real owner'],
            ],
            after: [['FerrisTrace', 'owner and on-call are on the incident, visible to all']],
            result: 'Everyone can see who is leading, so nobody has to ask in the channel.',
          },
          {
            id: 'postmortem',
            Icon: FileSearch,
            title: 'The postmortem',
            before: [
              ['Slack', 'scroll the channel a week later'],
              ['Grafana', 're-find the graphs'],
              ['Docs', 'rebuild the timeline by hand'],
              ['Jira', 'create follow-ups one by one'],
            ],
            after: [
              ['FerrisTrace', 'open the draft built from the timeline'],
              ['FerrisTrace', 'edit, add follow-ups, publish'],
            ],
            result: 'The postmortem gets written while people still remember what happened.',
          },
        ]}
      />

      <Capabilities
        title="From the page to the postmortem."
        items={[
          {
            Icon: Bell,
            title: 'Alerts with evidence',
            body: 'Set thresholds on any signal. The alert arrives with the traces that crossed them.',
          },
          {
            Icon: UserCheck,
            title: 'Severity and ownership',
            body: 'Severity, owner and on-call are set the moment you open the incident.',
          },
          {
            Icon: History,
            title: 'Automatic timeline',
            body: 'Alerts, deploys, comments and status changes are added in order as they happen.',
          },
          {
            Icon: Layers,
            title: 'Telemetry in place',
            body: 'The traces, logs and metrics you attach stay on the incident for whoever joins late.',
          },
          {
            Icon: FileText,
            title: 'Postmortem drafts',
            body: 'The timeline turns into a first draft, so you edit instead of starting from nothing.',
          },
          {
            Icon: Bot,
            title: 'Agent summaries',
            body: 'An AI agent with its own FerrisKey identity can post the first summary.',
          },
        ]}
      />
      <ExploreGrid title="The rest of FerrisTrace." entries={others('incidents')} />
      <CtaBand
        title="Spend your next incident on the fix."
        body="Alerts, on-call and postmortems live in the same tool as your traces."
      />
    </PageShell>
  )
}

export function AiObservabilityPage() {
  return (
    <PageShell current="products">
      <PageHero
        sprite={aiObsSprite}
        eyebrow="AI observability"
        title="Know what every LLM call"
        accent="costs, and why."
        lead="Each model call is recorded with its tokens, cost and latency, broken down by feature and customer, and tied to the request that made it."
      >
        <AiCostExplorer />
        <p className="mt-4 text-center text-sm text-faint-foreground">
          Change the grouping and click a bar to see what is behind that number.
        </p>
      </PageHero>

      <ProblemTabs
        id="ai-problems"
        title="Simple questions, slow answers."
        description="What it takes today to answer basic questions about your LLM usage."
        problems={[
          {
            id: 'bill',
            Icon: DollarSign,
            title: 'The bill doubled',
            before: [
              ['provider console', 'see the total and not much else'],
              ['CSV export', 'download usage per API key'],
              ['spreadsheet', 'map keys to features by hand'],
              ['git', 'look for prompt changes that week'],
            ],
            after: [
              ['FerrisTrace', 'group spend by feature and spot the marked spike'],
              ['FerrisTrace', 'open it and find the dated prompt change on the calls'],
            ],
            result: 'You can explain the spike before the invoice lands.',
          },
          {
            id: 'slow',
            Icon: Timer,
            title: 'The AI feature feels slow',
            before: [
              ['logs', 'add timing logs around the model call'],
              ['deploy', 'ship them and wait for traffic'],
              ['logs', 'compare model time with total time'],
            ],
            after: [
              [
                'FerrisTrace',
                'open the request: retrieval, model and your code, timed side by side',
              ],
            ],
            result: 'You know which part to speed up before you touch the prompt.',
          },
          {
            id: 'answer',
            Icon: MessageSquare,
            title: 'Someone got a wrong answer',
            before: [
              ['support', 'ask the customer for a timestamp'],
              ['logs', 'search around that time'],
              ['provider console', 'guess the model version used'],
            ],
            after: [
              ['FerrisTrace', 'find the call by user: model, parameters and tokens on the span'],
            ],
            result: 'You can tell support which model answered, and with which parameters.',
          },
        ]}
      />

      <Capabilities
        title="Recorded on every call."
        items={[
          {
            Icon: DollarSign,
            title: 'Cost per call',
            body: "Worked out from prompt and completion tokens, at each model's rate.",
          },
          {
            Icon: Layers,
            title: 'Spend by any dimension',
            body: 'Group by feature, model, customer or environment.',
          },
          {
            Icon: Gauge,
            title: 'Latency in context',
            body: 'See model time inside the request, next to retrieval and your own code.',
          },
          {
            Icon: Bell,
            title: 'Spend alerts',
            body: 'Get an alert when a feature or a customer goes over the threshold you set.',
          },
          {
            Icon: Sparkles,
            title: 'Any provider',
            body: 'Built on the OpenTelemetry GenAI conventions, so you can change model vendors.',
          },
          {
            Icon: Search,
            title: 'Find any call',
            body: 'Look a call up by user, trace id, model or prompt version.',
          },
        ]}
      />
      <ExploreGrid title="The rest of FerrisTrace." entries={others('ai-observability')} />
      <CtaBand
        title="Put a number on every AI feature."
        body="Send your LLM calls over OpenTelemetry and the cost and latency come with them."
      />
    </PageShell>
  )
}

export function AiAgentsPage() {
  return (
    <PageShell current="products">
      <PageHero
        sprite={agentSprite}
        eyebrow="AI agents · secured by FerrisKey"
        title="Let AI agents investigate."
        accent="Keep the keys to production."
        lead="Agents can read your telemetry, summarise an incident and suggest a fix. Each one gets its own scoped token from FerrisKey that expires, and whatever it does goes in the audit log."
      >
        <AgentAccess />
        <p className="mt-4 text-center text-sm text-faint-foreground">
          Tick and untick the scopes and watch which of the agent's actions go through.
        </p>
      </PageHero>

      <ProblemTabs
        id="agent-problems"
        title="Access you can explain to security."
        description="How agents usually get access, and how it works with FerrisKey."
        problems={[
          {
            id: 'access',
            Icon: KeyRound,
            title: 'Giving an agent access',
            before: [
              ['admin UI', 'create an API token with full rights'],
              ['.env', 'paste it into the agent config'],
              ['memory', 'remember to revoke it someday'],
            ],
            after: [
              ['FerrisKey', 'register the agent, pick its scopes'],
              ['FerrisTrace', 'the agent signs in with a short-lived token'],
            ],
            result: 'Each agent signs in as itself and can only do what you ticked.',
          },
          {
            id: 'night',
            Icon: Clock,
            title: 'The 3 a.m. triage',
            before: [
              ['phone', 'wake up to the page'],
              ['laptop', 'open the dashboards'],
              ['logs', 'read through the errors'],
              ['Slack', 'write a first summary'],
            ],
            after: [
              ['agent', "reads the incident's traces and logs"],
              ['FerrisTrace', 'you open a summary already posted on the incident'],
            ],
            result: 'You wake up to a first summary instead of an empty channel.',
          },
          {
            id: 'audit',
            Icon: ListChecks,
            title: '"What did the agent do?"',
            before: [
              ['logs', "grep the agent's own logs, if any"],
              ['API gateway', 'search requests by token'],
              ['Slack', 'ask who configured it'],
            ],
            after: [['FerrisTrace', 'open the audit log, filtered by agent identity']],
            result: 'When someone asks what the agent touched, you have a list to show them.',
          },
        ]}
      />

      <Capabilities
        title="Guardrails included."
        items={[
          {
            Icon: KeyRound,
            title: 'One identity per agent',
            body: 'Agents sign in over OpenID Connect through FerrisKey, the same way your team does.',
          },
          {
            Icon: ShieldCheck,
            title: 'Scoped permissions',
            body: 'Scopes are set per agent and per project. Admin scopes can never be granted to an agent.',
          },
          {
            Icon: Clock,
            title: 'Short-lived tokens',
            body: 'Tokens expire and renew on their own, and you can revoke an agent with one click.',
          },
          {
            Icon: ListChecks,
            title: 'Audit log',
            body: 'Each read and write is recorded with the agent and the token that allowed it.',
          },
          {
            Icon: Search,
            title: 'Query API',
            body: 'Agents read traces, logs and metrics through the same API as your scripts.',
          },
          {
            Icon: MessageSquare,
            title: 'Incident comments',
            body: 'Agents post what they found on the incident, and a human decides what to do with it.',
          },
        ]}
      />
      <ExploreGrid title="The rest of FerrisTrace." entries={others('ai-agents')} />
      <CtaBand
        title="Give your agents a job, not your passwords."
        body="Register an agent in FerrisKey and let it take the first look at your next incident."
      />
    </PageShell>
  )
}
