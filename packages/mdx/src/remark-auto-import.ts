import { parse } from 'acorn'

/**
 * Injects component imports into every MDX file so pages do not have to
 * declare them. An explicit import wins over the `components` prop, so this
 * list is what an app actually gets: override an entry to swap a component,
 * add one to expose a new component to MDX.
 */
const DEFAULT_IMPORTS: Record<string, string> = {
  Callout: '@cometrace/mdx/components/callout.astro',
  CardGroup: '@cometrace/mdx/components/card-group.astro',
  Card: '@cometrace/mdx/components/card.astro',
  Steps: '@cometrace/mdx/components/steps.astro',
  Step: '@cometrace/mdx/components/step.astro',
  Tabs: '@cometrace/mdx/components/tabs.astro',
  Tab: '@cometrace/mdx/components/tab.astro',
  CodeGroup: '@cometrace/mdx/components/code-group.astro',
  Preview: '@cometrace/mdx/components/preview.astro',
  PreviewDemo: '@cometrace/mdx/components/preview-demo.astro',
  PreviewCode: '@cometrace/mdx/components/preview-code.astro',
  MathBlock: '@cometrace/mdx/components/math.astro',
  MermaidBlock: '@cometrace/mdx/components/mermaid.astro',
}

export interface AutoImportOptions {
  /** Component name to module specifier. Merged over the defaults. */
  components?: Record<string, string>
}

export function remarkAutoImport(options: AutoImportOptions = {}) {
  const imports = { ...DEFAULT_IMPORTS, ...options.components }
  const importBlock = Object.entries(imports)
    .map(([name, specifier]) => `import ${name} from '${specifier}'`)
    .join('\n')

  const estree = parse(importBlock, { ecmaVersion: 'latest', sourceType: 'module' })

  return (tree: any) => {
    tree.children.unshift({ type: 'mdxjsEsm', value: importBlock, data: { estree } })
  }
}
