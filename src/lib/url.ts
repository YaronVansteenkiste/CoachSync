/**
 * Get the production url for a path
 * @param {string} path
 * @returns {string}
 */
export function url(path: string = ""): string {
    const base = process.env.NEXT_PUBLIC_DEPLOYMENT_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;
  
    if (base) return `https://${base}${path}`;
  
    return `http://localhost:${process.env.PORT ?? 3000}` + path;
  }