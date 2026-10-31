import { Band, Column } from './frame'
import { H2, H3, Intro } from './ui'

/**
 * The problem, before the product. The hero says what this is; nothing until
 * here said what hurts without it, and a visitor who scans the page needs the
 * argument before the sixth section.
 *
 * Three statements about the reader's own situation, not about a competitor:
 * the comparison band carries the named claims and the sources for them.
 */
const reasons = [
  {
    title: 'The bill follows your traffic',
    body: 'Hosted observability is priced on events or on gigabytes. The month something goes wrong is the month you send the most data, so the bill peaks exactly when you can least afford to sample it away.',
  },
  {
    title: 'Your traces carry your users',
    body: 'Request paths, account ids, headers, payload fragments. Sending all of it to a third party is a decision you have to defend — to a customer, an auditor, or a procurement form.',
  },
  {
    title: 'Instrumentation outlives the vendor',
    body: 'The work is in instrumenting your services, not in the backend that reads it. OpenTelemetry keeps that work yours: pointing it somewhere else is one environment variable.',
  },
]

export function Why() {
  return (
    <Band labelledBy="why-title">
      <Column className="py-[88px]">
        <H2 id="why-title">Why run it yourself</H2>
        <Intro className="mt-5">
          Three things that do not get better as you grow.
        </Intro>

        <div className="mt-7 grid gap-x-10 gap-y-7 md:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="border-t border-border pt-5">
              <H3>{reason.title}</H3>
              <p className="mt-2 text-[15px] leading-[23px] text-muted-foreground">
                {reason.body}
              </p>
            </div>
          ))}
        </div>
      </Column>
    </Band>
  )
}
