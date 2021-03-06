# Bulk SVG Optimizer

This runs through every SVG you put in `svg/` and cleans them up by running through SVGO w/ opinionated settings, and renaming to camelCase, as well as removing any hardset colours in fill or stroke to `currentColor`.

## How to use

1. Place all SVGs in `svg/`
2. Run `npm run build`

## SVGO Settings are set to:

- cleanupAttrs
- cleanupEnableBackground
- cleanupListOfValues
- cleanupNumericValues
- collapseGroups
- convertColors
- convertEllipseToCircle
- convertPathData
- convertShapeToPath
- convertStyleToAttrs
- convertTransform
- inlineStyles
- mergePaths
- minifyStyles
- removeDesc
- removeDimensions
- removeDoctype
- removeEditorsNSData
- removeEmptyAttrs
- removeEmptyContainers
- removeHiddenElems
- removeMetadata
- removeNonInheritableGroupAttrs
- removeRasterImages
- removeScriptElement
- removeTitle
- removeUnknownsAndDefaults
- removeUnusedNS
- removeUselessDefs
- removeUselessStrokeAndFill
- removeXMLNS
- sortAttrs
- sortDefsChildren
- removeViewBox
