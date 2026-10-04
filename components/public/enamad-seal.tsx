/**
 * @file enamad-seal.tsx
 * @description Renders the eNAMAD (اینماد) electronic trust seal for the public footer.
 */

const ENAMAD_ID = '7915521';
const ENAMAD_CODE = '4rjk6UibDvw4EbYYaiDPQhcYaG7T6Pvl';

/**
 * eNAMAD checks the seal by the logo being served from its own host with the
 * site's origin as referrer, so the image is deliberately not vendored or
 * routed through next/image: either would hide the request from eNAMAD.
 * That host is the one third-party entry in the CSP's `img-src`.
 */
export function EnamadSeal() {
  return (
    <a
      referrerPolicy="origin"
      target="_blank"
      rel="noopener"
      href={`https://trustseal.enamad.ir/?id=${ENAMAD_ID}&Code=${ENAMAD_CODE}`}
      className="inline-flex rounded-lg bg-white p-1.5 shadow-sm"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        referrerPolicy="origin"
        src={`https://trustseal.enamad.ir/logo.aspx?id=${ENAMAD_ID}&Code=${ENAMAD_CODE}`}
        alt="نماد اعتماد الکترونیکی"
        className="size-16 cursor-pointer object-contain"
        // Not a DOM attribute React knows; eNAMAD's snippet carries it, so
        // it is spread to stay out of the intrinsic <img> prop types.
        {...{ code: ENAMAD_CODE }}
      />
    </a>
  );
}
