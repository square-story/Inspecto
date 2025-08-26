// Helper function to convert SVG string to File
export const svgStringToFile = (svgString: string, filename: string = 'signature.svg'): File => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    return new File([blob], filename, { type: 'image/svg+xml' });
};