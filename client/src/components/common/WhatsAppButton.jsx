import React from 'react';

export const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.769L0 32l8.469-2.013A15.938 15.938 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.771-1.854l-.485-.289-5.029 1.196 1.219-4.906-.317-.503A13.268 13.268 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.28-9.907c-.397-.199-2.352-1.161-2.717-1.294-.364-.133-.63-.199-.895.199-.265.398-.996 1.294-1.221 1.56-.226.265-.451.298-.848.1-.397-.199-1.674-.617-3.19-1.967-1.178-1.05-1.975-2.35-2.207-2.747-.231-.398-.025-.613.174-.811.178-.178.397-.464.596-.696.199-.232.265-.398.397-.663.133-.265.066-.497-.033-.696-.099-.199-.895-2.156-1.228-2.951-.322-.775-.648-.669-.895-.681l-.762-.013c-.265 0-.696.099-1.061.497-.364.398-1.393 1.36-1.393 3.316s1.426 3.845 1.625 4.11c.199.265 2.808 4.287 6.803 6.012.952.411 1.694.657 2.274.841.955.303 1.824.26 2.511.158.766-.114 2.352-.961 2.684-1.89.332-.929.332-1.725.232-1.89-.099-.166-.364-.265-.762-.464z"/>
  </svg>
);

export const generateWhatsAppLink = (number, text) => {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};

export const WhatsAppButton = ({ number = "918077037277", text, label = "Send Inquiry via WhatsApp", className = "" }) => {
  const link = generateWhatsAppLink(number, text);
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-3.5 rounded-full font-semibold tracking-widest uppercase text-xs transition-all duration-300 shadow-luxury ${className}`}
    >
      <WhatsAppIcon />
      {label}
    </a>
  );
};
