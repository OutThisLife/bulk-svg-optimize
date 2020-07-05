"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var fs_1 = require("fs");
var globby = require("globby");
var path_1 = require("path");
var SVGo = require("svgo");
var svgo = new SVGo({
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
                fn: function (data) {
                    try {
                        if (data.isElem('path')) {
                            delete data.attrs.fill;
                            delete data.attrs.stroke;
                        }
                        else if (data.isElem('svg')) {
                            if (data.attrs.stroke) {
                                data.attrs.stroke.value = 'currentColor';
                            }
                            data.attrs.fill = {
                                name: 'fill',
                                value: 'currentColor'
                            };
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                    return data;
                }
            }
        }
    ]
});
// https://regexr.com/
exports.camelize = function (str) {
    return str
        .toLowerCase()
        .replace(/^--/, '')
        .replace(/[^A-z0-9]+(.)/g, function (_, c) { return c.toUpperCase(); });
};
var normalize = function (path) {
    var _a = path.match(/^src\/svg\/(.*)?\/(.*)?\.svg/), d = _a[1], f = _a[2];
    return {
        from: path,
        to: "dist/" + exports.camelize(d),
        name: exports.camelize(f)
    };
};
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    var files, distDir, _a, _b, _c, from, to, name_1, input, data, e_1_1, err_1;
    var e_1, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, globby('**/*.svg')];
            case 1:
                files = _e.sent();
                distDir = path_1.resolve(__dirname, '../dist');
                if (!fs_1.existsSync(distDir)) {
                    fs_1.mkdirSync(distDir);
                }
                _e.label = 2;
            case 2:
                _e.trys.push([2, 16, , 17]);
                _e.label = 3;
            case 3:
                _e.trys.push([3, 9, 10, 15]);
                _a = __asyncValues(files.map(normalize));
                _e.label = 4;
            case 4: return [4 /*yield*/, _a.next()];
            case 5:
                if (!(_b = _e.sent(), !_b.done)) return [3 /*break*/, 8];
                _c = _b.value, from = _c.from, to = _c.to, name_1 = _c.name;
                input = fs_1.readFileSync(from, 'utf-8');
                return [4 /*yield*/, svgo.optimize(input)];
            case 6:
                data = (_e.sent()).data;
                if (!fs_1.existsSync(to)) {
                    fs_1.mkdirSync(to);
                }
                fs_1.writeFileSync(path_1.resolve(to, name_1 + ".svg"), data, {
                    flag: 'w'
                });
                _e.label = 7;
            case 7: return [3 /*break*/, 4];
            case 8: return [3 /*break*/, 15];
            case 9:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 15];
            case 10:
                _e.trys.push([10, , 13, 14]);
                if (!(_b && !_b.done && (_d = _a["return"]))) return [3 /*break*/, 12];
                return [4 /*yield*/, _d.call(_a)];
            case 11:
                _e.sent();
                _e.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 14: return [7 /*endfinally*/];
            case 15: return [3 /*break*/, 17];
            case 16:
                err_1 = _e.sent();
                console.warn(err_1);
                return [3 /*break*/, 17];
            case 17: return [2 /*return*/];
        }
    });
}); };
init();
