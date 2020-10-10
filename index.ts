import fs from 'fs'
import globby from 'globby'
import { resolve } from 'path'
import SVGo from 'svgo'
import { promisify } from 'util'

const exists = promisify(fs.exists)
const readFile = promisify(fs.readFile)
const rmdir = promisify(fs.rmdir)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

const distDir = resolve(__dirname, './dist')

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
    { removeXMLNS: false },
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
              data.attrs.xmlns = {
                name: 'xmlns',
                value: 'http://www.w3.org/2000/svg'
              }

              data.attrs.fill = {
                name: 'fill',
                value: 'currentColor'
              }

              if (data.attrs.stroke) {
                data.attrs.stroke.value = 'currentColor'
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

const normalize = (path: string): Output => {
  const [d, f] = path.split(/([\w\s]+?)(?:\.svg$)/g)

  return {
    to: resolve(distDir, d.replace('svg/', '')),
    name: f
      .toLowerCase()
      .replace(/^--/, '')
      .replace(/[^A-z0-9]+(.)/g, (_, c) => c.toUpperCase())
  }
}

const init = async () => {
  const list = new Map<string, { from: number; to: number }>()
  const files = await globby('./svg/**/*.svg')

  try {
    if (await exists(distDir)) {
      console.log('Deleting', distDir)
      await rmdir(distDir, { recursive: true })
    }

    console.log('Re-making', distDir)
    await mkdir(distDir, { recursive: true })
  } catch (err) {
    console.error(err)
  }

  for await (const f of files) {
    try {
      const { name, to } = await normalize(f)
      const input = await readFile(f, 'utf-8')
      const { data } = await svgo.optimize(input)

      const l0 = input.length * 2
      const l1 = data.length * 2

      if (!(await exists(to))) {
        await mkdir(to, { recursive: true })
      }

      if (l1 >= 512000) {
        throw new Error(
          `File ${name}.svg too large at ${Math.round(l1 / 1024)}KB, skipping.`
        )
      }

      await writeFile(resolve(to, `${name}.svg`), l1 < l0 ? data : input)

      list.set(f, { from: l0, to: l1 })
    } catch (err) {
      console.error(f, err)
    }
  }

  console.table(
    [...list.entries()]
      .sort((a, b) => b[1].to - a[1].to)
      .reduce(
        (acc, [k, { from, to }]) => ({
          ...acc,
          [k]: {
            from: `${Math.round(from / 1024)} KB`,
            to: `${Math.round(to / 1024)} KB`
          }
        }),
        {}
      )
  )
}

init()

interface Output {
  to: string
  name: string
}
