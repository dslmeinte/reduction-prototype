// Copyright 2026 TRUMPF Laser SE and other contributors
//
// Licensed under the Apache License, Version 2.0 (the "License")
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-FileCopyrightText: 2026 TRUMPF Laser SE and other contributors
// SPDX-License-Identifier: Apache-2.0

import { generateLanguage } from "@lionweb/class-core-generator"
import { generatePlantUmlForLanguage, languageAsText } from "@lionweb/utilities"
import { writeFileSync } from "fs"
import { join } from "path"

import { header } from "./header.js"
import { languageName, reductionDSLLanguage } from "./language-definition.js"
import { contentsOfReduciblesFile } from "./reducibles-generator.js"


const language = reductionDSLLanguage

const artifactsPath = "artifacts"
writeFileSync(join(artifactsPath, `${languageName}.language.txt`), languageAsText(language))
writeFileSync(join(artifactsPath, `${languageName}.language.puml`), generatePlantUmlForLanguage(language))

const genPath = "../prototype/src/gen"
generateLanguage(language, genPath, { header })

writeFileSync(join(genPath, "reducibles.g.ts"), contentsOfReduciblesFile())

