const fs = require('fs');
const body = JSON.parse(fs.readFileSync('template-body.json', 'utf8'))
const templateObj = {
  templateBody: JSON.stringify(body),
  roleArn : 'arn:aws:iam::${account}:role/JITPRole'
}
const templateStr = JSON.stringify(templateObj, null, '    ')
  .replace(/\$\{account}/g, process.env.account || 'xxxxxxxxxxxx')

fs.writeFileSync('provisioning-template.json', templateStr)
