import fs, { unlink } from 'fs'
import globby from 'globby'
import { resolve } from 'path'
import SVGo from 'svgo'
import { promisify } from 'util'

const exists = promisify(fs.exists)
const readFile = promisify(fs.readFile)
const rmdir = promisify(fs.rmdir)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)
const unlink = promisify(fs.unlink)

const distDir = resolve(__dirname, '../dist')

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

const normalize = (path: string): Maybe<Output> => {
  try {
    const [, d, f] = path.match(/^src\/svg\/(.*)?\/(.*)?\.svg/)

    return {
      from: path,
      to: resolve(distDir, camelize(d)),
      name: camelize(f)
    }
  } catch (_) {}
}

const init = async () => {
  const files = await globby('**/*.svg')

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
      const res = await normalize(f)

      if (res) {
        const { name, from, to } = res
        const input = await readFile(from, 'utf-8')
        const { data } = await svgo.optimize(input)

        if (!(await exists(to))) {
          console.log('Making', to)
          await mkdir(to, { recursive: true })
        }

        await writeFile(resolve(to, `${name}.svg`), data, {
          flag: 'w'
        })
      }
    } catch (err) {
      console.error(f, err)
    }
  }

  console.log('Done!')
}

init()

interface Output {
  from: string
  to: string
  name: string
}
