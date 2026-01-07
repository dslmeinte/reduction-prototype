import { generateLanguage } from "@lionweb/class-core-generator"
import { generatePlantUmlForLanguage, languageAsText } from "@lionweb/utilities"
import { writeFileSync } from "fs"
import { join } from "path"

import { languageName, reductionDSLLanguage } from "./language-definition.js"
import { generateReducersTemplate } from "./reductors-template-generator.js"


const language = reductionDSLLanguage

const artifactsPath = "artifacts"
writeFileSync(join(artifactsPath, `${languageName}.language.txt`), languageAsText(language))
writeFileSync(join(artifactsPath, `${languageName}.language.puml`), generatePlantUmlForLanguage(language))

const genPath = "../prototype/src/gen"
generateLanguage(language, genPath)

writeFileSync(join(genPath, "reducers-base.g.ts"), generateReducersTemplate())

