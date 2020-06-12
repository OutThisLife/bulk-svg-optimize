import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import globby from 'globby'
import { resolve } from 'path'
import SVGo from 'svgo'

const svgo = new SVGo({
  floatPrecision: 8,
  plugins: [
    { cleanupAttrs: true },
    { cleanupEnableBackground: true },
    { cleanupListOfValues: true },
    { cleanupNumericValues: true },
    { collapseGroups: true },
    { convertColors: true },
    { convertEllipseToCircle: true },
    { convertPathData: true },
    { convertShapeToPath: true },
    { convertStyleToAttrs: true },
    { convertTransform: true },
    { inlineStyles: true },
    { mergePaths: true },
    { minifyStyles: true },
    { removeDesc: true },
    { removeDimensions: true },
    { removeDoctype: true },
    { removeEditorsNSData: true },
    { removeEmptyAttrs: true },
    { removeEmptyContainers: true },
    { removeHiddenElems: true },
    { removeMetadata: true },
    { removeNonInheritableGroupAttrs: true },
    { removeRasterImages: true },
    { removeScriptElement: true },
    { removeTitle: true },
    { removeUnknownsAndDefaults: true },
    { removeUnusedNS: true },
    { removeUselessDefs: true },
    { removeUselessStrokeAndFill: true },
    { removeXMLNS: true },
    { sortAttrs: true },
    { sortDefsChildren: true },
    { removeViewBox: true },
    {
      Custom: {
        type: 'perItem',
        fn: data => {
          try {
            if (data.isElem('path')) {
              delete data.attrs.fill
              delete data.attrs.stroke
            } else if (data.isElem('svg')) {
              if (data.attrs.stroke) {
                data.attrs.stroke.value = 'currentColor'
              }

              data.attrs.fill = {
                name: 'fill',
                value: 'currentColor'
              }
            }
          } catch (err) {
            console.error(err)
          }

          return data
        }
      }
    }
  ] as any
})

// https://regexr.com/
export const camelize = (str: string) =>
  str
    .toLowerCase()
    .replace(/^--/, '')
    .replace(/[^A-z0-9]+(.)/g, (_, c) => c.toUpperCase())

const normalize = (path: string): Output => {
  const [, d, f] = path.match(/^src\/svg\/(.*)?\/(.*)?\.svg/)

  return {
    from: path,
    to: `dist/${camelize(d)}`,
    name: camelize(f)
  }
}

const init = async () => {
  const files = await globby('**/*.svg')
  const distDir = resolve(__dirname, '../dist')

  if (!existsSync(distDir)) {
    mkdirSync(distDir)
  }

  for await (const { from, to, name } of files.map(normalize)) {
    const input = readFileSync(from, 'utf-8')
    const { data } = await svgo.optimize(input)

    if (!existsSync(to)) {
      mkdirSync(to)
    }

    writeFileSync(resolve(to, `${name}.svg`), data, {
      flag: 'w'
    })
  }
}

init()

interface Output {
  from: string
  to: string
  name: string
}
