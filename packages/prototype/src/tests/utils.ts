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

import { asTreeTextWith, INodeBase } from "@lionweb/class-core"
import { idOf } from "@lionweb/core"

/**
 * @return the tree-based textualization of the given {@link INodeBase nodes}.
 * This is primarily for testing convenience!
 */
export const asTreeText = (...nodes: INodeBase[]) => asTreeTextWith(idOf)(nodes)

