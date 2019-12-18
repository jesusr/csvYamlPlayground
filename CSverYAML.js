const fs = require('fs'),
    csv = require('csv-parser');

const CSVFilePath = '/TOP25 intents EME - Sin formato - Hoja 1.csv';

async function readCSVFile() {
    return new Promise((res, rej) => {
        console.log(`${__dirname}${CSVFilePath}`);
        fs.createReadStream(`${__dirname}${CSVFilePath}`).pipe(csv(['number', 'text', 'intent']))
            .on('data', row => createCustomYaml(row))
            .on('end', () => {
                res();
                console.log('CSV file successfully processed');
            });
    });
}

function createCustomYaml(row) {
    console.log('writing ', row.number);
    fs.writeFileSync(`${__dirname}/test_${row.number}.yaml`, YAMLTextCreate(row));
}

function YAMLTextCreate({ number, text, intent }) {
    return `# Csv que va ha generar el Script
    # Mandatory entry
    endpoint: https://eme-qa-principal.appspot.com/v1/dispatcher
    # Mandatory entry
    language: es
    # Mandatory entry. To identify the test
    name: csv_${number}
    # Optional entry
    description: Prueba para el dispatcher.
    type: csv
    steps:
      - step:
          header:
            - x-from: Mutua-Ecosystem
          name: csv_${number}
          text: ${text}
          response:
            - queryResult.intent.name: ${intent}
            #- agentName: polizas
    `;
}
async function app() {
    await readCSVFile();
}
app();

