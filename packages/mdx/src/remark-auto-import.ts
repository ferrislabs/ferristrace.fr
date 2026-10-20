import { parse } from 'acorn'

/**
 * Injects component imports into every MDX file so pages do not have to
 * declare them. An explicit import wins over the `components` prop, so this
 * list is what an app actually gets: override an entry to swap a component,
 * add one to expose a new component to MDX.
 */
const DEFAULT_IMPORTS: Record<string, string> = {
  Callout: '@explainer/mdx/components/callout.astro',
  CardGroup: '@explainer/mdx/components/card-group.astro',
  Card: '@explainer/mdx/components/card.astro',
  Steps: '@explainer/mdx/components/steps.astro',
  Step: '@explainer/mdx/components/step.astro',
  Tabs: '@explainer/mdx/components/tabs.astro',
  Tab: '@explainer/mdx/components/tab.astro',
  CodeGroup: '@explainer/mdx/components/code-group.astro',
  Preview: '@explainer/mdx/components/preview.astro',
  PreviewDemo: '@explainer/mdx/components/preview-demo.astro',
  PreviewCode: '@explainer/mdx/components/preview-code.astro',
  MathBlock: '@explainer/mdx/components/math.astro',
  MermaidBlock: '@explainer/mdx/components/mermaid.astro',
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
