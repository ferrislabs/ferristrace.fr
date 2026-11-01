import { Bot, Boxes, KeyRound, Siren } from 'lucide-react'
import { ProblemTabs, type Problem } from '../marketing/problem-tabs'

const problems: Problem[] = [
  {
    id: 'infra',
    Icon: Boxes,
    title: 'A pod keeps crashing',
    before: [
      ['kubectl', 'describe the pod, read the events'],
      ['kubectl', 'logs --previous, find the stack trace'],
      ['ArgoCD', 'find which sync shipped the image'],
      ['Grafana', 'check whether memory was the limit'],
    ],
    after: [['FerrisTrace', 'click the red pod to see its deploy, restarts and last trace']],
    result: 'You see why it crashed and which version shipped it.',
  },
  {
    id: 'ai',
    Icon: Bot,
    title: 'The AI bill doubled overnight',
    before: [
      ['provider console', 'shows the total and that is it'],
      ['spreadsheet', 'map API keys to features by hand'],
      ['git', 'hunt for the prompt change'],
    ],
    after: [['FerrisTrace', 'group spend by feature and the spike sits under one of them']],
    result: 'You can trace every dollar back to a feature and a request.',
  },
  {
    id: 'incident',
    Icon: Siren,
    title: 'The 2 a.m. page',
    before: [
      ['PagerDuty', 'acknowledge the page'],
      ['Slack', 'open a channel, invite people'],
      ['Grafana', 'find the right dashboard'],
      ['Docs', 'rebuild the timeline for the postmortem'],
    ],
    after: [
      ['FerrisTrace', 'declare the incident from the alert, with evidence attached'],
      ['FerrisTrace', 'close it and start from a drafted postmortem'],
    ],
    result: 'A single timeline runs from the page to the postmortem.',
  },
  {
    id: 'agent',
    Icon: KeyRound,
    title: 'An agent needs production access',
    before: [
      ['admin UI', 'create a full-access API token'],
      ['.env', 'paste it into the agent config'],
      ['nobody', 'audits what the agent does'],
    ],
    after: [['FerrisKey', 'give the agent its own scoped identity that expires and gets audited']],
    result: 'Agents help without holding the keys to production.',
  },
]

export function Problems() {
  return (
    <ProblemTabs
      id="problems"
      title="Sound familiar?"
      description="Pick a bad day and compare how it goes with FerrisTrace."
      problems={problems}
    />
  )
}
