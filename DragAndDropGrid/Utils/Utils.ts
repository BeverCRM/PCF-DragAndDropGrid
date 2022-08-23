export function readFileAsync(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function getEntityPluralName(entityName: string) : string {
  let plural = '';
  if (entityName !== null) {

    const lastChar = entityName.length > 0 ? entityName.slice(-1) : '';
    const lastTwoChars = entityName.length > 1 ? entityName.slice(-2) : '';

    if (lastChar === 's' || lastChar === 'x' || lastChar === 'z' ||
    lastTwoChars === 'ch' || lastTwoChars === 'sh') {
      plural = `${entityName}es`;
    }
    else if (lastChar === 'y') {
      plural = `${entityName.slice(0, entityName.length - 1)}ies`;
    }
    else {
      plural = `${entityName}s`;
    }
  }
  return plural;
}
