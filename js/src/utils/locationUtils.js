export function goto(module, caseId, preview = false, extraParam={}) {
  let _extraParam = ''
  if(extraParam) {
    let paramArray = Object.keys(extraParam) || []
    paramArray.map((param, index) => {
      index == 0 ? _extraParam += '&' : null
      _extraParam += `${param}=${extraParam[param]}${index>paramArray.length-2?'':'&'}`
    })
  }
  window.location.href = '#/projects/' + caseId + '/' + module + (preview? '': '?action=edit') + _extraParam
}
