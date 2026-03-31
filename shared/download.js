// Copyright 2019 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the “License”);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// <https://apache.org/licenses/LICENSE-2.0>.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const fs = require('node:fs');
const { finished } = require('node:stream/promises');
const { Readable } = require('node:stream');

const ProgressBar = require('progress');
const tempy = require('tempy');

async function download2(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Download error: .status=${res.status}`);
    }

    const bar = new ProgressBar('  [:bar] :percent', {
        complete: '=',
        incomplete: ' ',
        width: 72,
        total: 100,
    });
    const totalSize = res.headers.get('content-length');
    let recievedSize = 0;

    const filePath = tempy.file({
        name: 'jsvutmpf',
    });
    const fileTo = fs.createWriteStream(filePath);
    const body = res.body;
    const bodyStream = Readable.fromWeb(body);

    bodyStream.on('data', (data) => {
        recievedSize += data.length;
        const percent = recievedSize / totalSize;
        bar.update(percent);
    });

    // Clear the progress bar.
    console.log('\x1B[1A\x1B[2K\x1B[1A');

    const writer = bodyStream.pipe(fileTo);
    await finished(writer);
    return filePath;
}

module.exports = download2;
