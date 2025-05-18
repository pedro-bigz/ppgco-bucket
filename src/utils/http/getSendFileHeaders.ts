import { File as FileMetadata } from 'src/files';

export function getSendFileHeaders(
  metadata: FileMetadata,
  disposition: string,
  file: Buffer,
) {
  return {
    'Content-Type': metadata.mimeType,
    'Content-Disposition': `${disposition}; filename="${metadata.name}${metadata.extension}"`,
    'Content-Transfer-Encoding': 'binary',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'private',
    'Content-Length': file.byteLength,
    Pragma: 'private',
  };
}
