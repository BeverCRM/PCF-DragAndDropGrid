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

export function merge(acc: any, [ k, v ]: any)
{
  if (k in acc) {
    acc[k] = [acc[k]].flat().concat(v);
  }
  else {
    acc[k] = v;
  }
  return acc;
}

export function arrayBufferToBase64(buffer: any) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
